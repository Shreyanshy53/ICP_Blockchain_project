import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Users, 
  Plus, 
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

const CommunityPage: React.FC = () => {
  const { 
    questions, 
    studyGroups, 
    addQuestion, 
    addAnswer, 
    voteQuestion, 
    voteAnswer,
    joinStudyGroup 
  } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'questions' | 'groups'>('questions');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [questionForm, setQuestionForm] = useState({
    title: '',
    content: '',
    tags: ['']
  });

  const [answerForm, setAnswerForm] = useState({
    content: ''
  });

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion({
      title: questionForm.title,
      content: questionForm.content,
      author: user?.name || '',
      authorAvatar: user?.avatar,
      tags: questionForm.tags.filter(tag => tag.trim() !== '')
    });
    setQuestionForm({ title: '', content: '', tags: [''] });
    setShowQuestionForm(false);
  };

  const handleSubmitAnswer = (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    addAnswer(questionId, {
      content: answerForm.content,
      author: user?.name || '',
      authorAvatar: user?.avatar
    });
    setAnswerForm({ content: '' });
    setShowAnswerForm(null);
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Connect with fellow learners and share knowledge</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Q&A</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Study Groups</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'questions' ? 'questions' : 'study groups'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {activeTab === 'questions' && (
              <button
                onClick={() => setShowQuestionForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ask Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'questions' ? (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => voteQuestion(question.id, 1)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">{question.votes}</span>
                      <button
                        onClick={() => voteQuestion(question.id, -1)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={question.authorAvatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80`}
                          alt={question.author}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{question.author}</p>
                          <p className="text-sm text-gray-500">{question.timestamp}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                      <p className="text-gray-700 mb-4">{question.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">
                            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
                          </h4>
                          <button
                            onClick={() => setShowAnswerForm(showAnswerForm === question.id ? null : question.id)}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            Answer
                          </button>
                        </div>
                        
                        {showAnswerForm === question.id && (
                          <form onSubmit={(e) => handleSubmitAnswer(e, question.id)} className="mb-4">
                            <textarea
                              value={answerForm.content}
                              onChange={(e) => setAnswerForm({ content: e.target.value })}
                              placeholder="Write your answer..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setShowAnswerForm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Post Answer
                              </button>
                            </div>
                          </form>
                        )}
                        
                        <div className="space-y-4">
                          {question.answers.map((answer) => (
                            <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex flex-col items-center space-y-1">
                                  <button
                                    onClick={() => voteAnswer(question.id, answer.id, 1)}
                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                  </button>
                                  <span className="text-sm font-medium text-gray-700">{answer.votes}</span>
                                  <button
                                    onClick={() => voteAnswer(question.id, answer.id, -1)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <ThumbsDown className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <img
                                      src={answer.authorAvatar || `https://images.unsplash.com/photo-1494790108755-2616c5e24227?auto=format&fit=crop&w=400&q=80`}
                                      alt={answer.author}
                                      className="h-6 w-6 rounded-full object-cover"
                                    />
                                    <div>
                                      <p className="font-medium text-gray-900 text-sm">{answer.author}</p>
                                      <p className="text-xs text-gray-500">{answer.timestamp}</p>
                                    </div>
                                  </div>
                                  <p className="text-gray-700">{answer.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={group.image} 
                    alt={group.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{group.members}/{group.maxMembers} members</span>
                      <span>by {group.creator}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => joinStudyGroup(group.id)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Ask a Question</h2>
            </div>
            
            <form onSubmit={handleSubmitQuestion} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {questionForm.tags.map((tag, index) => (
                    <input
                      key={index}
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...questionForm.tags];
                        newTags[index] = e.target.value;
                        setQuestionForm({ ...questionForm, tags: newTags });
                      }}
                      placeholder="Enter tag"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;