import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MinimalNavbar() {
  const [textGradient, setTextGradient] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextGradient((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md bg-white/30 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-light tracking-wide"
            style={{
              background: `linear-gradient(${textGradient}deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #3B82F6)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%'
            }}
          >
            Claimd
          </Link>
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/user" 
              className="text-sm text-gray-900 border border-gray-900 px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

