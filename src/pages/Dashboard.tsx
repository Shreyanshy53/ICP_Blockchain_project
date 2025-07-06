import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import EducatorDashboard from '../components/EducatorDashboard';
import LearnerDashboard from '../components/LearnerDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user?.role === 'educator' ? <EducatorDashboard /> : <LearnerDashboard />}
    </div>
  );
};

export default Dashboard;