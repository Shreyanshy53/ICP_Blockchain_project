use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<u8, u64, Memory>;
type UserStore = StableBTreeMap<Principal, User, Memory>;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum UserRole {
    Educator,
    Learner,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct User {
    pub id: u64,
    pub principal: Principal,
    pub role: UserRole,
    pub name: String,
    pub email: String,
    pub avatar: Option<String>,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateUserPayload {
    pub role: UserRole,
    pub name: String,
    pub email: String,
    pub avatar: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UpdateUserPayload {
    pub name: Option<String>,
    pub email: Option<String>,
    pub avatar: Option<String>,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_COUNTER: RefCell<IdStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    static USER_STORAGE: RefCell<UserStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );
}

fn get_next_id() -> u64 {
    ID_COUNTER.with(|counter| {
        let current_id = counter.borrow().get(&0).unwrap_or(0);
        let next_id = current_id + 1;
        counter.borrow_mut().insert(0, next_id);
        next_id
    })
}

#[ic_cdk::query]
fn get_user(principal: Principal) -> Option<User> {
    USER_STORAGE.with(|storage| storage.borrow().get(&principal))
}

#[ic_cdk::query]
fn get_current_user() -> Option<User> {
    let caller = ic_cdk::caller();
    get_user(caller)
}

#[ic_cdk::update]
fn create_user(payload: CreateUserPayload) -> Result<User, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot create accounts".to_string());
    }

    USER_STORAGE.with(|storage| {
        if storage.borrow().contains_key(&caller) {
            return Err("User already exists".to_string());
        }

        let user = User {
            id: get_next_id(),
            principal: caller,
            role: payload.role,
            name: payload.name,
            email: payload.email,
            avatar: payload.avatar,
            created_at: time(),
            updated_at: time(),
        };

        storage.borrow_mut().insert(caller, user.clone());
        Ok(user)
    })
}

#[ic_cdk::update]
fn update_user(payload: UpdateUserPayload) -> Result<User, String> {
    let caller = ic_cdk::caller();
    
    USER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        match storage.get(&caller) {
            Some(mut user) => {
                if let Some(name) = payload.name {
                    user.name = name;
                }
                if let Some(email) = payload.email {
                    user.email = email;
                }
                if let Some(avatar) = payload.avatar {
                    user.avatar = Some(avatar);
                }
                user.updated_at = time();
                
                storage.insert(caller, user.clone());
                Ok(user)
            }
            None => Err("User not found".to_string()),
        }
    })
}

#[ic_cdk::query]
fn get_all_users() -> Vec<User> {
    USER_STORAGE.with(|storage| {
        storage.borrow().iter().map(|(_, user)| user).collect()
    })
}

#[ic_cdk::query]
fn get_users_by_role(role: UserRole) -> Vec<User> {
    USER_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, user)| {
                if std::mem::discriminant(&user.role) == std::mem::discriminant(&role) {
                    Some(user)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::update]
fn delete_user() -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    USER_STORAGE.with(|storage| {
        match storage.borrow_mut().remove(&caller) {
            Some(_) => Ok("User deleted successfully".to_string()),
            None => Err("User not found".to_string()),
        }
    })
}

// Export Candid interface
ic_cdk::export_candid!();