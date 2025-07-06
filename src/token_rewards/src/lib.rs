use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<u8, u64, Memory>;
type BalanceStore = StableBTreeMap<Principal, u64, Memory>;
type TransactionStore = StableBTreeMap<u64, Transaction, Memory>;
type UserTransactionStore = StableBTreeMap<Principal, Vec<u64>, Memory>;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum TransactionType {
    CourseCompletion,
    LessonCompletion,
    CommunityHelp,
    QuestionAnswer,
    StudyGroupParticipation,
    Bonus,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Transaction {
    pub id: u64,
    pub user: Principal,
    pub transaction_type: TransactionType,
    pub amount: u64,
    pub description: String,
    pub timestamp: u64,
    pub related_id: Option<u64>, // course_id, question_id, etc.
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct RewardPayload {
    pub user: Principal,
    pub transaction_type: TransactionType,
    pub amount: u64,
    pub description: String,
    pub related_id: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct LeaderboardEntry {
    pub user: Principal,
    pub balance: u64,
    pub rank: u32,
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

    static BALANCE_STORAGE: RefCell<BalanceStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    static TRANSACTION_STORAGE: RefCell<TransactionStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );

    static USER_TRANSACTIONS: RefCell<UserTransactionStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
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

#[ic_cdk::update]
fn reward_user(payload: RewardPayload) -> Result<Transaction, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot reward tokens".to_string());
    }

    let transaction_id = get_next_id();
    let transaction = Transaction {
        id: transaction_id,
        user: payload.user,
        transaction_type: payload.transaction_type,
        amount: payload.amount,
        description: payload.description,
        timestamp: time(),
        related_id: payload.related_id,
    };

    // Update user balance
    BALANCE_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        let current_balance = storage.get(&payload.user).unwrap_or(0);
        storage.insert(payload.user, current_balance + payload.amount);
    });

    // Store transaction
    TRANSACTION_STORAGE.with(|storage| {
        storage.borrow_mut().insert(transaction_id, transaction.clone());
    });

    // Add to user's transaction history
    USER_TRANSACTIONS.with(|storage| {
        let mut storage = storage.borrow_mut();
        let mut transactions = storage.get(&payload.user).unwrap_or_default();
        transactions.push(transaction_id);
        storage.insert(payload.user, transactions);
    });

    Ok(transaction)
}

#[ic_cdk::query]
fn get_balance(user: Principal) -> u64 {
    BALANCE_STORAGE.with(|storage| {
        storage.borrow().get(&user).unwrap_or(0)
    })
}

#[ic_cdk::query]
fn get_user_transactions(user: Principal) -> Vec<Transaction> {
    USER_TRANSACTIONS.with(|user_storage| {
        let transaction_ids = user_storage.borrow().get(&user).unwrap_or_default();
        
        TRANSACTION_STORAGE.with(|tx_storage| {
            transaction_ids
                .iter()
                .filter_map(|&id| tx_storage.borrow().get(&id))
                .collect()
        })
    })
}

#[ic_cdk::query]
fn get_leaderboard(limit: u32) -> Vec<LeaderboardEntry> {
    BALANCE_STORAGE.with(|storage| {
        let mut entries: Vec<(Principal, u64)> = storage
            .borrow()
            .iter()
            .collect();
        
        // Sort by balance in descending order
        entries.sort_by(|a, b| b.1.cmp(&a.1));
        
        entries
            .into_iter()
            .take(limit as usize)
            .enumerate()
            .map(|(index, (user, balance))| LeaderboardEntry {
                user,
                balance,
                rank: (index + 1) as u32,
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_total_tokens_distributed() -> u64 {
    BALANCE_STORAGE.with(|storage| {
        storage.borrow().iter().map(|(_, balance)| balance).sum()
    })
}

#[ic_cdk::query]
fn get_transaction_history(limit: u32) -> Vec<Transaction> {
    TRANSACTION_STORAGE.with(|storage| {
        let mut transactions: Vec<Transaction> = storage
            .borrow()
            .iter()
            .map(|(_, tx)| tx)
            .collect();
        
        // Sort by timestamp in descending order
        transactions.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        
        transactions.into_iter().take(limit as usize).collect()
    })
}

// Predefined reward amounts for different actions
#[ic_cdk::update]
fn reward_course_completion(user: Principal, course_id: u64) -> Result<Transaction, String> {
    reward_user(RewardPayload {
        user,
        transaction_type: TransactionType::CourseCompletion,
        amount: 50,
        description: "Course completion reward".to_string(),
        related_id: Some(course_id),
    })
}

#[ic_cdk::update]
fn reward_lesson_completion(user: Principal, course_id: u64, lesson_id: u64) -> Result<Transaction, String> {
    reward_user(RewardPayload {
        user,
        transaction_type: TransactionType::LessonCompletion,
        amount: 5,
        description: "Lesson completion reward".to_string(),
        related_id: Some(lesson_id),
    })
}

#[ic_cdk::update]
fn reward_community_help(user: Principal, question_id: u64) -> Result<Transaction, String> {
    reward_user(RewardPayload {
        user,
        transaction_type: TransactionType::CommunityHelp,
        amount: 10,
        description: "Community help reward".to_string(),
        related_id: Some(question_id),
    })
}

// Export Candid interface
ic_cdk::export_candid!();