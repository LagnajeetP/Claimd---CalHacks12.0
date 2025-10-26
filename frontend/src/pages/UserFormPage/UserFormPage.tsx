import React from 'react';
import MinimalNavbar from '../../components/MinimalNavbar';
import MultiStepForm from '../../components/MultiStepForm';

const UserFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <MinimalNavbar />
      <main className="py-16 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-thin text-gray-900 mb-4">
            Apply for Social Security Benefits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Complete this step-by-step application to get your benefits processed 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> 20x faster</span> with our AI-powered system.
          </p>
          <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure & HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Human-in-the-Loop</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>1-2 Day Processing</span>
            </div>
          </div>
        </div>
        <MultiStepForm />
      </main>
    </div>
  );
};

export default UserFormPage;
