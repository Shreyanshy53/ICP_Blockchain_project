use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<u8, u64, Memory>;
type QuestionStore = StableBTreeMap<u64, Question, Memory>;
type AnswerStore = StableBTreeMap<u64, Answer, Memory>;
type StudyGroupStore = StableBTreeMap<u64, StudyGroup, Memory>;
type GroupMemberStore = StableBTreeMap<(u64, Principal), GroupMembership, Memory>;
type VoteStore = StableBTreeMap<(Principal, u64, VoteType), Vote, Memory>;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum VoteType {
    Question,
    Answer,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Question {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub author: Principal,
    pub tags: Vec<String>,
    pub votes: i32,
    pub answer_count: u32,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Answer {
    pub id: u64,
    pub question_id: u64,
    pub content: String,
    pub author: Principal,
    pub votes: i32,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct StudyGroup {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub creator: Principal,
    pub tags: Vec<String>,
    pub member_count: u32,
    pub max_members: u32,
    pub is_public: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct GroupMembership {
    pub group_id: u64,
    pub member: Principal,
    pub joined_at: u64,
    pub is_moderator: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Vote {
    pub voter: Principal,
    pub target_id: u64,
    pub vote_type: VoteType,
    pub is_upvote: bool,
    pub created_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateQuestionPayload {
    pub title: String,
    pub content: String,
    pub tags: Vec<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateAnswerPayload {
    pub question_id: u64,
    pub content: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateStudyGroupPayload {
    pub name: String,
    pub description: String,
    pub tags: Vec<String>,
    pub max_members: u32,
    pub is_public: bool,
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

    static QUESTION_STORAGE: RefCell<QuestionStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    static ANSWER_STORAGE: RefCell<AnswerStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );

    static STUDY_GROUP_STORAGE: RefCell<StudyGroupStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
        )
    );

    static GROUP_MEMBER_STORAGE: RefCell<GroupMemberStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4)))
        )
    );

    static VOTE_STORAGE: RefCell<VoteStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5)))
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

// Question Management
#[ic_cdk::update]
fn create_question(payload: CreateQuestionPayload) -> Result<Question, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot create questions".to_string());
    }

    let question_id = get_next_id();
    let question = Question {
        id: question_id,
        title: payload.title,
        content: payload.content,
        author: caller,
        tags: payload.tags,
        votes: 0,
        answer_count: 0,
        created_at: time(),
        updated_at: time(),
    };

    QUESTION_STORAGE.with(|storage| {
        storage.borrow_mut().insert(question_id, question.clone());
        Ok(question)
    })
}

#[ic_cdk::query]
fn get_question(question_id: u64) -> Option<Question> {
    QUESTION_STORAGE.with(|storage| storage.borrow().get(&question_id))
}

#[ic_cdk::query]
fn get_all_questions() -> Vec<Question> {
    QUESTION_STORAGE.with(|storage| {
        let mut questions: Vec<Question> = storage.borrow().iter().map(|(_, q)| q).collect();
        questions.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        questions
    })
}

#[ic_cdk::query]
fn get_questions_by_tag(tag: String) -> Vec<Question> {
    QUESTION_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, question)| {
                if question.tags.contains(&tag) {
                    Some(question)
                } else {
                    None
                }
            })
            .collect()
    })
}

// Answer Management
#[ic_cdk::update]
fn create_answer(payload: CreateAnswerPayload) -> Result<Answer, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot create answers".to_string());
    }

    // Check if question exists
    let question_exists = QUESTION_STORAGE.with(|storage| {
        storage.borrow().contains_key(&payload.question_id)
    });

    if !question_exists {
        return Err("Question not found".to_string());
    }

    let answer_id = get_next_id();
    let answer = Answer {
        id: answer_id,
        question_id: payload.question_id,
        content: payload.content,
        author: caller,
        votes: 0,
        created_at: time(),
        updated_at: time(),
    };

    ANSWER_STORAGE.with(|storage| {
        storage.borrow_mut().insert(answer_id, answer.clone());
    });

    // Update question answer count
    QUESTION_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(mut question) = storage.get(&payload.question_id) {
            question.answer_count += 1;
            question.updated_at = time();
            storage.insert(payload.question_id, question);
        }
    });

    Ok(answer)
}

#[ic_cdk::query]
fn get_answers_for_question(question_id: u64) -> Vec<Answer> {
    ANSWER_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, answer)| {
                if answer.question_id == question_id {
                    Some(answer)
                } else {
                    None
                }
            })
            .collect()
    })
}

// Voting System
#[ic_cdk::update]
fn vote_question(question_id: u64, is_upvote: bool) -> Result<Question, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot vote".to_string());
    }

    let vote_key = (caller, question_id, VoteType::Question);
    
    // Check if user already voted
    let existing_vote = VOTE_STORAGE.with(|storage| {
        storage.borrow().get(&vote_key)
    });

    let vote_change = match existing_vote {
        Some(existing) => {
            if existing.is_upvote == is_upvote {
                return Err("Already voted".to_string());
            }
            if is_upvote { 2 } else { -2 } // Changing from down to up or vice versa
        }
        None => {
            if is_upvote { 1 } else { -1 } // New vote
        }
    };

    // Store the vote
    let vote = Vote {
        voter: caller,
        target_id: question_id,
        vote_type: VoteType::Question,
        is_upvote,
        created_at: time(),
    };

    VOTE_STORAGE.with(|storage| {
        storage.borrow_mut().insert(vote_key, vote);
    });

    // Update question votes
    QUESTION_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        match storage.get(&question_id) {
            Some(mut question) => {
                question.votes += vote_change;
                question.updated_at = time();
                storage.insert(question_id, question.clone());
                Ok(question)
            }
            None => Err("Question not found".to_string()),
        }
    })
}

#[ic_cdk::update]
fn vote_answer(answer_id: u64, is_upvote: bool) -> Result<Answer, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot vote".to_string());
    }

    let vote_key = (caller, answer_id, VoteType::Answer);
    
    // Check if user already voted
    let existing_vote = VOTE_STORAGE.with(|storage| {
        storage.borrow().get(&vote_key)
    });

    let vote_change = match existing_vote {
        Some(existing) => {
            if existing.is_upvote == is_upvote {
                return Err("Already voted".to_string());
            }
            if is_upvote { 2 } else { -2 }
        }
        None => {
            if is_upvote { 1 } else { -1 }
        }
    };

    // Store the vote
    let vote = Vote {
        voter: caller,
        target_id: answer_id,
        vote_type: VoteType::Answer,
        is_upvote,
        created_at: time(),
    };

    VOTE_STORAGE.with(|storage| {
        storage.borrow_mut().insert(vote_key, vote);
    });

    // Update answer votes
    ANSWER_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        match storage.get(&answer_id) {
            Some(mut answer) => {
                answer.votes += vote_change;
                answer.updated_at = time();
                storage.insert(answer_id, answer.clone());
                Ok(answer)
            }
            None => Err("Answer not found".to_string()),
        }
    })
}

// Study Group Management
#[ic_cdk::update]
fn create_study_group(payload: CreateStudyGroupPayload) -> Result<StudyGroup, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot create study groups".to_string());
    }

    let group_id = get_next_id();
    let study_group = StudyGroup {
        id: group_id,
        name: payload.name,
        description: payload.description,
        creator: caller,
        tags: payload.tags,
        member_count: 1, // Creator is automatically a member
        max_members: payload.max_members,
        is_public: payload.is_public,
        created_at: time(),
        updated_at: time(),
    };

    STUDY_GROUP_STORAGE.with(|storage| {
        storage.borrow_mut().insert(group_id, study_group.clone());
    });

    // Add creator as a member and moderator
    let membership = GroupMembership {
        group_id,
        member: caller,
        joined_at: time(),
        is_moderator: true,
    };

    GROUP_MEMBER_STORAGE.with(|storage| {
        storage.borrow_mut().insert((group_id, caller), membership);
    });

    Ok(study_group)
}

#[ic_cdk::update]
fn join_study_group(group_id: u64) -> Result<GroupMembership, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot join study groups".to_string());
    }

    // Check if group exists and has space
    let group = STUDY_GROUP_STORAGE.with(|storage| {
        storage.borrow().get(&group_id)
    });

    let group = match group {
        Some(g) => g,
        None => return Err("Study group not found".to_string()),
    };

    if group.member_count >= group.max_members {
        return Err("Study group is full".to_string());
    }

    // Check if already a member
    let membership_key = (group_id, caller);
    let already_member = GROUP_MEMBER_STORAGE.with(|storage| {
        storage.borrow().contains_key(&membership_key)
    });

    if already_member {
        return Err("Already a member of this study group".to_string());
    }

    // Create membership
    let membership = GroupMembership {
        group_id,
        member: caller,
        joined_at: time(),
        is_moderator: false,
    };

    GROUP_MEMBER_STORAGE.with(|storage| {
        storage.borrow_mut().insert(membership_key, membership.clone());
    });

    // Update group member count
    STUDY_GROUP_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(mut group) = storage.get(&group_id) {
            group.member_count += 1;
            group.updated_at = time();
            storage.insert(group_id, group);
        }
    });

    Ok(membership)
}

#[ic_cdk::query]
fn get_study_group(group_id: u64) -> Option<StudyGroup> {
    STUDY_GROUP_STORAGE.with(|storage| storage.borrow().get(&group_id))
}

#[ic_cdk::query]
fn get_all_study_groups() -> Vec<StudyGroup> {
    STUDY_GROUP_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, group)| {
                if group.is_public {
                    Some(group)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_user_study_groups(user: Principal) -> Vec<StudyGroup> {
    let group_ids: Vec<u64> = GROUP_MEMBER_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|((group_id, member), _)| {
                if member == user {
                    Some(group_id)
                } else {
                    None
                }
            })
            .collect()
    });

    STUDY_GROUP_STORAGE.with(|storage| {
        group_ids
            .iter()
            .filter_map(|&group_id| storage.borrow().get(&group_id))
            .collect()
    })
}

// Export Candid interface
ic_cdk::export_candid!();