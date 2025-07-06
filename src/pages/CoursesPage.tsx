import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Play 
} from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { courses, enrollInCourse, enrolledCourses } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || 
                           course.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const handleEnroll = (courseId: string) => {
    if (user?.role === 'learner') {
      enrollInCourse(courseId);
    }
  };

  const categories = ['all', 'blockchain', 'smart contracts', 'defi', 'development'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
        <p className="text-gray-600">Discover and enroll in courses to advance your blockchain knowledge</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
                <span className="text-sm text-gray-500">{course.educator}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledStudents}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                >
                  View Details
                </Link>
                
                {user?.role === 'learner' && (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isEnrolled(course.id)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
                      isEnrolled(course.id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isEnrolled(course.id) ? 'Enrolled' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;