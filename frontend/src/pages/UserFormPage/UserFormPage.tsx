import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MultiStepForm from '../../components/MultiStepForm';

const UserFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Apply for Social Security Benefits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete this step-by-step application to get your benefits processed 
            <span className="text-green-600 font-semibold"> 20x faster</span> with our AI-powered system.
          </p>
          <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure & HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Human-in-the-Loop Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>1-2 Day Processing</span>
            </div>
          </div>
        </div>
        <MultiStepForm />
      </main>
      <Footer />
    </div>
  );
};

export default UserFormPage;
