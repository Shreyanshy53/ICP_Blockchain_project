import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Plus, BookOpen, Users, TrendingUp, Star } from 'lucide-react';
import CreateCourseModal from './CreateCourseModal';

const EducatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const myCourses = courses.filter(course => course.educator === user?.name);
  const totalEnrollments = myCourses.reduce((sum, course) => sum + course.enrolledStudents, 0);

  const stats = [
    { label: 'Total Courses', value: myCourses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Students', value: totalEnrollments, icon: Users, color: 'bg-green-500' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
    { label: 'Course Views', value: '12.5K', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-purple-100 text-lg">Ready to inspire minds and share knowledge today?</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Course</span>
            </button>
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

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          </div>
          <div className="p-6">
            {myCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-4">Start creating your first course to share your knowledge with learners.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{course.enrolledStudents} students</span>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create Course</h3>
              <p className="text-sm text-gray-500">Start a new course</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">View Students</h3>
              <p className="text-sm text-gray-500">Check enrollments</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-500">Course performance</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Star className="h-8 w-8 text-yellow-600 mb-2" />
              <h3 className="font-medium text-gray-900">Reviews</h3>
              <p className="text-sm text-gray-500">Student feedback</p>
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateCourseModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default EducatorDashboard;