import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Award, TrendingUp, Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { enrolledCourses, certificates, tokenBalance, courses } = useData();

  const completedCourses = certificates.length;
  const inProgressCourses = enrolledCourses.length - completedCourses;

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Certificates Earned', value: completedCourses, icon: Award, color: 'bg-green-500' },
    { label: 'In Progress', value: inProgressCourses, icon: Clock, color: 'bg-orange-500' },
    { label: 'ICP Tokens', value: tokenBalance, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-emerald-100 text-lg">Continue your learning journey and earn rewards</p>
          </div>
          <Link
            to="/courses"
            className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.slice(0, 2).map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{course.duration}</span>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        In Progress
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Featured Courses</h2>
            <Link
              to="/courses"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents}</span>
                    </div>
                    <span>{course.duration}</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center block"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      {certificates.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Certificates</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.slice(0, 2).map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-600 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.courseTitle}</h3>
                      <p className="text-sm text-gray-600">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                    {cert.verificationHash}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerDashboard;