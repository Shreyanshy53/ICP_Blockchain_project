import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Award,
  CheckCircle,
  Circle
} from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, enrollInCourse, enrolledCourses, completeCourse } = useData();
  const { user } = useAuth();
  const [activeLesson, setActiveLesson] = useState<number>(0);

  const course = courses.find(c => c.id === courseId);
  const isEnrolled = enrolledCourses.some(c => c.id === courseId);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link 
            to="/courses" 
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    if (user?.role === 'learner' && courseId) {
      enrollInCourse(courseId);
    }
  };

  const handleCompleteCourse = () => {
    if (courseId) {
      completeCourse(courseId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/courses" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Hero */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (124 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledStudents} students</span>
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
              
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">Instructor:</span>
                <span className="font-semibold text-gray-900">{course.educator}</span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          {isEnrolled && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Content</h2>
              
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="mb-4">
                  <button
                    onClick={() => setActiveLesson(index)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      activeLesson === index
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                      {lesson.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </button>
                  
                  {activeLesson === index && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{lesson.content}</p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCompleteCourse}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Award className="h-5 w-5" />
                  <span>Complete Course & Get Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            {user?.role === 'learner' && !isEnrolled && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
                  <p className="text-gray-600">Full access to all course materials</p>
                </div>
                
                <button
                  onClick={handleEnroll}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Enroll Now
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Join {course.enrolledStudents} other students
                  </p>
                </div>
              </div>
            )}
            
            {isEnrolled && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium">
                    ✓ Enrolled
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">0/{course.lessons.length} lessons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">What you'll learn</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Master the fundamentals of blockchain technology</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Understand cryptographic principles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Learn about consensus mechanisms</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Get hands-on experience with real examples</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Course Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Self-paced learning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Community access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;