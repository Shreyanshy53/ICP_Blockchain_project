use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<u8, u64, Memory>;
type CertificateStore = StableBTreeMap<u64, Certificate, Memory>;
type StudentCertificateStore = StableBTreeMap<Principal, Vec<u64>, Memory>;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Certificate {
    pub id: u64,
    pub student: Principal,
    pub course_id: u64,
    pub course_title: String,
    pub educator: Principal,
    pub educator_name: String,
    pub issue_date: u64,
    pub verification_hash: String,
    pub metadata: CertificateMetadata,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CertificateMetadata {
    pub completion_date: u64,
    pub total_lessons: u32,
    pub course_duration: String,
    pub course_level: String,
    pub skills_acquired: Vec<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct IssueCertificatePayload {
    pub student: Principal,
    pub course_id: u64,
    pub course_title: String,
    pub educator: Principal,
    pub educator_name: String,
    pub metadata: CertificateMetadata,
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

    static CERTIFICATE_STORAGE: RefCell<CertificateStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );

    static STUDENT_CERTIFICATES: RefCell<StudentCertificateStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
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

fn generate_verification_hash(certificate_id: u64, student: Principal, course_id: u64, issue_date: u64) -> String {
    // Simple hash generation - in production, use proper cryptographic hashing
    format!("0x{:x}{:x}{:x}{:x}", 
        certificate_id, 
        student.as_slice().iter().fold(0u64, |acc, &b| acc.wrapping_mul(256).wrapping_add(b as u64)),
        course_id,
        issue_date
    )
}

#[ic_cdk::update]
fn issue_certificate(payload: IssueCertificatePayload) -> Result<Certificate, String> {
    let caller = ic_cdk::caller();
    
    // Only the educator or course management canister can issue certificates
    if caller == Principal::anonymous() {
        return Err("Anonymous users cannot issue certificates".to_string());
    }

    let certificate_id = get_next_id();
    let issue_date = time();
    let verification_hash = generate_verification_hash(
        certificate_id,
        payload.student,
        payload.course_id,
        issue_date,
    );

    let certificate = Certificate {
        id: certificate_id,
        student: payload.student,
        course_id: payload.course_id,
        course_title: payload.course_title,
        educator: payload.educator,
        educator_name: payload.educator_name,
        issue_date,
        verification_hash,
        metadata: payload.metadata,
    };

    CERTIFICATE_STORAGE.with(|storage| {
        storage.borrow_mut().insert(certificate_id, certificate.clone());
    });

    // Add to student's certificate list
    STUDENT_CERTIFICATES.with(|storage| {
        let mut storage = storage.borrow_mut();
        let mut certificates = storage.get(&payload.student).unwrap_or_default();
        certificates.push(certificate_id);
        storage.insert(payload.student, certificates);
    });

    Ok(certificate)
}

#[ic_cdk::query]
fn get_certificate(certificate_id: u64) -> Option<Certificate> {
    CERTIFICATE_STORAGE.with(|storage| storage.borrow().get(&certificate_id))
}

#[ic_cdk::query]
fn get_student_certificates(student: Principal) -> Vec<Certificate> {
    STUDENT_CERTIFICATES.with(|student_storage| {
        let certificate_ids = student_storage.borrow().get(&student).unwrap_or_default();
        
        CERTIFICATE_STORAGE.with(|cert_storage| {
            certificate_ids
                .iter()
                .filter_map(|&id| cert_storage.borrow().get(&id))
                .collect()
        })
    })
}

#[ic_cdk::query]
fn verify_certificate(verification_hash: String) -> Option<Certificate> {
    CERTIFICATE_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .find_map(|(_, cert)| {
                if cert.verification_hash == verification_hash {
                    Some(cert)
                } else {
                    None
                }
            })
    })
}

#[ic_cdk::query]
fn get_all_certificates() -> Vec<Certificate> {
    CERTIFICATE_STORAGE.with(|storage| {
        storage.borrow().iter().map(|(_, cert)| cert).collect()
    })
}

#[ic_cdk::query]
fn get_certificates_by_course(course_id: u64) -> Vec<Certificate> {
    CERTIFICATE_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, cert)| {
                if cert.course_id == course_id {
                    Some(cert)
                } else {
                    None
                }
            })
            .collect()
    })
}

#[ic_cdk::query]
fn get_certificates_by_educator(educator: Principal) -> Vec<Certificate> {
    CERTIFICATE_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter_map(|(_, cert)| {
                if cert.educator == educator {
                    Some(cert)
                } else {
                    None
                }
            })
            .collect()
    })
}

// Export Candid interface
ic_cdk::export_candid!();