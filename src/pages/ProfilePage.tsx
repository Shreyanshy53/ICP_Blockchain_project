import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  User, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Download,
  Calendar,
  MapPin,
  Mail,
  Shield
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { enrolledCourses, certificates, tokenBalance } = useData();

  const completedCourses = certificates.length;
  const inProgressCourses = enrolledCourses.length - completedCourses;

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen },
    { label: 'Certificates Earned', value: completedCourses, icon: Award },
    { label: 'ICP Tokens', value: tokenBalance, icon: TrendingUp },
    { label: 'Learning Hours', value: '24', icon: Calendar },
  ];

  const achievements = [
    { title: 'First Course', description: 'Completed your first course', icon: '🎓', earned: true },
    { title: 'Fast Learner', description: 'Completed 3 courses in a month', icon: '⚡', earned: true },
    { title: 'Knowledge Sharer', description: 'Answered 10 community questions', icon: '💡', earned: false },
    { title: 'Expert', description: 'Earned 5 certificates', icon: '🏆', earned: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <img
                src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80`}
                alt={user?.name}
                className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'educator' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {user?.role === 'educator' ? 'Educator' : 'Learner'}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Verified Identity</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Member since</span>
                  <span>January 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Principal ID</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {user?.principal.substring(0, 8)}...
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Token Balance */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">ICP Scholar Tokens</h3>
                <p className="text-3xl font-bold">{tokenBalance}</p>
                <p className="text-sm opacity-90">Keep learning to earn more!</p>
              </div>
              <TrendingUp className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.earned ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificates</h2>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
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
                      <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-mono">
                        Verification Hash: {cert.verificationHash}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{course.duration}</span>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        In Progress
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;