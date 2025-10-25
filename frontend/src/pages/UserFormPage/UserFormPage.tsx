import React from 'react';
import UserForm from '../../components/UserForm';

const UserFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Form</h1>
            <UserForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
