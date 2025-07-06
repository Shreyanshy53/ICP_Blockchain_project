use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<u8, u64, Memory>;
type CourseStore = StableBTreeMap<u64, Course, Memory>;
type EnrollmentStore = StableBTreeMap<(Principal, u64), Enrollment, Memory>;
type ProgressStore = StableBTreeMap<(Principal, u64, u64), LessonProgress, Memory>;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum CourseLevel {
    Beginner,
    Intermediate,
    Advanced,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Lesson {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub duration: String,
    pub order: u32,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Course {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub educator: Principal,
    pub lessons: Vec<Lesson>,
    pub level: CourseLevel,
    pub image: String,
    pub tags: Vec<String>,
    pub duration: String,
    pub enrolled_students: u64,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Enrollment {
    pub student: Principal,
    pub course_id: u64,
    pub enrolled_at: u64,
    pub completed: bool,
    pub completion_date: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct LessonProgress {
    pub student: Principal,
    pub course_id: u64,
    pub lesson_id: u64,
    pub completed: bool,
    pub completed_at: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateCoursePayload {
    pub title: String,
    pub description: String,
    pub lessons: Vec<CreateLessonPayload>,
    pub level: CourseLevel,
    pub image: String,
    pub tags: Vec<String>,
    pub duration: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateLessonPayload {
    pub title: String,
    pub content: String,
    pub duration: String,
    pub order: u32,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UpdateCoursePayload {
    pub title: Option<String>,
    pub description: Option<String>,
    pub level: Option<CourseLevel>,
    pub image: Option<String>,
    pub tags: Option<Vec<String>>,
    pub duration: Option<String>,
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

    static COURSE_STORAGE: RefCell<CourseStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    static ENROLLMENT_STORAGE: RefCell<EnrollmentStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );

    static PROGRESS_STORAGE: RefCell<ProgressStore> = RefCell::new(
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
fn create_course(payload: CreateCoursePayload) -> Result<Course, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot create courses".to_string());
    }

    let course_id = get_next_id();
    let lessons: Vec<Lesson> = payload
        .lessons
        .into_iter()
        .enumerate()
        .map(|(index, lesson_payload)| Lesson {
            id: (index + 1) as u64,
            title: lesson_payload.title,
            content: lesson_payload.content,
            duration: lesson_payload.duration,
            order: lesson_payload.order,
        })
        .collect();

    let course = Course {
        id: course_id,
        title: payload.title,
        description: payload.description,
        educator: caller,
        lessons,
        level: payload.level,
        image: payload.image,
        tags: payload.tags,
        duration: payload.duration,
        enrolled_students: 0,
        created_at: time(),
        updated_at: time(),
    };

    COURSE_STORAGE.with(|storage| {
        storage.borrow_mut().insert(course_id, course.clone());
        Ok(course)
    })
}

#[ic_cdk::query]
fn get_course(course_id: u64) -> Option<Course> {
    COURSE_STORAGE.with(|storage| storage.borrow().get(&course_id))
}

#[ic_cdk::query]
fn get_all_courses() -> Vec<Course> {
    COURSE_STORAGE.with(|storage| {
        storage.borrow().iter().map(|(_, course)| course).collect()
    })
}

#[ic_cdk::query]
fn get_courses_by_educator(educator: Principal) -> Vec<Course> {
    COURSE_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, course)| {
                if course.educator == educator {
                    Some(course)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::update]
fn update_course(course_id: u64, payload: UpdateCoursePayload) -> Result<Course, String> {
    let caller = ic_cdk::caller();
    
    COURSE_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        match storage.get(&course_id) {
            Some(mut course) => {
                if course.educator != caller {
                    return Err("Only the course educator can update this course".to_string());
                }

                if let Some(title) = payload.title {
                    course.title = title;
                }
                if let Some(description) = payload.description {
                    course.description = description;
                }
                if let Some(level) = payload.level {
                    course.level = level;
                }
                if let Some(image) = payload.image {
                    course.image = image;
                }
                if let Some(tags) = payload.tags {
                    course.tags = tags;
                }
                if let Some(duration) = payload.duration {
                    course.duration = duration;
                }
                course.updated_at = time();
                
                storage.insert(course_id, course.clone());
                Ok(course)
            }
            None => Err("Course not found".to_string()),
        }
    })
}

#[ic_cdk::update]
fn enroll_in_course(course_id: u64) -> Result<Enrollment, String> {
    let caller = ic_cdk::caller();
    
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot enroll in courses".to_string());
    }

    // Check if course exists
    let course_exists = COURSE_STORAGE.with(|storage| {
        storage.borrow().contains_key(&course_id)
    });

    if !course_exists {
        return Err("Course not found".to_string());
    }

    // Check if already enrolled
    let enrollment_key = (caller, course_id);
    let already_enrolled = ENROLLMENT_STORAGE.with(|storage| {
        storage.borrow().contains_key(&enrollment_key)
    });

    if already_enrolled {
        return Err("Already enrolled in this course".to_string());
    }

    let enrollment = Enrollment {
        student: caller,
        course_id,
        enrolled_at: time(),
        completed: false,
        completion_date: None,
    };

    ENROLLMENT_STORAGE.with(|storage| {
        storage.borrow_mut().insert(enrollment_key, enrollment.clone());
    });

    // Update enrolled students count
    COURSE_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        if let Some(mut course) = storage.get(&course_id) {
            course.enrolled_students += 1;
            storage.insert(course_id, course);
        }
    });

    Ok(enrollment)
}

#[ic_cdk::update]
fn complete_lesson(course_id: u64, lesson_id: u64) -> Result<LessonProgress, String> {
    let caller = ic_cdk::caller();
    
    // Check if enrolled in course
    let enrollment_key = (caller, course_id);
    let is_enrolled = ENROLLMENT_STORAGE.with(|storage| {
        storage.borrow().contains_key(&enrollment_key)
    });

    if !is_enrolled {
        return Err("Not enrolled in this course".to_string());
    }

    let progress_key = (caller, course_id, lesson_id);
    let progress = LessonProgress {
        student: caller,
        course_id,
        lesson_id,
        completed: true,
        completed_at: Some(time()),
    };

    PROGRESS_STORAGE.with(|storage| {
        storage.borrow_mut().insert(progress_key, progress.clone());
    });

    Ok(progress)
}

#[ic_cdk::update]
fn complete_course(course_id: u64) -> Result<Enrollment, String> {
    let caller = ic_cdk::caller();
    
    let enrollment_key = (caller, course_id);
    ENROLLMENT_STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        match storage.get(&enrollment_key) {
            Some(mut enrollment) => {
                enrollment.completed = true;
                enrollment.completion_date = Some(time());
                storage.insert(enrollment_key, enrollment.clone());
                Ok(enrollment)
            }
            None => Err("Not enrolled in this course".to_string()),
        }
    })
}

#[ic_cdk::query]
fn get_student_enrollments(student: Principal) -> Vec<Enrollment> {
    ENROLLMENT_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|((s, _), enrollment)| {
                if s == student {
                    Some(enrollment)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_course_enrollments(course_id: u64) -> Vec<Enrollment> {
    ENROLLMENT_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|((_, c_id), enrollment)| {
                if c_id == course_id {
                    Some(enrollment)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_lesson_progress(student: Principal, course_id: u64) -> Vec<LessonProgress> {
    PROGRESS_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|((s, c_id, _), progress)| {
                if s == student && c_id == course_id {
                    Some(progress)
                } else {
                    None
                }
            })
            .collect()
    })
}

// Export Candid interface
ic_cdk::export_candid!();