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
  addCourse: (course: Omit<Course, 'id' | 'enrolledStudents'>) => void;
  enrollInCourse: (courseId: string) => void;
  completeCourse: (courseId: string) => void;
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
      description: 'Learn the fundamentals of blockchain technology, including how it works, its applications, and its potential impact on various industries.',
      educator: 'Dr. Sarah Johnson',
      lessons: [
        { id: '1', title: 'What is Blockchain?', content: 'Understanding the basic concepts of blockchain technology...', duration: '15 min' },
        { id: '2', title: 'Cryptographic Hashing', content: 'Deep dive into cryptographic hashing and its role in blockchain...', duration: '20 min' },
        { id: '3', title: 'Consensus Mechanisms', content: 'Exploring different consensus mechanisms like PoW and PoS...', duration: '25 min' }
      ],
      enrolledStudents: 1247,
      duration: '3 hours',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
      tags: ['Blockchain', 'Cryptocurrency', 'Technology']
    },
    {
      id: '2',
      title: 'Smart Contracts Development',
      description: 'Master smart contract development using Solidity and learn how to deploy them on Ethereum.',
      educator: 'Prof. Michael Rodriguez',
      lessons: [
        { id: '1', title: 'Solidity Basics', content: 'Introduction to Solidity programming language...', duration: '30 min' },
        { id: '2', title: 'Contract Structure', content: 'Understanding smart contract structure and components...', duration: '25 min' },
        { id: '3', title: 'Deployment & Testing', content: 'How to deploy and test smart contracts...', duration: '35 min' }
      ],
      enrolledStudents: 892,
      duration: '5 hours',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=600&q=80',
      tags: ['Smart Contracts', 'Solidity', 'Ethereum']
    },
    {
      id: '3',
      title: 'DeFi Protocol Architecture',
      description: 'Explore the architecture of decentralized finance protocols and learn how to build your own DeFi applications.',
      educator: 'Dr. Emily Chen',
      lessons: [
        { id: '1', title: 'DeFi Fundamentals', content: 'Understanding decentralized finance protocols...', duration: '20 min' },
        { id: '2', title: 'Liquidity Pools', content: 'How liquidity pools work in DeFi...', duration: '30 min' },
        { id: '3', title: 'Yield Farming', content: 'Exploring yield farming strategies...', duration: '25 min' }
      ],
      enrolledStudents: 654,
      duration: '4 hours',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
      tags: ['DeFi', 'Protocols', 'Finance']
    }
  ]);

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [tokenBalance, setTokenBalance] = useState(150);

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
          author: 'Dr. Sarah Johnson',
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
      creator: 'Dr. Sarah Johnson',
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
        verificationHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
      setCertificates(prev => [...prev, certificate]);
      setTokenBalance(prev => prev + 50); // Reward tokens for completion
    }
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
      addCourse,
      enrollInCourse,
      completeCourse,
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