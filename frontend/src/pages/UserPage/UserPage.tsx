import React from 'react';
import UserDash from '../../components/UserDash';

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
          <UserDash />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
