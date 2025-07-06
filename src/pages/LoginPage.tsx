import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Globe, Shield, Users, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'educator' | 'learner' | null>(null);
  const [authMethod, setAuthMethod] = useState<'signin' | 'signup' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'learner' as 'educator' | 'learner'
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInternetIdentityLogin = async (role: 'educator' | 'learner') => {
    setSelectedRole(role);
    await login(role);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedRole(formData.role);
    await login(formData.role);
  };

  const resetForm = () => {
    setAuthMethod(null);
    setSelectedRole(null);
    setFormData({
      name: '',
      email: '',
      role: 'learner'
    });
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

      {/* Right side - Authentication */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {authMethod === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {authMethod === 'signup' 
                  ? 'Join the decentralized education revolution' 
                  : 'Choose your authentication method'
                }
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">
                  {selectedRole === 'educator' ? 'Connecting as Educator...' : 'Connecting as Learner...'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Authenticating with Internet Identity
                </p>
              </div>
            ) : !authMethod ? (
              // Initial choice between Sign In and Sign Up
              <div className="space-y-4">
                <button
                  onClick={() => setAuthMethod('signin')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Sign In
                  <p className="text-sm opacity-90 mt-1">I already have an account</p>
                </button>

                <button
                  onClick={() => setAuthMethod('signup')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Sign Up
                  <p className="text-sm opacity-90 mt-1">Create a new account</p>
                </button>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500">
                    Powered by Internet Computer Protocol
                  </p>
                </div>
              </div>
            ) : authMethod === 'signin' ? (
              // Sign In Options
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Role</h3>
                  <p className="text-sm text-gray-600">Select how you want to access the platform</p>
                </div>

                <button
                  onClick={() => handleInternetIdentityLogin('educator')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Continue as Educator</span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">Create and manage courses</p>
                </button>

                <button
                  onClick={() => handleInternetIdentityLogin('learner')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Continue as Learner</span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">Explore and enroll in courses</p>
                </button>

                <button
                  onClick={resetForm}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                  ← Back to options
                </button>
              </div>
            ) : (
              // Sign Up Form
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="learner"
                        checked={formData.role === 'learner'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'learner' })}
                        className="mr-2"
                      />
                      <div>
                        <div className="font-medium">Learner</div>
                        <div className="text-xs text-gray-500">Take courses</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="educator"
                        checked={formData.role === 'educator'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'educator' })}
                        className="mr-2"
                      />
                      <div>
                        <div className="font-medium">Educator</div>
                        <div className="text-xs text-gray-500">Create courses</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Create Account with Internet Identity
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                  ← Back to options
                </button>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;