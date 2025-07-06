import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  educator: string;
  lessons: Lesson[];
  enrolledStudents: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  tags: string[];
  price?: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  completed?: boolean;
}

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  studentName: string;
  verificationHash: string;
  educatorName: string;
  completionDate: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  tags: string[];
  votes: number;
  answers: Answer[];
  timestamp: string;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  votes: number;
  timestamp: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  tags: string[];
  creator: string;
  image: string;
}

interface DataContextType {
  courses: Course[];
  enrolledCourses: Course[];
  certificates: Certificate[];
  questions: Question[];
  studyGroups: StudyGroup[];
  tokenBalance: number;
  lessonProgress: { [courseId: string]: { [lessonId: string]: boolean } };
  addCourse: (course: Omit<Course, 'id' | 'enrolledStudents'>) => void;
  enrollInCourse: (courseId: string) => void;
  completeCourse: (courseId: string) => void;
  markLessonAsRead: (courseId: string, lessonId: string) => void;
  generateCertificate: (courseId: string) => Certificate;
  addQuestion: (question: Omit<Question, 'id' | 'votes' | 'answers' | 'timestamp'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'votes' | 'timestamp'>) => void;
  voteQuestion: (questionId: string, vote: 1 | -1) => void;
  voteAnswer: (questionId: string, answerId: string, vote: 1 | -1) => void;
  joinStudyGroup: (groupId: string) => void;
  earnTokens: (amount: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to Blockchain Technology',
      description: 'Master the fundamentals of blockchain technology, including cryptographic principles, consensus mechanisms, and real-world applications. This comprehensive course covers everything from basic concepts to advanced implementations.',
      educator: 'Dr. Ananya Sharma',
      lessons: [
        { 
          id: '1', 
          title: 'What is Blockchain?', 
          content: `# Understanding Blockchain Technology

Blockchain is a revolutionary technology that serves as the foundation for cryptocurrencies and many other applications. At its core, blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.

## Key Characteristics

**Decentralization**: Unlike traditional databases that are controlled by a central authority, blockchain operates on a peer-to-peer network where multiple participants maintain copies of the ledger.

**Immutability**: Once data is recorded in a blockchain, it becomes extremely difficult to change or delete. This is achieved through cryptographic hashing and the distributed nature of the network.

**Transparency**: All transactions on a public blockchain are visible to all participants, creating a transparent and auditable system.

**Security**: Blockchain uses advanced cryptographic techniques to secure data and prevent unauthorized access or tampering.

## How It Works

1. **Transaction Initiation**: A user initiates a transaction
2. **Broadcasting**: The transaction is broadcast to the network
3. **Validation**: Network participants validate the transaction
4. **Block Creation**: Valid transactions are grouped into a block
5. **Consensus**: The network reaches consensus on the new block
6. **Addition**: The block is added to the chain and distributed

## Real-World Applications

- **Cryptocurrencies**: Digital currencies like Bitcoin and Ethereum
- **Supply Chain**: Tracking products from origin to consumer
- **Healthcare**: Secure patient record management
- **Voting**: Transparent and tamper-proof voting systems
- **Real Estate**: Property ownership and transfer records

Understanding these fundamentals is crucial for anyone looking to work with blockchain technology or cryptocurrencies.`, 
          duration: '25 min' 
        },
        { 
          id: '2', 
          title: 'Cryptographic Hashing', 
          content: `# Cryptographic Hashing in Blockchain

Cryptographic hashing is the backbone of blockchain security. A hash function takes an input of any size and produces a fixed-size string of characters, which appears random but is deterministic.

## Properties of Cryptographic Hash Functions

**Deterministic**: The same input always produces the same hash output.

**Fixed Output Size**: Regardless of input size, the output is always the same length (e.g., SHA-256 produces 256-bit hashes).

**Avalanche Effect**: A small change in input produces a dramatically different output.

**One-Way Function**: It's computationally infeasible to reverse the process and find the original input from the hash.

**Collision Resistant**: It's extremely difficult to find two different inputs that produce the same hash.

## SHA-256 Algorithm

Bitcoin and many other blockchains use SHA-256 (Secure Hash Algorithm 256-bit). Here's how it works:

1. **Preprocessing**: The input message is padded to ensure it's a multiple of 512 bits
2. **Parsing**: The padded message is divided into 512-bit blocks
3. **Hash Computation**: Each block is processed through 64 rounds of operations
4. **Output**: A 256-bit hash value is produced

## Role in Blockchain

**Block Identification**: Each block has a unique hash that serves as its identifier.

**Chain Linking**: Each block contains the hash of the previous block, creating the "chain."

**Merkle Trees**: Transaction hashes are organized in a binary tree structure for efficient verification.

**Proof of Work**: Miners compete to find a hash that meets specific criteria.

## Example

Input: "Hello, Blockchain!"
SHA-256 Hash: 7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730

Notice how changing even one character completely changes the hash:
Input: "Hello, Blockchain?"
SHA-256 Hash: 8f434346648f6b96df89dda901c5176b10359d5c5e0c9471c9d3b9e0c8e5c6d

This property ensures the integrity of blockchain data.`, 
          duration: '30 min' 
        },
        { 
          id: '3', 
          title: 'Consensus Mechanisms', 
          content: `# Consensus Mechanisms in Blockchain

Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the current state of the ledger. They solve the fundamental problem of achieving agreement in a distributed system without a central authority.

## Proof of Work (PoW)

**How it works**: Miners compete to solve computationally intensive puzzles. The first to solve it gets to add the next block and receive rewards.

**Security**: The computational cost makes it expensive to attack the network.

**Examples**: Bitcoin, Ethereum (before 2022)

**Advantages**:
- Highly secure and battle-tested
- Truly decentralized
- Resistant to various attacks

**Disadvantages**:
- High energy consumption
- Slow transaction processing
- Scalability limitations

## Proof of Stake (PoS)

**How it works**: Validators are chosen to create new blocks based on their stake (ownership) in the network. The more tokens they hold, the higher their chances of being selected.

**Security**: Validators risk losing their staked tokens if they act maliciously.

**Examples**: Ethereum 2.0, Cardano, Polkadot

**Advantages**:
- Energy efficient
- Faster transaction processing
- Lower barriers to participation

**Disadvantages**:
- Potential for centralization
- "Nothing at stake" problem
- Wealth concentration

## Delegated Proof of Stake (DPoS)

**How it works**: Token holders vote for delegates who validate transactions on their behalf.

**Examples**: EOS, Tron

**Advantages**:
- Very fast transaction processing
- Democratic governance
- Energy efficient

**Disadvantages**:
- More centralized than PoW/PoS
- Potential for vote buying
- Delegate cartel formation

## Practical Byzantine Fault Tolerance (pBFT)

**How it works**: Designed to work in environments where up to 1/3 of nodes may be malicious or fail.

**Examples**: Hyperledger Fabric

**Advantages**:
- Fast finality
- No energy waste
- Suitable for permissioned networks

**Disadvantages**:
- Limited scalability
- Requires known participants
- Complex implementation

## Choosing the Right Consensus

The choice of consensus mechanism depends on:
- **Security requirements**
- **Scalability needs**
- **Energy considerations**
- **Decentralization goals**
- **Network type** (public vs. private)

Understanding these trade-offs is crucial for blockchain developers and users.`, 
          duration: '35 min' 
        },
        { 
          id: '4', 
          title: 'Blockchain Networks and Types', 
          content: `# Types of Blockchain Networks

Blockchain networks can be categorized based on their accessibility and governance models. Understanding these types is essential for choosing the right blockchain for specific use cases.

## Public Blockchains

**Characteristics**:
- Open to everyone
- Fully decentralized
- Transparent and immutable
- Permissionless participation

**Examples**: Bitcoin, Ethereum, Litecoin

**Use Cases**:
- Cryptocurrencies
- DeFi applications
- Public record keeping
- Global payment systems

**Advantages**:
- Maximum decentralization
- High security through network effects
- Censorship resistant
- Global accessibility

**Disadvantages**:
- Scalability limitations
- High energy consumption
- Slower transaction speeds
- Governance challenges

## Private Blockchains

**Characteristics**:
- Restricted access
- Controlled by single organization
- Faster transactions
- Permissioned participation

**Examples**: JPMorgan's JPM Coin, Walmart's food traceability system

**Use Cases**:
- Enterprise applications
- Internal record keeping
- Supply chain management
- Healthcare records

**Advantages**:
- High performance
- Privacy and control
- Regulatory compliance
- Customizable features

**Disadvantages**:
- Centralization risks
- Limited transparency
- Trust requirements
- Single point of failure

## Consortium Blockchains

**Characteristics**:
- Semi-decentralized
- Controlled by group of organizations
- Faster than public blockchains
- More decentralized than private

**Examples**: R3 Corda, Energy Web Chain

**Use Cases**:
- Industry collaborations
- Banking consortiums
- Government applications
- Cross-organizational workflows

**Advantages**:
- Balanced control
- Faster consensus
- Reduced costs
- Industry-specific features

**Disadvantages**:
- Limited decentralization
- Coordination challenges
- Potential for collusion
- Governance complexity

## Hybrid Blockchains

**Characteristics**:
- Combination of public and private elements
- Selective transparency
- Controlled access with public verification
- Flexible architecture

**Examples**: IBM Food Trust, Microsoft Azure Blockchain

**Use Cases**:
- Supply chain with public verification
- Healthcare with privacy requirements
- Government services
- Financial services

**Advantages**:
- Flexibility in design
- Privacy with transparency
- Scalable solutions
- Regulatory compliance

**Disadvantages**:
- Complex architecture
- Implementation challenges
- Potential security gaps
- Governance complexity

## Choosing the Right Type

Consider these factors:
- **Privacy requirements**
- **Scalability needs**
- **Regulatory compliance**
- **Trust model**
- **Performance requirements**
- **Cost considerations**

Each type serves different purposes and understanding their trade-offs helps in making informed decisions.`, 
          duration: '28 min' 
        }
      ],
      enrolledStudents: 1247,
      duration: '2 hours',
      level: 'Beginner',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Blockchain', 'Cryptocurrency', 'Technology']
    },
    {
      id: '2',
      title: 'Smart Contracts Development with Solidity',
      description: 'Learn to build, deploy, and test smart contracts using Solidity. This hands-on course covers contract architecture, security best practices, and real-world implementation patterns.',
      educator: 'Prof. Rajiv Mehta',
      lessons: [
        { 
          id: '1', 
          title: 'Solidity Fundamentals', 
          content: `# Solidity Programming Language

Solidity is a high-level programming language designed for implementing smart contracts on Ethereum and other blockchain platforms. It's statically typed, supports inheritance, libraries, and complex user-defined types.

## Language Basics

**Data Types**:
- **Boolean**: \`bool\` - true or false
- **Integers**: \`uint256\`, \`int256\` - unsigned and signed integers
- **Address**: \`address\` - Ethereum addresses
- **Bytes**: \`bytes32\`, \`bytes\` - fixed and dynamic byte arrays
- **String**: \`string\` - UTF-8 encoded strings
- **Arrays**: \`uint[]\`, \`uint[5]\` - dynamic and fixed arrays
- **Mappings**: \`mapping(address => uint)\` - key-value pairs

**Variables**:
\`\`\`solidity
contract Example {
    uint256 public totalSupply;        // State variable
    address private owner;             // Private state variable
    
    function example() public {
        uint256 localVar = 100;        // Local variable
        totalSupply = localVar;
    }
}
\`\`\`

## Functions and Modifiers

**Function Visibility**:
- **public**: Accessible from anywhere
- **private**: Only within the same contract
- **internal**: Within contract and derived contracts
- **external**: Only from outside the contract

**Function Modifiers**:
- **view**: Doesn't modify state
- **pure**: Doesn't read or modify state
- **payable**: Can receive Ether

\`\`\`solidity
contract AccessControl {
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function restrictedFunction() public onlyOwner {
        // Only owner can call this
    }
}
\`\`\`

## Events and Logging

Events provide a way to log information on the blockchain:

\`\`\`solidity
contract EventExample {
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function transfer(address to, uint256 amount) public {
        // Transfer logic here
        emit Transfer(msg.sender, to, amount);
    }
}
\`\`\`

## Error Handling

Solidity provides several ways to handle errors:

\`\`\`solidity
contract ErrorHandling {
    function example(uint256 value) public pure {
        require(value > 0, "Value must be positive");
        assert(value != 0);  // Should never fail if require passes
        
        if (value > 100) {
            revert("Value too large");
        }
    }
}
\`\`\`

Understanding these fundamentals is essential before building complex smart contracts.`, 
          duration: '40 min' 
        },
        { 
          id: '2', 
          title: 'Contract Structure and Architecture', 
          content: `# Smart Contract Architecture

Well-structured smart contracts are crucial for maintainability, security, and gas efficiency. This lesson covers best practices for organizing your Solidity code.

## Contract Structure

A typical Solidity contract follows this structure:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is IERC20, ReentrancyGuard {
    // State variables
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) private balances;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // Modifiers
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    // Constructor
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
    
    // External functions
    function transfer(address to, uint256 amount) 
        external 
        validAddress(to) 
        returns (bool) 
    {
        // Implementation
    }
    
    // Public functions
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    // Internal functions
    function _mint(address to, uint256 amount) internal {
        // Implementation
    }
    
    // Private functions
    function _calculateFee(uint256 amount) private pure returns (uint256) {
        // Implementation
    }
}
\`\`\`

## Design Patterns

**Factory Pattern**:
\`\`\`solidity
contract TokenFactory {
    address[] public deployedTokens;
    
    function createToken(string memory name, string memory symbol) 
        public 
        returns (address) 
    {
        MyToken newToken = new MyToken(name, symbol);
        deployedTokens.push(address(newToken));
        return address(newToken);
    }
}
\`\`\`

**Proxy Pattern**:
Used for upgradeable contracts:
\`\`\`solidity
contract Proxy {
    address public implementation;
    
    function upgrade(address newImplementation) external {
        implementation = newImplementation;
    }
    
    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
\`\`\`

## Gas Optimization

**Storage vs Memory**:
- Use \`memory\` for temporary data
- Use \`storage\` for persistent data
- Pack struct variables efficiently

\`\`\`solidity
struct User {
    uint128 balance;    // 16 bytes
    uint128 timestamp;  // 16 bytes - packed in same slot
    bool active;        // 1 byte - new slot
}
\`\`\`

**Loop Optimization**:
\`\`\`solidity
// Avoid unbounded loops
function processUsers(address[] calldata users) external {
    require(users.length <= 100, "Too many users");
    
    for (uint256 i = 0; i < users.length; i++) {
        // Process user
    }
}
\`\`\`

## Security Considerations

**Reentrancy Protection**:
\`\`\`solidity
contract Secure {
    mapping(address => uint256) public balances;
    bool private locked;
    
    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    function withdraw() external noReentrant {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
\`\`\`

Following these architectural principles ensures your contracts are secure, efficient, and maintainable.`, 
          duration: '45 min' 
        },
        { 
          id: '3', 
          title: 'Testing and Deployment', 
          content: `# Smart Contract Testing and Deployment

Thorough testing and proper deployment are critical for smart contract success. This lesson covers testing frameworks, deployment strategies, and best practices.

## Testing Frameworks

**Hardhat Testing**:
Hardhat is a popular development environment for Ethereum:

\`\`\`javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
    let token;
    let owner;
    let addr1;
    let addr2;
    
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("MyToken");
        token = await Token.deploy("Test Token", "TEST");
        await token.deployed();
    });
    
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });
        
        it("Should assign total supply to owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });
    
    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await token.transfer(addr1.address, 50);
            expect(await token.balanceOf(addr1.address)).to.equal(50);
            
            await token.connect(addr1).transfer(addr2.address, 50);
            expect(await token.balanceOf(addr2.address)).to.equal(50);
        });
        
        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);
            
            await expect(
                token.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            
            expect(await token.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });
    });
});
\`\`\`

## Test Coverage

**Unit Tests**: Test individual functions
**Integration Tests**: Test contract interactions
**End-to-End Tests**: Test complete user workflows

\`\`\`javascript
describe("Integration Tests", function () {
    it("Should handle complex workflow", async function () {
        // Deploy multiple contracts
        const factory = await TokenFactory.deploy();
        
        // Create token through factory
        await factory.createToken("New Token", "NEW");
        const tokenAddress = await factory.deployedTokens(0);
        
        // Interact with created token
        const token = await ethers.getContractAt("MyToken", tokenAddress);
        await token.transfer(addr1.address, 100);
        
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });
});
\`\`\`

## Deployment Strategies

**Local Development**:
\`\`\`javascript
// hardhat.config.js
module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {
            chainId: 1337
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
\`\`\`

**Testnet Deployment**:
\`\`\`javascript
// Deploy script
async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy("My Token", "MTK");
    
    await token.deployed();
    
    console.log("Token deployed to:", token.address);
    
    // Verify on Etherscan
    if (network.name !== "hardhat") {
        await hre.run("verify:verify", {
            address: token.address,
            constructorArguments: ["My Token", "MTK"],
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
\`\`\`

## Security Auditing

**Automated Tools**:
- **Slither**: Static analysis tool
- **MythX**: Security analysis platform
- **Echidna**: Fuzzing tool

**Manual Review Checklist**:
- Reentrancy vulnerabilities
- Integer overflow/underflow
- Access control issues
- Gas limit problems
- Front-running attacks

## Mainnet Deployment

**Pre-deployment Checklist**:
1. Comprehensive testing on testnets
2. Security audit completion
3. Gas optimization review
4. Documentation completion
5. Emergency procedures defined

**Deployment Process**:
1. Final code review
2. Deploy to mainnet
3. Verify contract source code
4. Initialize contract state
5. Transfer ownership if needed
6. Monitor initial transactions

**Post-deployment**:
- Monitor contract behavior
- Set up alerting systems
- Prepare upgrade procedures
- Document operational procedures

Proper testing and deployment practices are essential for successful smart contract projects.`, 
          duration: '50 min' 
        }
      ],
      enrolledStudents: 892,
      duration: '3 hours',
      level: 'Intermediate',
      image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Smart Contracts', 'Solidity', 'Ethereum']
    },
    {
      id: '3',
      title: 'DeFi Protocol Architecture and Development',
      description: 'Deep dive into decentralized finance protocols. Learn to build lending platforms, automated market makers, and yield farming strategies with hands-on implementation.',
      educator: 'Dr. Priya Patel',
      lessons: [
        { 
          id: '1', 
          title: 'DeFi Fundamentals and Ecosystem', 
          content: `# Decentralized Finance (DeFi) Fundamentals

DeFi represents a paradigm shift from traditional centralized financial systems to open, permissionless, and programmable financial services built on blockchain technology.

## Core Principles of DeFi

**Permissionless Access**: Anyone with an internet connection can access DeFi services without requiring approval from intermediaries.

**Transparency**: All transactions and smart contract code are publicly verifiable on the blockchain.

**Composability**: DeFi protocols can be combined like "money legos" to create new financial products.

**Non-custodial**: Users maintain control of their assets at all times.

**Global Accessibility**: Available 24/7 worldwide without geographical restrictions.

## DeFi Ecosystem Components

**Decentralized Exchanges (DEXs)**:
- **Automated Market Makers (AMMs)**: Uniswap, SushiSwap, PancakeSwap
- **Order Book DEXs**: dYdX, Serum
- **Aggregators**: 1inch, Paraswap

**Lending and Borrowing**:
- **Lending Protocols**: Aave, Compound, MakerDAO
- **Flash Loans**: Uncollateralized loans that must be repaid in the same transaction
- **Synthetic Assets**: Synthetix, Mirror Protocol

**Derivatives and Insurance**:
- **Options**: Opyn, Hegic
- **Futures**: Perpetual Protocol, dYdX
- **Insurance**: Nexus Mutual, Cover Protocol

**Asset Management**:
- **Yield Farming**: Yearn Finance, Harvest Finance
- **Index Funds**: Set Protocol, Index Coop
- **Portfolio Management**: Enzyme, Balancer

## Key DeFi Concepts

**Total Value Locked (TVL)**: The total amount of assets deposited in DeFi protocols, indicating the ecosystem's size and growth.

**Yield Farming**: The practice of providing liquidity to DeFi protocols in exchange for rewards, often in the form of governance tokens.

**Liquidity Mining**: Distributing governance tokens to users who provide liquidity to a protocol.

**Governance Tokens**: Tokens that give holders voting rights on protocol decisions and upgrades.

**Impermanent Loss**: The temporary loss of funds experienced by liquidity providers due to volatility in trading pairs.

## DeFi vs Traditional Finance

| Aspect | Traditional Finance | DeFi |
|--------|-------------------|------|
| Access | Permissioned | Permissionless |
| Custody | Custodial | Non-custodial |
| Transparency | Limited | Full transparency |
| Operating Hours | Business hours | 24/7 |
| Geographic Reach | Limited | Global |
| Intermediaries | Required | Optional |
| Settlement | Days | Minutes |

## Risks in DeFi

**Smart Contract Risk**: Bugs or vulnerabilities in smart contract code can lead to loss of funds.

**Liquidation Risk**: Borrowers may face liquidation if collateral value drops below required thresholds.

**Impermanent Loss**: Liquidity providers may experience losses due to price volatility.

**Regulatory Risk**: Changing regulations may impact DeFi protocols and users.

**Oracle Risk**: Dependence on external price feeds that may be manipulated or fail.

## DeFi Innovation Areas

**Cross-Chain Protocols**: Enabling interoperability between different blockchains.

**Layer 2 Solutions**: Scaling solutions like Polygon, Arbitrum, and Optimism.

**Real-World Assets (RWA)**: Tokenizing traditional assets like real estate and commodities.

**Decentralized Identity**: Self-sovereign identity solutions for DeFi.

**Institutional DeFi**: Products designed for institutional investors and compliance.

Understanding these fundamentals is crucial for anyone looking to participate in or build DeFi protocols.`, 
          duration: '35 min' 
        },
        { 
          id: '2', 
          title: 'Automated Market Makers (AMMs)', 
          content: `# Automated Market Makers (AMMs)

AMMs are a fundamental innovation in DeFi that enable decentralized trading without traditional order books. They use mathematical formulas to price assets and provide liquidity.

## How AMMs Work

**Liquidity Pools**: AMMs use liquidity pools containing pairs of tokens. Users (liquidity providers) deposit equal values of both tokens to earn fees.

**Constant Product Formula**: The most common AMM model uses the formula x * y = k, where x and y are token quantities and k is constant.

**Price Discovery**: Token prices are determined by the ratio of tokens in the pool. As trades occur, the ratio changes, affecting prices.

## Constant Product AMM (Uniswap Model)

\`\`\`solidity
contract SimpleAMM {
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    function addLiquidity(uint256 amountA, uint256 amountB) 
        external 
        returns (uint256 liquidity) 
    {
        if (totalSupply == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = min(
                (amountA * totalSupply) / reserveA,
                (amountB * totalSupply) / reserveB
            );
        }
        
        balanceOf[msg.sender] += liquidity;
        totalSupply += liquidity;
        reserveA += amountA;
        reserveB += amountB;
    }
    
    function swap(uint256 amountIn, bool aToB) 
        external 
        returns (uint256 amountOut) 
    {
        uint256 amountInWithFee = amountIn * 997; // 0.3% fee
        
        if (aToB) {
            amountOut = (amountInWithFee * reserveB) / 
                       (reserveA * 1000 + amountInWithFee);
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            amountOut = (amountInWithFee * reserveA) / 
                       (reserveB * 1000 + amountInWithFee);
            reserveB += amountIn;
            reserveA -= amountOut;
        }
    }
}
\`\`\`

## Different AMM Models

**Constant Product (x * y = k)**:
- Used by Uniswap, SushiSwap
- Simple and robust
- Higher slippage for large trades

**Constant Sum (x + y = k)**:
- No slippage but vulnerable to arbitrage
- Rarely used in practice

**Constant Mean (Balancer)**:
- Supports multiple tokens with different weights
- Formula: (x₁^w₁ * x₂^w₂ * ... * xₙ^wₙ) = k

**Curve (StableSwap)**:
- Optimized for stablecoins and similar assets
- Lower slippage for stable pairs
- Hybrid of constant product and constant sum

**Concentrated Liquidity (Uniswap V3)**:
- Liquidity providers can specify price ranges
- Capital efficiency improvements
- More complex but higher returns

## Impermanent Loss

Impermanent loss occurs when the price ratio of tokens in a pool changes compared to when they were deposited.

**Example**:
- Initial: 1 ETH = 2000 USDC (deposit 1 ETH + 2000 USDC)
- Later: 1 ETH = 4000 USDC
- Pool rebalances to maintain constant product
- Result: ~0.707 ETH + 2828 USDC
- Value: 2828 + (0.707 * 4000) = 5656 USDC
- Holding would give: 4000 + 2000 = 6000 USDC
- Impermanent loss: ~5.7%

## Fee Mechanisms

**Trading Fees**: Typically 0.3% of trade volume, distributed to liquidity providers.

**Protocol Fees**: Some AMMs take a portion of trading fees for development and governance.

**Dynamic Fees**: Fees that adjust based on volatility or other factors.

## Advanced AMM Features

**Flash Swaps**: Borrow tokens from the pool and repay in the same transaction.

**Time-Weighted Average Price (TWAP)**: Price oracles based on historical AMM prices.

**Just-in-Time (JIT) Liquidity**: Providing liquidity just before large trades to capture fees.

**MEV Protection**: Mechanisms to protect users from Maximum Extractable Value attacks.

## Building an AMM

Key considerations when building an AMM:

1. **Mathematical Model**: Choose appropriate pricing formula
2. **Fee Structure**: Balance user costs with LP incentives
3. **Oracle Integration**: Provide reliable price feeds
4. **Security**: Audit smart contracts thoroughly
5. **Gas Optimization**: Minimize transaction costs
6. **User Experience**: Simple and intuitive interface

AMMs have revolutionized decentralized trading and continue to evolve with new innovations and optimizations.`, 
          duration: '40 min' 
        },
        { 
          id: '3', 
          title: 'Lending and Borrowing Protocols', 
          content: `# DeFi Lending and Borrowing Protocols

Lending protocols are among the most important DeFi primitives, enabling users to earn yield on their assets and access liquidity without selling their holdings.

## Core Concepts

**Overcollateralization**: Borrowers must provide collateral worth more than the loan amount to account for price volatility.

**Liquidation**: When collateral value falls below a threshold, it can be sold to repay the loan.

**Interest Rates**: Determined algorithmically based on supply and demand.

**Health Factor**: A metric indicating how close a position is to liquidation.

## Compound Protocol Model

Compound pioneered the pool-based lending model:

\`\`\`solidity
contract LendingPool {
    struct Market {
        uint256 totalSupply;
        uint256 totalBorrows;
        uint256 reserveFactor;
        uint256 collateralFactor;
        InterestRateModel interestRateModel;
    }
    
    mapping(address => Market) public markets;
    mapping(address => mapping(address => uint256)) public accountTokens;
    mapping(address => mapping(address => uint256)) public accountBorrows;
    
    function supply(address token, uint256 amount) external {
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Calculate cTokens to mint
        uint256 exchangeRate = getExchangeRate(token);
        uint256 cTokens = amount * 1e18 / exchangeRate;
        
        // Update user balance
        accountTokens[msg.sender][token] += cTokens;
        markets[token].totalSupply += amount;
        
        emit Supply(msg.sender, token, amount, cTokens);
    }
    
    function borrow(address token, uint256 amount) external {
        // Check collateral requirements
        require(getAccountLiquidity(msg.sender) >= amount, "Insufficient collateral");
        
        // Update borrow balance with accrued interest
        uint256 borrowIndex = getBorrowIndex(token);
        accountBorrows[msg.sender][token] = 
            accountBorrows[msg.sender][token] * borrowIndex / 1e18;
        
        // Add new borrow
        accountBorrows[msg.sender][token] += amount;
        markets[token].totalBorrows += amount;
        
        // Transfer tokens to user
        IERC20(token).transfer(msg.sender, amount);
        
        emit Borrow(msg.sender, token, amount);
    }
    
    function liquidate(
        address borrower,
        address repayToken,
        uint256 repayAmount,
        address collateralToken
    ) external {
        // Check if account is underwater
        require(getAccountLiquidity(borrower) < 0, "Account not liquidatable");
        
        // Calculate collateral to seize
        uint256 collateralAmount = calculateCollateralAmount(
            repayToken,
            repayAmount,
            collateralToken
        );
        
        // Repay borrow
        IERC20(repayToken).transferFrom(msg.sender, address(this), repayAmount);
        accountBorrows[borrower][repayToken] -= repayAmount;
        
        // Transfer collateral to liquidator
        accountTokens[borrower][collateralToken] -= collateralAmount;
        accountTokens[msg.sender][collateralToken] += collateralAmount;
        
        emit Liquidation(borrower, repayToken, repayAmount, collateralToken, collateralAmount);
    }
}
\`\`\`

## Interest Rate Models

**Utilization-Based Model**:
Interest rates increase as utilization (borrows/supply) increases.

\`\`\`solidity
contract InterestRateModel {
    uint256 public baseRate = 2e16; // 2% base rate
    uint256 public multiplier = 2e17; // 20% multiplier
    uint256 public jumpMultiplier = 1e18; // 100% jump multiplier
    uint256 public kink = 8e17; // 80% utilization kink
    
    function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves) 
        external 
        view 
        returns (uint256) 
    {
        uint256 utilization = getUtilizationRate(cash, borrows, reserves);
        
        if (utilization <= kink) {
            return baseRate + (utilization * multiplier) / 1e18;
        } else {
            uint256 normalRate = baseRate + (kink * multiplier) / 1e18;
            uint256 excessUtil = utilization - kink;
            return normalRate + (excessUtil * jumpMultiplier) / 1e18;
        }
    }
    
    function getSupplyRate(
        uint256 cash,
        uint256 borrows,
        uint256 reserves,
        uint256 reserveFactor
    ) external view returns (uint256) {
        uint256 oneMinusReserveFactor = 1e18 - reserveFactor;
        uint256 borrowRate = getBorrowRate(cash, borrows, reserves);
        uint256 rateToPool = (borrowRate * oneMinusReserveFactor) / 1e18;
        return (getUtilizationRate(cash, borrows, reserves) * rateToPool) / 1e18;
    }
}
\`\`\`

## Risk Management

**Loan-to-Value (LTV) Ratios**:
- Conservative: 50-70% for volatile assets
- Aggressive: 80-90% for stable assets

**Liquidation Thresholds**:
- Typically 5-15% above LTV ratio
- Provides buffer for price volatility

**Liquidation Incentives**:
- Liquidators receive 5-15% bonus
- Encourages quick liquidation to protect protocol

## Flash Loans

Uncollateralized loans that must be repaid in the same transaction:

\`\`\`solidity
contract FlashLoan {
    function flashLoan(
        address token,
        uint256 amount,
        bytes calldata data
    ) external {
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        
        // Transfer tokens to borrower
        IERC20(token).transfer(msg.sender, amount);
        
        // Call borrower's callback function
        IFlashLoanReceiver(msg.sender).executeOperation(token, amount, data);
        
        // Check repayment
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "Flash loan not repaid");
    }
}
\`\`\`

## Advanced Features

**Credit Delegation**: Allow others to borrow against your collateral.

**Rate Switching**: Switch between stable and variable interest rates.

**Isolation Mode**: Limit exposure to risky assets.

**E-Mode**: Higher LTV for correlated assets (e.g., stablecoins).

## Protocol Comparison

| Protocol | Model | Key Features |
|----------|-------|--------------|
| Compound | Pool-based | cTokens, governance |
| Aave | Pool-based | Flash loans, rate switching |
| MakerDAO | CDP-based | DAI stablecoin, governance |
| Euler | Pool-based | Permissionless listing, sub-accounts |

## Building Considerations

1. **Oracle Security**: Reliable price feeds are critical
2. **Interest Rate Models**: Balance user incentives
3. **Liquidation Mechanisms**: Ensure protocol solvency
4. **Gas Optimization**: Minimize transaction costs
5. **Governance**: Decentralized parameter management

Lending protocols form the backbone of DeFi, enabling capital efficiency and financial innovation.`, 
          duration: '45 min' 
        },
        { 
          id: '4', 
          title: 'Yield Farming and Liquidity Mining', 
          content: `# Yield Farming and Liquidity Mining

Yield farming and liquidity mining are mechanisms that incentivize users to provide liquidity to DeFi protocols in exchange for rewards, typically in the form of governance tokens.

## Core Concepts

**Yield Farming**: The practice of moving crypto assets between different DeFi protocols to maximize returns.

**Liquidity Mining**: Distributing governance tokens to users who provide liquidity to a protocol.

**Annual Percentage Yield (APY)**: The annualized return including compound interest.

**Total Value Locked (TVL)**: The total amount of assets deposited in a protocol.

**Governance Tokens**: Tokens that provide voting rights and often represent a share of protocol revenue.

## Yield Farming Strategies

**Single Asset Staking**:
- Stake tokens in a protocol
- Earn rewards in the same or different tokens
- Lower risk but typically lower returns

**Liquidity Provision**:
- Provide liquidity to AMM pools
- Earn trading fees + liquidity mining rewards
- Subject to impermanent loss

**Leveraged Yield Farming**:
- Borrow assets to increase farming position
- Higher returns but increased risk
- Requires careful risk management

**Yield Aggregation**:
- Protocols that automatically optimize yield farming
- Examples: Yearn Finance, Harvest Finance
- Compound rewards and gas optimization

## Liquidity Mining Implementation

\`\`\`solidity
contract LiquidityMining {
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pendingRewards;
    }
    
    struct PoolInfo {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accRewardPerShare;
        uint256 totalStaked;
    }
    
    IERC20 public rewardToken;
    uint256 public rewardPerBlock;
    uint256 public totalAllocPoint;
    
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    
    function deposit(uint256 pid, uint256 amount) external {
        PoolInfo storage pool = poolInfo[pid];
        UserInfo storage user = userInfo[pid][msg.sender];
        
        updatePool(pid);
        
        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accRewardPerShare) / 1e12 - user.rewardDebt;
            if (pending > 0) {
                rewardToken.transfer(msg.sender, pending);
            }
        }
        
        if (amount > 0) {
            pool.lpToken.transferFrom(msg.sender, address(this), amount);
            user.amount += amount;
            pool.totalStaked += amount;
        }
        
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / 1e12;
        emit Deposit(msg.sender, pid, amount);
    }
    
    function updatePool(uint256 pid) public {
        PoolInfo storage pool = poolInfo[pid];
        
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        
        if (pool.totalStaked == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        
        uint256 multiplier = block.number - pool.lastRewardBlock;
        uint256 reward = (multiplier * rewardPerBlock * pool.allocPoint) / totalAllocPoint;
        
        pool.accRewardPerShare += (reward * 1e12) / pool.totalStaked;
        pool.lastRewardBlock = block.number;
    }
    
    function harvest(uint256 pid) external {
        PoolInfo storage pool = poolInfo[pid];
        UserInfo storage user = userInfo[pid][msg.sender];
        
        updatePool(pid);
        
        uint256 pending = (user.amount * pool.accRewardPerShare) / 1e12 - user.rewardDebt;
        if (pending > 0) {
            rewardToken.transfer(msg.sender, pending);
        }
        
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / 1e12;
        emit Harvest(msg.sender, pid, pending);
    }
}
\`\`\`

## Yield Optimization Strategies

**Auto-Compounding**:
\`\`\`solidity
contract YieldOptimizer {
    function compound() external {
        // Harvest rewards
        uint256 rewards = stakingContract.harvest();
        
        // Swap half for paired token if needed
        if (isPairToken) {
            uint256 half = rewards / 2;
            address pairedToken = getPairedToken();
            uint256 pairedAmount = swap(rewardToken, pairedToken, half);
            
            // Add liquidity
            addLiquidity(rewardToken, pairedToken, rewards - half, pairedAmount);
        }
        
        // Restake LP tokens
        uint256 lpTokens = getLPBalance();
        stakingContract.stake(lpTokens);
    }
    
    function calculateOptimalCompoundFrequency() external view returns (uint256) {
        uint256 gasCost = getGasCost();
        uint256 pendingRewards = getPendingRewards();
        uint256 apy = getCurrentAPY();
        
        // Calculate when compound rewards exceed gas costs
        return (gasCost * 365 days) / (pendingRewards * apy / 100);
    }
}
\`\`\`

## Risk Management

**Impermanent Loss Protection**:
Some protocols offer protection against impermanent loss:

\`\`\`solidity
contract ImpermanentLossProtection {
    struct Position {
        uint256 initialValue;
        uint256 timestamp;
        uint256 protectionLevel; // 0-100%
    }
    
    mapping(address => Position) public positions;
    
    function calculateImpermanentLoss(address user) external view returns (uint256) {
        Position memory pos = positions[user];
        uint256 currentValue = getCurrentPositionValue(user);
        uint256 hodlValue = getHodlValue(user);
        
        if (currentValue < hodlValue) {
            uint256 loss = hodlValue - currentValue;
            return (loss * pos.protectionLevel) / 100;
        }
        
        return 0;
    }
}
\`\`\`

## Advanced Yield Farming

**Cross-Chain Yield Farming**:
- Farm on multiple blockchains
- Bridge assets between chains
- Optimize for highest yields

**Leveraged Yield Farming**:
\`\`\`solidity
contract LeveragedYieldFarm {
    function openLeveragedPosition(
        address asset,
        uint256 amount,
        uint256 leverage
    ) external {
        // Deposit initial collateral
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Borrow additional assets
        uint256 borrowAmount = amount * (leverage - 1);
        lendingProtocol.borrow(asset, borrowAmount);
        
        // Provide liquidity with total amount
        uint256 totalAmount = amount + borrowAmount;
        provideLiquidity(asset, totalAmount);
        
        // Stake LP tokens
        stakeLPTokens();
    }
    
    function calculateLiquidationPrice(address user) external view returns (uint256) {
        // Calculate price at which position becomes underwater
        UserPosition memory pos = positions[user];
        uint256 debtValue = getDebtValue(user);
        uint256 collateralRatio = lendingProtocol.getCollateralRatio(pos.asset);
        
        return (debtValue * 1e18) / (pos.collateralAmount * collateralRatio);
    }
}
\`\`\`

## Yield Farming Metrics

**Risk-Adjusted Returns**:
- Sharpe Ratio: (Return - Risk-free rate) / Volatility
- Maximum Drawdown: Largest peak-to-trough decline
- Value at Risk (VaR): Potential loss over time period

**Protocol Health Metrics**:
- TVL growth and stability
- Token distribution schedule
- Revenue sustainability
- Governance participation

## Building Yield Farming Protocols

**Key Considerations**:
1. **Token Economics**: Sustainable reward distribution
2. **Security**: Smart contract audits and insurance
3. **User Experience**: Simple interfaces and automation
4. **Composability**: Integration with other protocols
5. **Governance**: Community-driven parameter management

**Common Pitfalls**:
- Unsustainable reward rates
- Poor tokenomics leading to sell pressure
- Smart contract vulnerabilities
- Inadequate risk management
- Lack of long-term value proposition

Yield farming has become a cornerstone of DeFi, driving innovation in incentive mechanisms and capital efficiency.`, 
          duration: '50 min' 
        }
      ],
      enrolledStudents: 654,
      duration: '4 hours',
      level: 'Advanced',
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['DeFi', 'Protocols', 'Finance']
    },
    {
      id: '4',
      title: 'Web3 Development with React and ethers.js',
      description: 'Build modern decentralized applications using React, ethers.js, and Web3 technologies. Learn to create user-friendly interfaces for blockchain interactions.',
      educator: 'Arjun Kumar',
      lessons: [
        { 
          id: '1', 
          title: 'Web3 Frontend Fundamentals', 
          content: `# Web3 Frontend Development

Web3 frontend development involves creating user interfaces that interact with blockchain networks and smart contracts. This requires understanding both traditional web development and blockchain-specific concepts.

## Web3 vs Web2 Development

**Key Differences**:
- **State Management**: Blockchain state vs traditional databases
- **User Authentication**: Wallet-based vs username/password
- **Transaction Handling**: Asynchronous blockchain transactions
- **Error Handling**: Gas fees, network congestion, failed transactions
- **User Experience**: Wallet connections, transaction confirmations

## Essential Web3 Libraries

**ethers.js**: Modern Ethereum library for JavaScript
\`\`\`javascript
import { ethers } from 'ethers';

// Connect to Ethereum network
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Contract interaction
const contract = new ethers.Contract(contractAddress, abi, signer);
\`\`\`

**web3.js**: Original Ethereum JavaScript library
\`\`\`javascript
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);
\`\`\`

**wagmi**: React hooks for Ethereum
\`\`\`javascript
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function Profile() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  if (isConnected) {
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }
  
  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
\`\`\`

## Wallet Integration

**MetaMask Connection**:
\`\`\`javascript
class WalletService {
  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        return { provider, signer, address };
      } catch (error) {
        console.error('User rejected connection:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask not installed');
    }
  }
  
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: \`0x\${chainId.toString(16)}\` }],
      });
    } catch (switchError) {
      // Network not added to MetaMask
      if (switchError.code === 4902) {
        await this.addNetwork(chainId);
      }
      throw switchError;
    }
  }
}
\`\`\`

## React Hooks for Web3

**Custom useWallet Hook**:
\`\`\`javascript
import { useState, useEffect, createContext, useContext } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState({
    address: null,
    provider: null,
    signer: null,
    isConnected: false,
    chainId: null
  });
  
  const connectWallet = async () => {
    try {
      const walletService = new WalletService();
      const { provider, signer, address } = await walletService.connectWallet();
      
      const network = await provider.getNetwork();
      
      setWallet({
        address,
        provider,
        signer,
        isConnected: true,
        chainId: network.chainId
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  const disconnectWallet = () => {
    setWallet({
      address: null,
      provider: null,
      signer: null,
      isConnected: false,
      chainId: null
    });
  };
  
  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);
  
  return (
    <WalletContext.Provider value={{
      ...wallet,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
\`\`\`

## Contract Interaction Patterns

**Reading Contract Data**:
\`\`\`javascript
function useContractRead(contractAddress, abi, functionName, args = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { provider } = useWallet();
  
  useEffect(() => {
    async function fetchData() {
      if (!provider) return;
      
      try {
        setLoading(true);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const result = await contract[functionName](...args);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [contractAddress, functionName, JSON.stringify(args), provider]);
  
  return { data, loading, error };
}
\`\`\`

**Writing to Contracts**:
\`\`\`javascript
function useContractWrite(contractAddress, abi) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signer } = useWallet();
  
  const writeContract = async (functionName, args = [], options = {}) => {
    if (!signer) throw new Error('Wallet not connected');
    
    try {
      setLoading(true);
      setError(null);
      
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract[functionName](...args, options);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      return { transaction: tx, receipt };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { writeContract, loading, error };
}
\`\`\`

## Error Handling and User Feedback

**Transaction States**:
\`\`\`javascript
function TransactionButton({ onTransaction, children }) {
  const [txState, setTxState] = useState('idle'); // idle, pending, success, error
  const [txHash, setTxHash] = useState(null);
  
  const handleTransaction = async () => {
    try {
      setTxState('pending');
      const { transaction } = await onTransaction();
      setTxHash(transaction.hash);
      
      await transaction.wait();
      setTxState('success');
    } catch (error) {
      setTxState('error');
      console.error('Transaction failed:', error);
    }
  };
  
  return (
    <div>
      <button 
        onClick={handleTransaction}
        disabled={txState === 'pending'}
      >
        {txState === 'pending' ? 'Processing...' : children}
      </button>
      
      {txState === 'pending' && txHash && (
        <p>Transaction submitted: {txHash}</p>
      )}
      
      {txState === 'success' && (
        <p>Transaction successful!</p>
      )}
      
      {txState === 'error' && (
        <p>Transaction failed. Please try again.</p>
      )}
    </div>
  );
}
\`\`\`

## Best Practices

**Performance Optimization**:
- Cache contract instances
- Batch multiple reads
- Use React.memo for expensive components
- Implement proper loading states

**Security Considerations**:
- Validate all user inputs
- Handle network switching gracefully
- Implement proper error boundaries
- Never store private keys in frontend

**User Experience**:
- Clear transaction feedback
- Estimated gas costs
- Network status indicators
- Graceful error handling

Understanding these fundamentals is essential for building professional Web3 applications.`, 
          duration: '45 min' 
        },
        { 
          id: '2', 
          title: 'Building DApp Components', 
          content: `# Building Reusable DApp Components

Creating modular, reusable components is crucial for maintainable Web3 applications. This lesson covers common DApp UI patterns and component architectures.

## Wallet Connection Component

\`\`\`javascript
import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

function WalletConnector() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const formatAddress = (addr) => {
    return \`\${addr.slice(0, 6)}...\${addr.slice(-4)}\`;
  };
  
  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="address-display">
          <span className="address">{formatAddress(address)}</span>
          <button 
            onClick={disconnectWallet}
            className="disconnect-btn"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="connect-wallet-btn"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

export default WalletConnector;
\`\`\`

## Token Balance Display

\`\`\`javascript
import React from 'react';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { formatUnits } from 'ethers/lib/utils';

function TokenBalance({ tokenAddress, decimals = 18, symbol = 'TOKEN' }) {
  const { balance, loading, error } = useTokenBalance(tokenAddress);
  
  if (loading) return <div className="balance-loading">Loading...</div>;
  if (error) return <div className="balance-error">Error loading balance</div>;
  
  const formattedBalance = balance ? formatUnits(balance, decimals) : '0';
  
  return (
    <div className="token-balance">
      <span className="balance-amount">{parseFloat(formattedBalance).toFixed(4)}</span>
      <span className="balance-symbol">{symbol}</span>
    </div>
  );
}

// Custom hook for token balance
function useTokenBalance(tokenAddress) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address, provider } = useWallet();
  
  useEffect(() => {
    async function fetchBalance() {
      if (!address || !provider || !tokenAddress) return;
      
      try {
        setLoading(true);
        
        if (tokenAddress === 'ETH') {
          // Native ETH balance
          const balance = await provider.getBalance(address);
          setBalance(balance);
        } else {
          // ERC20 token balance
          const tokenContract = new ethers.Contract(
            tokenAddress,
            ['function balanceOf(address) view returns (uint256)'],
            provider
          );
          const balance = await tokenContract.balanceOf(address);
          setBalance(balance);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBalance();
    
    // Set up polling for balance updates
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [address, provider, tokenAddress]);
  
  return { balance, loading, error };
}

export default TokenBalance;
\`\`\`

## Transaction Form Component

\`\`\`javascript
import React, { useState } from 'react';
import { parseUnits } from 'ethers/lib/utils';
import { useContractWrite } from '../hooks/useContractWrite';

function TransferForm({ tokenAddress, tokenAbi }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const { writeContract, loading, error } = useContractWrite(tokenAddress, tokenAbi);
  
  const validateForm = () => {
    const isValidAddress = ethers.utils.isAddress(recipient);
    const isValidAmount = amount && parseFloat(amount) > 0;
    setIsValid(isValidAddress && isValidAmount);
  };
  
  useEffect(() => {
    validateForm();
  }, [recipient, amount]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    try {
      const amountWei = parseUnits(amount, 18);
      await writeContract('transfer', [recipient, amountWei]);
      
      // Reset form on success
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="transfer-form">
      <div className="form-group">
        <label htmlFor="recipient">Recipient Address</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          className={recipient && !ethers.utils.isAddress(recipient) ? 'invalid' : ''}
        />
        {recipient && !ethers.utils.isAddress(recipient) && (
          <span className="error-text">Invalid address</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          min="0"
          step="any"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={!isValid || loading}
        className="submit-btn"
      >
        {loading ? 'Sending...' : 'Send Tokens'}
      </button>
      
      {error && (
        <div className="error-message">
          Transaction failed: {error.message}
        </div>
      )}
    </form>
  );
}

export default TransferForm;
\`\`\`

## Network Status Component

\`\`\`javascript
import React from 'react';
import { useNetwork } from '../hooks/useNetwork';

function NetworkStatus() {
  const { chainId, chainName, isSupported, switchNetwork } = useNetwork();
  
  const supportedNetworks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet'
  };
  
  if (!chainId) {
    return (
      <div className="network-status disconnected">
        <span>Not connected</span>
      </div>
    );
  }
  
  if (!isSupported) {
    return (
      <div className="network-status unsupported">
        <span>Unsupported Network</span>
        <div className="network-switcher">
          {Object.entries(supportedNetworks).map(([id, name]) => (
            <button
              key={id}
              onClick={() => switchNetwork(parseInt(id))}
              className="network-option"
            >
              Switch to {name}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="network-status connected">
      <div className="network-indicator">
        <span className="status-dot"></span>
        <span className="network-name">{chainName}</span>
      </div>
    </div>
  );
}

// Custom hook for network management
function useNetwork() {
  const [networkInfo, setNetworkInfo] = useState({
    chainId: null,
    chainName: null,
    isSupported: false
  });
  
  const { provider } = useWallet();
  
  const supportedChainIds = [1, 5, 137, 80001];
  
  useEffect(() => {
    async function getNetwork() {
      if (!provider) return;
      
      try {
        const network = await provider.getNetwork();
        const isSupported = supportedChainIds.includes(network.chainId);
        
        setNetworkInfo({
          chainId: network.chainId,
          chainName: network.name,
          isSupported
        });
      } catch (error) {
        console.error('Failed to get network:', error);
      }
    }
    
    getNetwork();
    
    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        getNetwork();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', getNetwork);
      }
    };
  }, [provider]);
  
  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: \`0x\${chainId.toString(16)}\` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };
  
  return { ...networkInfo, switchNetwork };
}

export default NetworkStatus;
\`\`\`

## Loading and Error States

\`\`\`javascript
import React from 'react';

// Loading spinner component
function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <div className="loading-container">
      <div className={\`loading-spinner \${sizeClasses[size]}\`}>
        <div className="spinner-border"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

// Error boundary for Web3 errors
class Web3ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Web3 Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Error message component
function ErrorMessage({ error, onRetry }) {
  const getErrorMessage = (error) => {
    if (error?.code === 4001) {
      return 'Transaction was rejected by user';
    }
    if (error?.code === -32603) {
      return 'Internal JSON-RPC error';
    }
    if (error?.message?.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    return error?.message || 'An unknown error occurred';
  };
  
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <p className="error-text">{getErrorMessage(error)}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export { LoadingSpinner, Web3ErrorBoundary, ErrorMessage };
\`\`\`

## Component Composition

\`\`\`javascript
// Higher-order component for Web3 functionality
function withWeb3(WrappedComponent) {
  return function Web3Component(props) {
    const wallet = useWallet();
    
    if (!wallet.isConnected) {
      return (
        <div className="web3-required">
          <p>Please connect your wallet to continue</p>
          <WalletConnector />
        </div>
      );
    }
    
    return (
      <Web3ErrorBoundary>
        <WrappedComponent {...props} wallet={wallet} />
      </Web3ErrorBoundary>
    );
  };
}

// Usage
const TokenDashboard = withWeb3(({ wallet }) => {
  return (
    <div className="token-dashboard">
      <NetworkStatus />
      <TokenBalance tokenAddress="ETH" symbol="ETH" />
      <TransferForm tokenAddress={TOKEN_ADDRESS} tokenAbi={TOKEN_ABI} />
    </div>
  );
});
\`\`\`

These reusable components form the foundation of most DApp interfaces and can be customized for specific use cases.`, 
          duration: '40 min' 
        },
        { 
          id: '3', 
          title: 'State Management and Data Fetching', 
          content: `# Web3 State Management and Data Fetching

Managing blockchain state in React applications requires special consideration for asynchronous operations, caching, and real-time updates.

## Web3 State Management Patterns

**Context-Based State Management**:
\`\`\`javascript
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// State structure
const initialState = {
  wallet: {
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false
  },
  contracts: {},
  balances: {},
  transactions: {},
  loading: {
    wallet: false,
    contracts: false,
    transactions: false
  },
  errors: {}
};

// Action types
const ActionTypes = {
  SET_WALLET: 'SET_WALLET',
  SET_CONTRACT: 'SET_CONTRACT',
  SET_BALANCE: 'SET_BALANCE',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function web3Reducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_WALLET:
      return {
        ...state,
        wallet: { ...state.wallet, ...action.payload }
      };
      
    case ActionTypes.SET_CONTRACT:
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.address]: action.payload.contract
        }
      };
      
    case ActionTypes.SET_BALANCE:
      return {
        ...state,
        balances: {
          ...state.balances,
          [\`\${action.payload.address}_\${action.payload.token}\`]: action.payload.balance
        }
      };
      
    case ActionTypes.ADD_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.hash]: {
            ...action.payload,
            status: 'pending',
            timestamp: Date.now()
          }
        }
      };
      
    case ActionTypes.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.hash]: {
            ...state.transactions[action.payload.hash],
            ...action.payload
          }
        }
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };
      
    case ActionTypes.CLEAR_ERROR:
      const { [action.payload.key]: removed, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
      
    default:
      return state;
  }
}

// Context
const Web3Context = createContext();

// Provider component
export function Web3Provider({ children }) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);
  
  // Action creators
  const actions = {
    setWallet: (walletData) => {
      dispatch({ type: ActionTypes.SET_WALLET, payload: walletData });
    },
    
    setContract: (address, contract) => {
      dispatch({ 
        type: ActionTypes.SET_CONTRACT, 
        payload: { address, contract } 
      });
    },
    
    setBalance: (address, token, balance) => {
      dispatch({ 
        type: ActionTypes.SET_BALANCE, 
        payload: { address, token, balance } 
      });
    },
    
    addTransaction: (txData) => {
      dispatch({ type: ActionTypes.ADD_TRANSACTION, payload: txData });
    },
    
    updateTransaction: (hash, updates) => {
      dispatch({ 
        type: ActionTypes.UPDATE_TRANSACTION, 
        payload: { hash, ...updates } 
      });
    },
    
    setLoading: (key, value) => {
      dispatch({ 
        type: ActionTypes.SET_LOADING, 
        payload: { key, value } 
      });
    },
    
    setError: (key, error) => {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { key, error } 
      });
    },
    
    clearError: (key) => {
      dispatch({ type: ActionTypes.CLEAR_ERROR, payload: { key } });
    }
  };
  
  return (
    <Web3Context.Provider value={{ state, actions }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
\`\`\`

## Data Fetching Hooks

**Contract Data Hook**:
\`\`\`javascript
import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function useContractData(contractAddress, abi, method, args = [], options = {}) {
  const { state, actions } = useWeb3();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    refreshInterval = 0, 
    enabled = true,
    onSuccess,
    onError 
  } = options;
  
  const fetchData = useCallback(async () => {
    if (!enabled || !state.wallet.provider || !contractAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get or create contract instance
      let contract = state.contracts[contractAddress];
      if (!contract) {
        contract = new ethers.Contract(contractAddress, abi, state.wallet.provider);
        actions.setContract(contractAddress, contract);
      }
      
      // Call contract method
      const result = await contract[method](...args);
      setData(result);
      
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, method, JSON.stringify(args), enabled, state.wallet.provider]);
  
  useEffect(() => {
    fetchData();
    
    // Set up polling if refreshInterval is provided
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);
  
  // Listen for relevant events
  useEffect(() => {
    if (!state.wallet.provider || !contractAddress) return;
    
    const contract = new ethers.Contract(contractAddress, abi, state.wallet.provider);
    
    // Listen for events that might affect this data
    const eventFilters = abi
      .filter(item => item.type === 'event')
      .map(event => contract.filters[event.name]());
    
    eventFilters.forEach(filter => {
      contract.on(filter, () => {
        fetchData(); // Refresh data when relevant events occur
      });
    });
    
    return () => {
      eventFilters.forEach(filter => {
        contract.off(filter);
      });
    };
  }, [contractAddress, abi, fetchData, state.wallet.provider]);
  
  return { data, loading, error, refetch: fetchData };
}

export default useContractData;
\`\`\`

**Multi-Contract Data Hook**:
\`\`\`javascript
function useMultiContractData(queries) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const { state } = useWeb3();
  
  useEffect(() => {
    async function fetchAllData() {
      if (!state.wallet.provider) return;
      
      setLoading(true);
      const newResults = {};
      const newErrors = {};
      
      await Promise.allSettled(
        queries.map(async (query, index) => {
          try {
            const contract = new ethers.Contract(
              query.contractAddress,
              query.abi,
              state.wallet.provider
            );
            
            const result = await contract[query.method](...(query.args || []));
            newResults[query.key || index] = result;
          } catch (error) {
            newErrors[query.key || index] = error;
          }
        })
      );
      
      setResults(newResults);
      setErrors(newErrors);
      setLoading(false);
    }
    
    fetchAllData();
  }, [JSON.stringify(queries), state.wallet.provider]);
  
  return { results, loading, errors };
}
\`\`\`

## Transaction Management

**Transaction Hook**:
\`\`\`javascript
function useTransaction() {
  const { state, actions } = useWeb3();
  
  const sendTransaction = useCallback(async (txRequest) => {
    if (!state.wallet.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      actions.setLoading('transactions', true);
      
      // Estimate gas
      const gasEstimate = await state.wallet.signer.estimateGas(txRequest);
      const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
      
      // Send transaction
      const tx = await state.wallet.signer.sendTransaction({
        ...txRequest,
        gasLimit
      });
      
      // Add to state
      actions.addTransaction({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update transaction status
      actions.updateTransaction(tx.hash, {
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        receipt
      });
      
      return { transaction: tx, receipt };
    } catch (error) {
      actions.setError('transactions', error);
      throw error;
    } finally {
      actions.setLoading('transactions', false);
    }
  }, [state.wallet.signer, actions]);
  
  const sendContractTransaction = useCallback(async (
    contractAddress,
    abi,
    method,
    args = [],
    options = {}
  ) => {
    if (!state.wallet.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const contract = new ethers.Contract(contractAddress, abi, state.wallet.signer);
      
      // Estimate gas
      const gasEstimate = await contract.estimateGas[method](...args, options);
      const gasLimit = gasEstimate.mul(120).div(100);
      
      // Send transaction
      const tx = await contract[method](...args, { ...options, gasLimit });
      
      // Add to state
      actions.addTransaction({
        hash: tx.hash,
        from: tx.from,
        to: contractAddress,
        method,
        args,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update transaction status
      actions.updateTransaction(tx.hash, {
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        receipt
      });
      
      return { transaction: tx, receipt };
    } catch (error) {
      actions.setError('transactions', error);
      throw error;
    }
  }, [state.wallet.signer, actions]);
  
  return {
    sendTransaction,
    sendContractTransaction,
    transactions: state.transactions,
    loading: state.loading.transactions,
    error: state.errors.transactions
  };
}
\`\`\`

## Real-time Updates

**Event Listener Hook**:
\`\`\`javascript
function useContractEvents(contractAddress, abi, eventName, filter = {}) {
  const [events, setEvents] = useState([]);
  const { state } = useWeb3();
  
  useEffect(() => {
    if (!state.wallet.provider || !contractAddress) return;
    
    const contract = new ethers.Contract(contractAddress, abi, state.wallet.provider);
    
    // Set up event listener
    const eventFilter = contract.filters[eventName](...Object.values(filter));
    
    const handleEvent = (...args) => {
      const event = args[args.length - 1]; // Last argument is the event object
      setEvents(prev => [event, ...prev]);
    };
    
    contract.on(eventFilter, handleEvent);
    
    // Fetch historical events
    const fetchHistoricalEvents = async () => {
      try {
        const fromBlock = -10000; // Last 10k blocks
        const historicalEvents = await contract.queryFilter(eventFilter, fromBlock);
        setEvents(historicalEvents.reverse());
      } catch (error) {
        console.error('Failed to fetch historical events:', error);
      }
    };
    
    fetchHistoricalEvents();
    
    return () => {
      contract.off(eventFilter, handleEvent);
    };
  }, [contractAddress, eventName, JSON.stringify(filter), state.wallet.provider]);
  
  return events;
}
\`\`\`

## Caching and Performance

**Cache Implementation**:
\`\`\`javascript
class Web3Cache {
  constructor(ttl = 30000) { // 30 seconds default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
  
  generateKey(contractAddress, method, args) {
    return \`\${contractAddress}_\${method}_\${JSON.stringify(args)}\`;
  }
}

const web3Cache = new Web3Cache();

// Enhanced contract data hook with caching
function useCachedContractData(contractAddress, abi, method, args = []) {
  const cacheKey = web3Cache.generateKey(contractAddress, method, args);
  const [data, setData] = useState(() => web3Cache.get(cacheKey));
  const [loading, setLoading] = useState(!data);
  
  const { state } = useWeb3();
  
  useEffect(() => {
    async function fetchData() {
      // Check cache first
      const cachedData = web3Cache.get(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
      
      if (!state.wallet.provider) return;
      
      try {
        setLoading(true);
        const contract = new ethers.Contract(contractAddress, abi, state.wallet.provider);
        const result = await contract[method](...args);
        
        // Cache the result
        web3Cache.set(cacheKey, result);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch contract data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [cacheKey, state.wallet.provider]);
  
  return { data, loading };
}
\`\`\`

Proper state management and data fetching are crucial for building responsive and efficient Web3 applications.`, 
          duration: '50 min' 
        }
      ],
      enrolledStudents: 423,
      duration: '3.5 hours',
      level: 'Intermediate',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Web3', 'React', 'Frontend']
    },
    {
      id: '5',
      title: 'NFT Marketplace Development',
      description: 'Build a complete NFT marketplace from smart contracts to frontend. Learn ERC-721, IPFS integration, and marketplace mechanics with real-world implementation.',
      educator: 'Kavya Singh',
      lessons: [
        { 
          id: '1', 
          title: 'NFT Standards and Smart Contracts', 
          content: `# NFT Standards and Smart Contract Development

Non-Fungible Tokens (NFTs) represent unique digital assets on the blockchain. Understanding NFT standards and implementing robust smart contracts is fundamental to building NFT marketplaces.

## ERC-721 Standard

The ERC-721 standard defines the interface for non-fungible tokens:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to creator
    mapping(uint256 => address) public creators;
    
    // Mapping from token ID to royalty percentage (basis points)
    mapping(uint256 => uint256) public royalties;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event RoyaltySet(uint256 indexed tokenId, uint256 royaltyPercentage);
    
    constructor() ERC721("MyNFT", "MNFT") {}
    
    function mint(address to, string memory tokenURI, uint256 royaltyPercentage) 
        public 
        returns (uint256) 
    {
        require(royaltyPercentage <= 1000, "Royalty too high"); // Max 10%
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        creators[tokenId] = msg.sender;
        royalties[tokenId] = royaltyPercentage;
        
        emit NFTMinted(tokenId, msg.sender, tokenURI);
        emit RoyaltySet(tokenId, royaltyPercentage);
        
        return tokenId;
    }
    
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved or owner");
        _burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }
    
    // Royalty info for EIP-2981
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Token does not exist");
        
        address creator = creators[tokenId];
        uint256 royaltyPercentage = royalties[tokenId];
        uint256 royaltyAmount = (salePrice * royaltyPercentage) / 10000;
        
        return (creator, royaltyAmount);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }
}
\`\`\`

## ERC-1155 Multi-Token Standard

For collections with multiple token types:

\`\`\`solidity
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMultiToken is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public maxSupply;
    
    constructor() ERC1155("") {}
    
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        string memory tokenURI,
        uint256 maxSupplyForToken
    ) public {
        require(totalSupply[id] + amount <= maxSupplyForToken, "Exceeds max supply");
        
        if (creators[id] == address(0)) {
            creators[id] = msg.sender;
            maxSupply[id] = maxSupplyForToken;
            _setTokenURI(id, tokenURI);
        }
        
        _mint(to, id, amount, "");
        totalSupply[id] += amount;
    }
    
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        string[] memory tokenURIs,
        uint256[] memory maxSupplies
    ) public {
        require(
            ids.length == amounts.length && 
            ids.length == tokenURIs.length && 
            ids.length == maxSupplies.length,
            "Arrays length mismatch"
        );
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(totalSupply[ids[i]] + amounts[i] <= maxSupplies[i], "Exceeds max supply");
            
            if (creators[ids[i]] == address(0)) {
                creators[ids[i]] = msg.sender;
                maxSupply[ids[i]] = maxSupplies[i];
                _setTokenURI(ids[i], tokenURIs[i]);
            }
            
            totalSupply[ids[i]] += amounts[i];
        }
        
        _mintBatch(to, ids, amounts, "");
    }
    
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }
}
\`\`\`

## NFT Marketplace Contract

\`\`\`solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 tokenId;
        address nftContract;
        address seller;
        uint256 price;
        bool active;
        uint256 listingTime;
    }
    
    struct Auction {
        uint256 tokenId;
        address nftContract;
        address seller;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool active;
    }
    
    struct Offer {
        uint256 tokenId;
        address nftContract;
        address buyer;
        uint256 price;
        uint256 expiration;
        bool active;
    }
    
    mapping(bytes32 => Listing) public listings;
    mapping(bytes32 => Auction) public auctions;
    mapping(bytes32 => Offer[]) public offers;
    
    uint256 public marketplaceFee = 250; // 2.5%
    address public feeRecipient;
    
    event ItemListed(
        bytes32 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    
    event ItemSold(
        bytes32 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    
    event AuctionCreated(
        bytes32 indexed auctionId,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 startingPrice,
        uint256 endTime
    );
    
    event BidPlaced(
        bytes32 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );
    
    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }
    
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "Contract not approved"
        );
        
        bytes32 listingId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp)
        );
        
        listings[listingId] = Listing({
            tokenId: tokenId,
            nftContract: nftContract,
            seller: msg.sender,
            price: price,
            active: true,
            listingTime: block.timestamp
        });
        
        emit ItemListed(listingId, nftContract, tokenId, msg.sender, price);
    }
    
    function buyItem(bytes32 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        listing.active = false;
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Check for royalties
        (address royaltyRecipient, uint256 royaltyAmount) = getRoyaltyInfo(
            listing.nftContract,
            listing.tokenId,
            listing.price
        );
        
        if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
            sellerAmount -= royaltyAmount;
            payable(royaltyRecipient).transfer(royaltyAmount);
        }
        
        // Transfer NFT
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        
        // Transfer payments
        payable(listing.seller).transfer(sellerAmount);
        payable(feeRecipient).transfer(fee);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit ItemSold(listingId, msg.sender, listing.price);
    }
    
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) external nonReentrant {
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        
        bytes32 auctionId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp)
        );
        
        auctions[auctionId] = Auction({
            tokenId: tokenId,
            nftContract: nftContract,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentBid: 0,
            currentBidder: address(0),
            endTime: block.timestamp + duration,
            active: true
        });
        
        // Transfer NFT to contract
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit AuctionCreated(auctionId, nftContract, tokenId, startingPrice, block.timestamp + duration);
    }
    
    function placeBid(bytes32 auctionId) external payable nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(
            msg.value > auction.currentBid && msg.value >= auction.startingPrice,
            "Bid too low"
        );
        
        // Refund previous bidder
        if (auction.currentBidder != address(0)) {
            payable(auction.currentBidder).transfer(auction.currentBid);
        }
        
        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;
        
        emit BidPlaced(auctionId, msg.sender, msg.value);
    }
    
    function endAuction(bytes32 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction still ongoing");
        
        auction.active = false;
        
        if (auction.currentBidder != address(0)) {
            // Calculate fees and royalties
            uint256 fee = (auction.currentBid * marketplaceFee) / 10000;
            uint256 sellerAmount = auction.currentBid - fee;
            
            (address royaltyRecipient, uint256 royaltyAmount) = getRoyaltyInfo(
                auction.nftContract,
                auction.tokenId,
                auction.currentBid
            );
            
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                sellerAmount -= royaltyAmount;
                payable(royaltyRecipient).transfer(royaltyAmount);
            }
            
            // Transfer NFT to winner
            IERC721(auction.nftContract).safeTransferFrom(
                address(this),
                auction.currentBidder,
                auction.tokenId
            );
            
            // Transfer payments
            payable(auction.seller).transfer(sellerAmount);
            payable(feeRecipient).transfer(fee);
        } else {
            // No bids, return NFT to seller
            IERC721(auction.nftContract).safeTransferFrom(
                address(this),
                auction.seller,
                auction.tokenId
            );
        }
    }
    
    function getRoyaltyInfo(address nftContract, uint256 tokenId, uint256 salePrice)
        internal
        view
        returns (address, uint256)
    {
        try IERC2981(nftContract).royaltyInfo(tokenId, salePrice) returns (
            address receiver,
            uint256 royaltyAmount
        ) {
            return (receiver, royaltyAmount);
        } catch {
            return (address(0), 0);
        }
    }
}

interface IERC2981 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);
}
\`\`\`

## Advanced NFT Features

**Lazy Minting**:
\`\`\`solidity
contract LazyMintNFT is ERC721URIStorage, Ownable {
    using ECDSA for bytes32;
    
    struct NFTVoucher {
        uint256 tokenId;
        uint256 price;
        string uri;
        bytes signature;
    }
    
    mapping(address => uint256) public nonces;
    
    function redeem(NFTVoucher calldata voucher) external payable {
        require(msg.value >= voucher.price, "Insufficient payment");
        
        // Verify signature
        address signer = _verify(voucher);
        require(signer == owner(), "Invalid signature");
        
        // Mint NFT
        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);
        
        // Transfer payment to signer
        payable(signer).transfer(voucher.price);
        
        // Refund excess
        if (msg.value > voucher.price) {
            payable(msg.sender).transfer(msg.value - voucher.price);
        }
    }
    
    function _verify(NFTVoucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFTVoucher(uint256 tokenId,uint256 price,string uri,uint256 nonce)"),
            voucher.tokenId,
            voucher.price,
            keccak256(bytes(voucher.uri)),
            nonces[msg.sender]
        )));
        
        return digest.recover(voucher.signature);
    }
}
\`\`\`

These smart contracts provide the foundation for a comprehensive NFT marketplace with features like direct sales, auctions, royalties, and lazy minting.`, 
          duration: '55 min' 
        },
        { 
          id: '2', 
          title: 'IPFS Integration and Metadata', 
          content: `# IPFS Integration and NFT Metadata Management

IPFS (InterPlanetary File System) is the standard for storing NFT assets and metadata in a decentralized manner. This lesson covers IPFS integration, metadata standards, and best practices.

## Understanding IPFS

**What is IPFS?**
IPFS is a distributed file system that seeks to connect all computing devices with the same system of files. It's content-addressed, meaning files are identified by their content hash rather than location.

**Key Benefits for NFTs**:
- **Immutability**: Content cannot be changed without changing the hash
- **Decentralization**: No single point of failure
- **Efficiency**: Deduplication and distributed storage
- **Permanence**: Content persists as long as nodes pin it

## NFT Metadata Standards

**ERC-721 Metadata Standard**:
\`\`\`json
{
  "name": "Awesome NFT #1",
  "description": "This is an awesome NFT with special properties",
  "image": "ipfs://QmYourImageHash",
  "external_url": "https://yourwebsite.com/nft/1",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Power",
      "value": 95,
      "max_value": 100
    },
    {
      "display_type": "boost_percentage",
      "trait_type": "Speed Boost",
      "value": 10
    },
    {
      "display_type": "date",
      "trait_type": "Created",
      "value": 1640995200
    }
  ],
  "animation_url": "ipfs://QmYourAnimationHash",
  "youtube_url": "https://youtube.com/watch?v=...",
  "background_color": "000000"
}
\`\`\`

**Extended Metadata for Marketplace**:
\`\`\`json
{
  "name": "Awesome NFT #1",
  "description": "This is an awesome NFT with special properties",
  "image": "ipfs://QmYourImageHash",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    }
  ],
  "creator": {
    "name": "Artist Name",
    "address": "0x...",
    "bio": "Digital artist specializing in...",
    "social": {
      "twitter": "@artist",
      "instagram": "@artist",
      "website": "https://artist.com"
    }
  },
  "collection": {
    "name": "Awesome Collection",
    "description": "A collection of awesome NFTs",
    "image": "ipfs://QmCollectionImage",
    "banner": "ipfs://QmCollectionBanner"
  },
  "royalty": {
    "percentage": 5.0,
    "recipient": "0x..."
  },
  "properties": {
    "category": "Art",
    "subcategory": "Digital Art",
    "medium": "Digital",
    "dimensions": "1920x1080",
    "file_size": "2.5 MB",
    "file_type": "image/png"
  }
}
\`\`\`

## IPFS Integration with JavaScript

**Setting up IPFS Client**:
\`\`\`javascript
import { create } from 'ipfs-http-client';

class IPFSService {
  constructor() {
    // Using Infura IPFS gateway
    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: \`Basic \${Buffer.from(
          \`\${process.env.INFURA_PROJECT_ID}:\${process.env.INFURA_PROJECT_SECRET}\`
        ).toString('base64')}\`
      }
    });
  }
  
  async uploadFile(file) {
    try {
      const result = await this.client.add(file, {
        progress: (prog) => console.log(\`Received: \${prog}\`)
      });
      
      return {
        hash: result.cid.toString(),
        url: \`ipfs://\${result.cid.toString()}\`,
        gatewayUrl: \`https://ipfs.io/ipfs/\${result.cid.toString()}\`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }
  
  async uploadJSON(jsonData) {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const result = await this.client.add(jsonString);
      
      return {
        hash: result.cid.toString(),
        url: \`ipfs://\${result.cid.toString()}\`,
        gatewayUrl: \`https://ipfs.io/ipfs/\${result.cid.toString()}\`
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }
  
  async uploadDirectory(files) {
    try {
      const results = [];
      
      for await (const result of this.client.addAll(files, { wrapWithDirectory: true })) {
        results.push({
          path: result.path,
          hash: result.cid.toString(),
          url: \`ipfs://\${result.cid.toString()}\`
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error uploading directory to IPFS:', error);
      throw error;
    }
  }
  
  async getFile(hash) {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw error;
    }
  }
  
  async pinFile(hash) {
    try {
      await this.client.pin.add(hash);
      return true;
    } catch (error) {
      console.error('Error pinning file:', error);
      return false;
    }
  }
}

export default IPFSService;
\`\`\`

## React Components for NFT Upload

**File Upload Component**:
\`\`\`javascript
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import IPFSService from '../services/IPFSService';

function NFTUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  
  const ipfsService = new IPFSService();
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Upload file to IPFS
      const fileResult = await ipfsService.uploadFile(file);
      
      setUploadProgress(50);
      
      // Create and upload metadata
      const metadata = {
        name: file.name.split('.')[0],
        description: '',
        image: fileResult.url,
        attributes: [],
        properties: {
          file_type: file.type,
          file_size: file.size,
          original_name: file.name
        }
      };
      
      const metadataResult = await ipfsService.uploadJSON(metadata);
      
      setUploadProgress(100);
      
      onUploadComplete({
        file: fileResult,
        metadata: metadataResult,
        preview: previewUrl
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB
  });
  
  return (
    <div className="nft-uploader">
      <div 
        {...getRootProps()} 
        className={\`dropzone \${isDragActive ? 'active' : ''}\`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="preview">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p>
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="file-types">
              Supports: Images, Videos, Audio (Max 100MB)
            </p>
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: \`\${uploadProgress}%\` }}
            />
          </div>
          <p>Uploading to IPFS... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}

export default NFTUploader;
\`\`\`

**Metadata Editor Component**:
\`\`\`javascript
import React, { useState } from 'react';

function MetadataEditor({ initialMetadata, onSave }) {
  const [metadata, setMetadata] = useState(initialMetadata || {
    name: '',
    description: '',
    attributes: []
  });
  
  const [newAttribute, setNewAttribute] = useState({
    trait_type: '',
    value: '',
    display_type: 'string'
  });
  
  const addAttribute = () => {
    if (!newAttribute.trait_type || !newAttribute.value) return;
    
    const attribute = { ...newAttribute };
    
    // Convert value based on display type
    if (attribute.display_type === 'number') {
      attribute.value = parseFloat(attribute.value);
    } else if (attribute.display_type === 'date') {
      attribute.value = new Date(attribute.value).getTime() / 1000;
    }
    
    setMetadata(prev => ({
      ...prev,
      attributes: [...prev.attributes, attribute]
    }));
    
    setNewAttribute({
      trait_type: '',
      value: '',
      display_type: 'string'
    });
  };
  
  const removeAttribute = (index) => {
    setMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };
  
  const handleSave = async () => {
    try {
      const ipfsService = new IPFSService();
      const result = await ipfsService.uploadJSON(metadata);
      onSave(result);
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  };
  
  return (
    <div className="metadata-editor">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={metadata.name}
          onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
          placeholder="NFT Name"
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={metadata.description}
          onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your NFT..."
          rows={4}
        />
      </div>
      
      <div className="attributes-section">
        <h3>Attributes</h3>
        
        <div className="attribute-form">
          <input
            type="text"
            placeholder="Trait Type"
            value={newAttribute.trait_type}
            onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
          />
          
          <input
            type="text"
            placeholder="Value"
            value={newAttribute.value}
            onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
          />
          
          <select
            value={newAttribute.display_type}
            onChange={(e) => setNewAttribute(prev => ({ ...prev, display_type: e.target.value }))}
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boost_percentage">Boost %</option>
            <option value="boost_number">Boost Number</option>
            <option value="date">Date</option>
          </select>
          
          <button onClick={addAttribute}>Add</button>
        </div>
        
        <div className="attributes-list">
          {metadata.attributes.map((attr, index) => (
            <div key={index} className="attribute-item">
              <span className="trait-type">{attr.trait_type}</span>
              <span className="trait-value">{attr.value}</span>
              <button onClick={() => removeAttribute(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={handleSave} className="save-button">
        Save Metadata to IPFS
      </button>
    </div>
  );
}

export default MetadataEditor;
\`\`\`

## IPFS Pinning Services

**Pinata Integration**:
\`\`\`javascript
class PinataService {
  constructor(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl = 'https://api.pinata.cloud';
  }
  
  async pinFile(file, metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata.name) {
      formData.append('pinataMetadata', JSON.stringify({
        name: metadata.name,
        keyvalues: metadata.keyvalues || {}
      }));
    }
    
    const response = await fetch(\`\${this.baseUrl}/pinning/pinFileToIPFS\`, {
      method: 'POST',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey
      },
      body: formData
    });
    
    return response.json();
  }
  
  async pinJSON(jsonData, metadata = {}) {
    const response = await fetch(\`\${this.baseUrl}/pinning/pinJSONToIPFS\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: metadata
      })
    });
    
    return response.json();
  }
  
  async unpinFile(hashToUnpin) {
    const response = await fetch(\`\${this.baseUrl}/pinning/unpin/\${hashToUnpin}\`, {
      method: 'DELETE',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey
      }
    });
    
    return response.json();
  }
  
  async getPinnedFiles(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(\`\${this.baseUrl}/data/pinList?\${queryParams}\`, {
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey
      }
    });
    
    return response.json();
  }
}
\`\`\`

## Best Practices

**Metadata Validation**:
\`\`\`javascript
function validateNFTMetadata(metadata) {
  const errors = [];
  
  if (!metadata.name || metadata.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!metadata.image || !metadata.image.startsWith('ipfs://')) {
    errors.push('Valid IPFS image URL is required');
  }
  
  if (metadata.attributes) {
    metadata.attributes.forEach((attr, index) => {
      if (!attr.trait_type) {
        errors.push(\`Attribute \${index + 1}: trait_type is required\`);
      }
      if (attr.value === undefined || attr.value === '') {
        errors.push(\`Attribute \${index + 1}: value is required\`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
\`\`\`

**IPFS Gateway Fallbacks**:
\`\`\`javascript
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

function getIPFSUrl(hash, gatewayIndex = 0) {
  if (gatewayIndex >= IPFS_GATEWAYS.length) {
    throw new Error('All IPFS gateways failed');
  }
  
  return IPFS_GATEWAYS[gatewayIndex] + hash;
}

async function fetchFromIPFS(hash, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const url = getIPFSUrl(hash, i);
      const response = await fetch(url);
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.warn(\`Gateway \${i} failed:, error\`);
    }
  }
  
  throw new Error('Failed to fetch from all IPFS gateways');
}
\`\`\`

Proper IPFS integration and metadata management are crucial for creating professional NFT marketplaces that provide reliable access to digital assets.`, 
          duration: '45 min' 
        },
        { 
          id: '3', 
          title: 'Frontend Development and User Interface', 
          content: `# NFT Marketplace Frontend Development

Building an intuitive and responsive frontend for an NFT marketplace requires careful attention to user experience, performance, and Web3 integration.

## Project Structure and Setup

**React Project Structure**:
\`\`\`
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── nft/
│   │   ├── NFTCard.jsx
│   │   ├── NFTDetail.jsx
│   │   ├── NFTUploader.jsx
│   │   └── NFTGrid.jsx
│   ├── marketplace/
│   │   ├── MarketplaceFilters.jsx
│   │   ├── ListingForm.jsx
│   │   ├── AuctionForm.jsx
│   │   └── BidHistory.jsx
│   └── wallet/
│       ├── WalletConnector.jsx
│       ├── WalletInfo.jsx
│       └── TransactionStatus.jsx
├── pages/
│   ├── Home.jsx
│   ├── Marketplace.jsx
│   ├── Create.jsx
│   ├── Profile.jsx
│   └── NFTDetails.jsx
├── hooks/
│   ├── useWallet.js
│   ├── useNFT.js
│   ├── useMarketplace.js
│   └── useIPFS.js
├── services/
│   ├── web3Service.js
│   ├── ipfsService.js
│   └── marketplaceService.js
├── contexts/
│   ├── Web3Context.jsx
│   └── NFTContext.jsx
└── utils/
    ├── constants.js
    ├── helpers.js
    └── validation.js
\`\`\`

## NFT Card Component

\`\`\`javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatEther } from 'ethers/lib/utils';

function NFTCard({ nft, showPrice = true, showActions = true }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);
  
  const getImageUrl = (ipfsUrl) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      return \`https://ipfs.io/ipfs/\${ipfsUrl.slice(7)}\`;
    }
    return ipfsUrl;
  };
  
  const formatPrice = (price) => {
    return parseFloat(formatEther(price)).toFixed(4);
  };
  
  return (
    <div className="nft-card">
      <Link to={`/nft/${nft.contractAddress}/${nft.tokenId}`} className="nft-link">
        <div className="nft-image-container">
          {!imageLoaded && !imageError && (
            <div className="image-placeholder">
              <div className="loading-spinner" />
            </div>
          )}
          
          {imageError ? (
            <div className="image-error">
              <span>🖼️</span>
              <p>Image not available</p>
            </div>
          ) : (
            <img
              src={getImageUrl(nft.metadata?.image)}
              alt={nft.metadata?.name || \`NFT #\${nft.tokenId}\`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded ? 'block' : 'none' }}
              className="nft-image"
            />
          )}
          
          {nft.metadata?.animation_url && (
            <div className="animation-indicator">
              <span>🎬</span>
            </div>
          )}
        </div>
        
        <div className="nft-info">
          <h3 className="nft-name">
            {nft.metadata?.name || \`#\${nft.tokenId}\`}
          </h3>
          
          <p className="nft-collection">
            {nft.collection?.name || 'Unknown Collection'}
          </p>
          
          {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
            <div className="nft-traits">
              {nft.metadata.attributes.slice(0, 2).map((attr, index) => (
                <span key={index} className="trait-badge">
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
              {nft.metadata.attributes.length > 2 && (
                <span className="trait-more">
                  +{nft.metadata.attributes.length - 2} more
                </span>
              )}
            </div>
          )}
          
          {showPrice && nft.listing && (
            <div className="nft-price">
              <span className="price-label">Price</span>
              <span className="price-value">
                {formatPrice(nft.listing.price)} ETH
              </span>
            </div>
          )}
          
          {nft.auction && (
            <div className="nft-auction">
              <span className="auction-label">Current Bid</span>
              <span className="auction-value">
                {nft.auction.currentBid > 0 
                  ? \`\${formatPrice(nft.auction.currentBid)} ETH\`
                  : 'No bids yet'
                }
              </span>
              <span className="auction-time">
                Ends in {formatTimeRemaining(nft.auction.endTime)}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {showActions && (
        <div className="nft-actions">
          {nft.listing && (
            <button className="buy-button">
              Buy Now
            </button>
          )}
          
          {nft.auction && (
            <button className="bid-button">
              Place Bid
            </button>
          )}
          
          {!nft.listing && !nft.auction && nft.owner === userAddress && (
            <button className="list-button">
              List for Sale
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimeRemaining(endTime) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;
  
  if (remaining <= 0) return 'Ended';
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) return \`\${days}d \${hours}h\`;
  if (hours > 0) return \`\${hours}h \${minutes}m\`;
  return \`\${minutes}m\`;
}

export default NFTCard;
\`\`\`

## Marketplace Filters Component

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function MarketplaceFilters({ onFiltersChange, collections }) {
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    collections: [],
    status: 'all', // all, buy_now, auction, sold
    sortBy: 'recently_listed', // recently_listed, price_low_high, price_high_low, ending_soon
    attributes: {}
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);
  
  const handlePriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value
      }
    }));
  };
  
  const handleCollectionToggle = (collectionAddress) => {
    setFilters(prev => ({
      ...prev,
      collections: prev.collections.includes(collectionAddress)
        ? prev.collections.filter(addr => addr !== collectionAddress)
        : [...prev.collections, collectionAddress]
    }));
  };
  
  const handleAttributeFilter = (traitType, value) => {
    setFilters(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [traitType]: prev.attributes[traitType]?.includes(value)
          ? prev.attributes[traitType].filter(v => v !== value)
          : [...(prev.attributes[traitType] || []), value]
      }
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      collections: [],
      status: 'all',
      sortBy: 'recently_listed',
      attributes: {}
    });
  };
  
  return (
    <div className="marketplace-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-filters">
          Clear All
        </button>
      </div>
      
      {/* Status Filter */}
      <div className="filter-section">
        <h4>Status</h4>
        <div className="filter-options">
          {[
            { value: 'all', label: 'All Items' },
            { value: 'buy_now', label: 'Buy Now' },
            { value: 'auction', label: 'On Auction' },
            { value: 'sold', label: 'Sold' }
          ].map(option => (
            <label key={option.value} className="filter-option">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={filters.status === option.value}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range (ETH)</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="price-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="price-input"
          />
        </div>
      </div>
      
      {/* Collections */}
      <div className="filter-section">
        <h4>Collections</h4>
        <div className="collections-list">
          {collections.map(collection => (
            <label key={collection.address} className="collection-option">
              <input
                type="checkbox"
                checked={filters.collections.includes(collection.address)}
                onChange={() => handleCollectionToggle(collection.address)}
              />
              <img src={collection.image} alt={collection.name} className="collection-icon" />
              <span>{collection.name}</span>
              <span className="collection-count">({collection.itemCount})</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Sort By */}
      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          className="sort-select"
        >
          <option value="recently_listed">Recently Listed</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="ending_soon">Ending Soon</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="most_favorited">Most Favorited</option>
        </select>
      </div>
      
      {/* Advanced Filters */}
      <div className="filter-section">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="advanced-toggle"
        >
          Advanced Filters {showAdvanced ? '▲' : '▼'}
        </button>
        
        {showAdvanced && (
          <div className="advanced-filters">
            {/* Attribute filters would be dynamically generated based on collection traits */}
            <div className="attribute-filters">
              <h5>Attributes</h5>
              {/* This would be populated based on selected collections */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketplaceFilters;
\`\`\`

## NFT Detail Page

\`\`\`javascript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNFT } from '../hooks/useNFT';
import { useMarketplace } from '../hooks/useMarketplace';
import { formatEther, parseEther } from 'ethers/lib/utils';

function NFTDetail() {
  const { contractAddress, tokenId } = useParams();
  const { nft, loading, error } = useNFT(contractAddress, tokenId);
  const { buyNFT, placeBid, listNFT } = useMarketplace();
  
  const [showListingModal, setShowListingModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  
  if (loading) return <div className="loading">Loading NFT details...</div>;
  if (error) return <div className="error">Error loading NFT: {error.message}</div>;
  if (!nft) return <div className="not-found">NFT not found</div>;
  
  const handleBuy = async () => {
    try {
      await buyNFT(nft.listing.id, nft.listing.price);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };
  
  const handleBid = async () => {
    try {
      const bidValue = parseEther(bidAmount);
      await placeBid(nft.auction.id, bidValue);
      setBidAmount('');
      setShowBidModal(false);
    } catch (error) {
      console.error('Bid failed:', error);
    }
  };
  
  const handleList = async () => {
    try {
      const price = parseEther(listingPrice);
      await listNFT(contractAddress, tokenId, price);
      setListingPrice('');
      setShowListingModal(false);
    } catch (error) {
      console.error('Listing failed:', error);
    }
  };
  
  return (
    <div className="nft-detail">
      <div className="nft-detail-container">
        <div className="nft-media">
          <div className="media-container">
            {nft.metadata?.animation_url ? (
              <video
                src={getIPFSUrl(nft.metadata.animation_url)}
                controls
                poster={getIPFSUrl(nft.metadata.image)}
                className="nft-video"
              />
            ) : (
              <img
                src={getIPFSUrl(nft.metadata?.image)}
                alt={nft.metadata?.name}
                className="nft-image"
              />
            )}
          </div>
          
          {/* Attributes */}
          {nft.metadata?.attributes && (
            <div className="nft-attributes">
              <h3>Attributes</h3>
              <div className="attributes-grid">
                {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="attribute-card">
                    <div className="attribute-type">{attr.trait_type}</div>
                    <div className="attribute-value">{attr.value}</div>
                    {attr.rarity && (
                      <div className="attribute-rarity">{attr.rarity}% rare</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="nft-info">
          <div className="nft-header">
            <h1 className="nft-title">{nft.metadata?.name || \`#\${tokenId}\`}</h1>
            <div className="nft-collection">
              <img src={nft.collection?.image} alt={nft.collection?.name} />
              <span>{nft.collection?.name}</span>
            </div>
          </div>
          
          <div className="nft-description">
            <p>{nft.metadata?.description}</p>
          </div>
          
          <div className="nft-details">
            <div className="detail-row">
              <span>Contract Address</span>
              <span className="contract-address">{contractAddress}</span>
            </div>
            <div className="detail-row">
              <span>Token ID</span>
              <span>{tokenId}</span>
            </div>
            <div className="detail-row">
              <span>Owner</span>
              <span className="owner-address">{nft.owner}</span>
            </div>
            <div className="detail-row">
              <span>Creator</span>
              <span className="creator-address">{nft.creator}</span>
            </div>
          </div>
          
          {/* Pricing and Actions */}
          <div className="nft-pricing">
            {nft.listing && (
              <div className="listing-info">
                <div className="price-section">
                  <span className="price-label">Current Price</span>
                  <span className="price-value">
                    {formatEther(nft.listing.price)} ETH
                  </span>
                </div>
                <button onClick={handleBuy} className="buy-button">
                  Buy Now
                </button>
              </div>
            )}
            
            {nft.auction && (
              <div className="auction-info">
                <div className="bid-section">
                  <span className="bid-label">
                    {nft.auction.currentBid > 0 ? 'Current Bid' : 'Starting Price'}
                  </span>
                  <span className="bid-value">
                    {formatEther(nft.auction.currentBid || nft.auction.startingPrice)} ETH
                  </span>
                </div>
                <div className="auction-time">
                  Ends in {formatTimeRemaining(nft.auction.endTime)}
                </div>
                <button 
                  onClick={() => setShowBidModal(true)} 
                  className="bid-button"
                >
                  Place Bid
                </button>
              </div>
            )}
            
            {!nft.listing && !nft.auction && nft.isOwner && (
              <button 
                onClick={() => setShowListingModal(true)} 
                className="list-button"
              >
                List for Sale
              </button>
            )}
          </div>
          
          {/* Transaction History */}
          <div className="transaction-history">
            <h3>Transaction History</h3>
            <div className="history-list">
              {nft.history?.map((tx, index) => (
                <div key={index} className="history-item">
                  <div className="history-type">{tx.type}</div>
                  <div className="history-price">
                    {tx.price && \`\${formatEther(tx.price)} ETH\`}
                  </div>
                  <div className="history-from">{tx.from}</div>
                  <div className="history-to">{tx.to}</div>
                  <div className="history-date">
                    {new Date(tx.timestamp * 1000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showBidModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Place Bid</h3>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount in ETH"
              step="0.001"
            />
            <div className="modal-actions">
              <button onClick={() => setShowBidModal(false)}>Cancel</button>
              <button onClick={handleBid}>Place Bid</button>
            </div>
          </div>
        </div>
      )}
      
      {showListingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>List NFT for Sale</h3>
            <input
              type="number"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              placeholder="Enter price in ETH"
              step="0.001"
            />
            <div className="modal-actions">
              <button onClick={() => setShowListingModal(false)}>Cancel</button>
              <button onClick={handleList}>List NFT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getIPFSUrl(ipfsUrl) {
  if (ipfsUrl?.startsWith('ipfs://')) {
    return \`https://ipfs.io/ipfs/\${ipfsUrl.slice(7)}\`;
  }
  return ipfsUrl;
}

export default NFTDetail;
\`\`\`

## Responsive Design and Performance

**CSS for Mobile Responsiveness**:
\`\`\`css
/* NFT Grid */
.nft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

@media (max-width: 768px) {
  .nft-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .nft-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
}

/* NFT Card */
.nft-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.nft-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.nft-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.nft-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Filters */
.marketplace-filters {
  width: 280px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 24px;
}

@media (max-width: 1024px) {
  .marketplace-filters {
    width: 100%;
    position: static;
    margin-bottom: 24px;
  }
}
\`\`\`

**Performance Optimization**:
\`\`\`javascript
// Lazy loading for NFT images
import { lazy, Suspense } from 'react';

const LazyNFTCard = lazy(() => import('./NFTCard'));

function NFTGrid({ nfts }) {
  return (
    <div className="nft-grid">
      {nfts.map(nft => (
        <Suspense key={\`\${nft.contractAddress}-\${nft.tokenId}\`} fallback={<NFTCardSkeleton />}>
          <LazyNFTCard nft={nft} />
        </Suspense>
      ))}
    </div>
  );
}

// Virtual scrolling for large lists
import { FixedSizeGrid as Grid } from 'react-window';

function VirtualizedNFTGrid({ nfts, containerWidth, containerHeight }) {
  const columnCount = Math.floor(containerWidth / 300);
  const rowCount = Math.ceil(nfts.length / columnCount);
  
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const nft = nfts[index];
    
    if (!nft) return null;
    
    return (
      <div style={style}>
        <NFTCard nft={nft} />
      </div>
    );
  };
  
  return (
    <Grid
      columnCount={columnCount}
      columnWidth={300}
      height={containerHeight}
      rowCount={rowCount}
      rowHeight={400}
      width={containerWidth}
    >
      {Cell}
    </Grid>
  );
}
\`\`\`

This comprehensive frontend provides a solid foundation for an NFT marketplace with modern UI/UX patterns, responsive design, and performance optimizations.`, 
          duration: '60 min' 
        }
      ],
      enrolledStudents: 287,
      duration: '4.5 hours',
      level: 'Advanced',
      image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['NFT', 'Marketplace', 'IPFS']
    }
  ]);

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [tokenBalance, setTokenBalance] = useState(150);
  const [lessonProgress, setLessonProgress] = useState<{ [courseId: string]: { [lessonId: string]: boolean } }>({});

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'How do smart contracts ensure security?',
      content: 'I\'m learning about smart contracts and wondering about the security mechanisms. Can someone explain how smart contracts are secured against vulnerabilities?',
      author: 'Alex Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      tags: ['Smart Contracts', 'Security'],
      votes: 12,
      answers: [
        {
          id: '1',
          content: 'Smart contracts use several security mechanisms including immutability, cryptographic hashing, and consensus mechanisms. The code is audited and once deployed, cannot be changed.',
          author: 'Dr. Ananya Sharma',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c5e24227?auto=format&fit=crop&w=400&q=80',
          votes: 8,
          timestamp: '2 hours ago'
        }
      ],
      timestamp: '1 day ago'
    },
    {
      id: '2',
      title: 'Best practices for DeFi development?',
      content: 'What are the key considerations when building DeFi protocols? Looking for insights on architecture and security patterns.',
      author: 'Maria Garcia',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      tags: ['DeFi', 'Development', 'Best Practices'],
      votes: 15,
      answers: [],
      timestamp: '3 days ago'
    }
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Blockchain Beginners',
      description: 'A study group for those new to blockchain technology. We meet weekly to discuss concepts and share resources.',
      members: 24,
      maxMembers: 30,
      tags: ['Blockchain', 'Beginners'],
      creator: 'Alex Chen',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      name: 'Smart Contract Developers',
      description: 'Advanced group focusing on smart contract development, security audits, and best practices.',
      members: 18,
      maxMembers: 25,
      tags: ['Smart Contracts', 'Development'],
      creator: 'Dr. Ananya Sharma',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const addCourse = (course: Omit<Course, 'id' | 'enrolledStudents'>) => {
    const newCourse: Course = {
      ...course,
      id: Math.random().toString(36).substr(2, 9),
      enrolledStudents: 0
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const enrollInCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course && !enrolledCourses.find(c => c.id === courseId)) {
      setEnrolledCourses(prev => [...prev, course]);
      setCourses(prev => prev.map(c => 
        c.id === courseId ? { ...c, enrolledStudents: c.enrolledStudents + 1 } : c
      ));
    }
  };

  const completeCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const certificate: Certificate = {
        id: Math.random().toString(36).substr(2, 9),
        courseId,
        courseTitle: course.title,
        issueDate: new Date().toISOString(),
        studentName: 'Alex Chen',
        verificationHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        educatorName: course.educator,
        completionDate: new Date().toISOString()
      };
      setCertificates(prev => [...prev, certificate]);
      setTokenBalance(prev => prev + 50); // Reward tokens for completion
    }
  };

  const markLessonAsRead = (courseId: string, lessonId: string) => {
    setLessonProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [lessonId]: true
      }
    }));
    setTokenBalance(prev => prev + 5); // Reward tokens for lesson completion
  };

  const generateCertificate = (courseId: string): Certificate => {
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const certificate: Certificate = {
      id: Math.random().toString(36).substr(2, 9),
      courseId,
      courseTitle: course.title,
      issueDate: new Date().toISOString(),
      studentName: 'Alex Chen',
      verificationHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      educatorName: course.educator,
      completionDate: new Date().toISOString()
    };

    setCertificates(prev => [...prev, certificate]);
    setTokenBalance(prev => prev + 50);
    
    return certificate;
  };

  const addQuestion = (question: Omit<Question, 'id' | 'votes' | 'answers' | 'timestamp'>) => {
    const newQuestion: Question = {
      ...question,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
      answers: [],
      timestamp: 'just now'
    };
    setQuestions(prev => [newQuestion, ...prev]);
  };

  const addAnswer = (questionId: string, answer: Omit<Answer, 'id' | 'votes' | 'timestamp'>) => {
    const newAnswer: Answer = {
      ...answer,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
      timestamp: 'just now'
    };
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
    ));
    setTokenBalance(prev => prev + 10); // Reward tokens for helping
  };

  const voteQuestion = (questionId: string, vote: 1 | -1) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, votes: q.votes + vote } : q
    ));
  };

  const voteAnswer = (questionId: string, answerId: string, vote: 1 | -1) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? {
        ...q,
        answers: q.answers.map(a => 
          a.id === answerId ? { ...a, votes: a.votes + vote } : a
        )
      } : q
    ));
  };

  const joinStudyGroup = (groupId: string) => {
    setStudyGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, members: g.members + 1 } : g
    ));
  };

  const earnTokens = (amount: number) => {
    setTokenBalance(prev => prev + amount);
  };

  return (
    <DataContext.Provider value={{
      courses,
      enrolledCourses,
      certificates,
      questions,
      studyGroups,
      tokenBalance,
      lessonProgress,
      addCourse,
      enrollInCourse,
      completeCourse,
      markLessonAsRead,
      generateCertificate,
      addQuestion,
      addAnswer,
      voteQuestion,
      voteAnswer,
      joinStudyGroup,
      earnTokens
    }}>
      {children}
    </DataContext.Provider>
  );
};