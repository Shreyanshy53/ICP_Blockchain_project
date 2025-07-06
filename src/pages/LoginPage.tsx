import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Globe, Shield, Users } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'educator' | 'learner' | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (role: 'educator' | 'learner') => {
    setSelectedRole(role);
    await login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-white p-4 rounded-2xl">
              <GraduationCap className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold">ICP Scholar</h1>
          </div>
          <h2 className="text-2xl mb-6">Decentralized Education Platform</h2>
          <p className="text-lg mb-8 opacity-90">
            Learn, teach, and earn on the Internet Computer Protocol
          </p>
          
          <div className="grid grid-cols-1 gap-6 mt-12">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Fully Decentralized</h3>
                <p className="text-sm opacity-80">Built on Internet Computer Protocol</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Secure & Verified</h3>
                <p className="text-sm opacity-80">Blockchain-based certificates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Community Driven</h3>
                <p className="text-sm opacity-80">Peer learning and collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ICP Scholar
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Choose your role to continue</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {selectedRole === 'educator' ? 'Connecting as Educator...' : 'Connecting as Learner...'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Authenticating with Internet Identity
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => handleLogin('educator')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Continue as Educator</span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">Create and manage courses</p>
                </button>

                <button
                  onClick={() => handleLogin('learner')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Continue as Learner</span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">Explore and enroll in courses</p>
                </button>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Powered by Internet Computer Protocol
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;