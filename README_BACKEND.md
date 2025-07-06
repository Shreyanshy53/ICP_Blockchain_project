# ICP Scholar Backend Canisters

This directory contains the Rust-based backend canisters for the ICP Scholar decentralized education platform.

## Architecture

The backend consists of 5 separate canisters, each handling specific functionality:

### 1. User Management (`user_management`)
- User registration and authentication
- Role-based access control (Educator/Learner)
- User profile management
- Principal-based identity management

### 2. Course Management (`course_management`)
- Course creation and management
- Lesson structure and content
- Student enrollment tracking
- Progress monitoring
- Course completion tracking

### 3. Certificate Issuer (`certificate_issuer`)
- Automated certificate generation
- Blockchain-based verification
- Certificate metadata management
- Verification hash generation

### 4. Token Rewards (`token_rewards`)
- Token balance management
- Reward distribution system
- Transaction history
- Leaderboard functionality
- Automated rewards for achievements

### 5. Peer Learning (`peer_learning`)
- Q&A system with voting
- Study group creation and management
- Community interaction features
- Reputation system

## Prerequisites

1. **DFINITY SDK (dfx)**: Install from [https://internetcomputer.org/docs/current/developer-docs/setup/install/](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
2. **Rust**: Install from [https://rustup.rs/](https://rustup.rs/)
3. **Node.js**: For frontend build process

## Deployment Instructions

### Local Development

1. **Clone and setup:**
   ```bash
   git clone <repository>
   cd icp-scholar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local replica:**
   ```bash
   dfx start --background --clean
   ```

4. **Deploy all canisters:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Manual Deployment

If you prefer to deploy canisters individually:

```bash
# Deploy backend canisters
dfx deploy user_management
dfx deploy course_management
dfx deploy certificate_issuer
dfx deploy token_rewards
dfx deploy peer_learning

# Build and deploy frontend
npm run build
dfx deploy icp_scholar_frontend
```

### Production Deployment (IC Mainnet)

1. **Get cycles:**
   - Obtain ICP tokens
   - Convert to cycles using NNS or dfx

2. **Deploy to mainnet:**
   ```bash
   dfx deploy --network ic --with-cycles 1000000000000
   ```

## Canister Interfaces

### User Management

```bash
# Create a new user
dfx canister call user_management create_user '(record { 
  role = variant { Learner }; 
  name = "John Doe"; 
  email = "john@example.com"; 
  avatar = null 
})'

# Get current user
dfx canister call user_management get_current_user '()'

# Get all users
dfx canister call user_management get_all_users '()'
```

### Course Management

```bash
# Create a course
dfx canister call course_management create_course '(record {
  title = "Blockchain Basics";
  description = "Learn blockchain fundamentals";
  lessons = vec {
    record {
      title = "Introduction";
      content = "Welcome to blockchain";
      duration = "10 min";
      order = 1;
    }
  };
  level = variant { Beginner };
  image = "https://example.com/image.jpg";
  tags = vec { "blockchain"; "basics" };
  duration = "2 hours";
})'

# Get all courses
dfx canister call course_management get_all_courses '()'

# Enroll in a course
dfx canister call course_management enroll_in_course '(1)'
```

### Certificate Issuer

```bash
# Issue a certificate
dfx canister call certificate_issuer issue_certificate '(record {
  student = principal "rdmx6-jaaaa-aaaah-qcaiq-cai";
  course_id = 1;
  course_title = "Blockchain Basics";
  educator = principal "rrkah-fqaaa-aaaah-qcaiq-cai";
  educator_name = "Dr. Smith";
  metadata = record {
    completion_date = 1640995200000000000;
    total_lessons = 5;
    course_duration = "2 hours";
    course_level = "Beginner";
    skills_acquired = vec { "Blockchain"; "Cryptocurrency" };
  };
})'

# Verify a certificate
dfx canister call certificate_issuer verify_certificate '("0x1234567890abcdef")'
```

### Token Rewards

```bash
# Reward course completion
dfx canister call token_rewards reward_course_completion '(
  principal "rdmx6-jaaaa-aaaah-qcaiq-cai",
  1
)'

# Get user balance
dfx canister call token_rewards get_balance '(principal "rdmx6-jaaaa-aaaah-qcaiq-cai")'

# Get leaderboard
dfx canister call token_rewards get_leaderboard '(10)'
```

### Peer Learning

```bash
# Create a question
dfx canister call peer_learning create_question '(record {
  title = "How does blockchain work?";
  content = "I need help understanding blockchain technology";
  tags = vec { "blockchain"; "help" };
})'

# Create an answer
dfx canister call peer_learning create_answer '(record {
  question_id = 1;
  content = "Blockchain is a distributed ledger...";
})'

# Vote on a question
dfx canister call peer_learning vote_question '(1, true)'
```

## Data Structures

### User
```rust
pub struct User {
    pub id: u64,
    pub principal: Principal,
    pub role: UserRole, // Educator | Learner
    pub name: String,
    pub email: String,
    pub avatar: Option<String>,
    pub created_at: u64,
    pub updated_at: u64,
}
```

### Course
```rust
pub struct Course {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub educator: Principal,
    pub lessons: Vec<Lesson>,
    pub level: CourseLevel, // Beginner | Intermediate | Advanced
    pub image: String,
    pub tags: Vec<String>,
    pub duration: String,
    pub enrolled_students: u64,
    pub created_at: u64,
    pub updated_at: u64,
}
```

### Certificate
```rust
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
```

## Security Features

1. **Principal-based Authentication**: All operations require valid Internet Identity
2. **Role-based Access Control**: Different permissions for educators and learners
3. **Data Validation**: Input validation on all canister calls
4. **Stable Storage**: Persistent data storage using `ic-stable-structures`
5. **Verification Hashes**: Cryptographic verification for certificates

## Monitoring and Maintenance

### Check Canister Status
```bash
dfx canister status user_management
dfx canister status course_management
dfx canister status certificate_issuer
dfx canister status token_rewards
dfx canister status peer_learning
```

### Upgrade Canisters
```bash
dfx deploy user_management --mode upgrade
dfx deploy course_management --mode upgrade
# ... etc for other canisters
```

### Backup Data
The canisters use stable storage, so data persists across upgrades. However, for additional safety:

```bash
# Export canister state (if implemented)
dfx canister call user_management export_data '()'
```

## Troubleshooting

### Common Issues

1. **Canister out of cycles**: Top up with cycles
   ```bash
   dfx ledger top-up <canister-id> --amount 1.0
   ```

2. **Build errors**: Ensure Rust toolchain is up to date
   ```bash
   rustup update
   ```

3. **Network issues**: Check dfx network configuration
   ```bash
   dfx ping ic
   ```

### Logs and Debugging

```bash
# View canister logs
dfx canister logs user_management

# Debug mode deployment
dfx deploy --mode reinstall user_management
```

## Contributing

1. Follow Rust best practices
2. Add comprehensive tests
3. Update Candid interfaces when modifying functions
4. Document all public functions
5. Use proper error handling

## License

This project is licensed under the MIT License.