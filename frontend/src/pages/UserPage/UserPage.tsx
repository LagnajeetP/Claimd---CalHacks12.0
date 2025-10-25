import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import UserDash from '../../components/UserDash';

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <UserDash />
      <Footer />
    </div>
  );
};

export default UserPage;
