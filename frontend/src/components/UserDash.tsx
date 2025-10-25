import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import sampleData from '../sample_api_call_db.json';

interface UserData {
  name: string;
  ssn: string;
}

interface Application {
  application_id: string;
  documents: string[];
  claude_confidence_level: number;
  claude_summary: string;
  claude_recommendation: string;
}

interface DatabaseUser {
  name: string;
  ssn: string;
  applications: Application[];
}

export default function UserDash() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
  const [formData, setFormData] = useState({ name: '', ssn: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [ssnFocused, setSsnFocused] = useState(false);
  const [ssnDisplayValue, setSsnDisplayValue] = useState('');

  const formatSSN = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 9 digits
    const limitedDigits = digits.substring(0, 9);
    
    // Add dashes at appropriate positions
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 5) {
      return `${limitedDigits.substring(0, 3)}-${limitedDigits.substring(3)}`;
    } else {
      return `${limitedDigits.substring(0, 3)}-${limitedDigits.substring(3, 5)}-${limitedDigits.substring(5)}`;
    }
  };

  const searchUserInDatabase = (name: string, ssn: string): DatabaseUser | null => {
    return sampleData.find((user: DatabaseUser) => 
      user.name.toLowerCase() === name.toLowerCase() && user.ssn === ssn
    ) || null;
  };

  // Check for existing cookie on component mount
  useEffect(() => {
    const savedUserData = Cookies.get('userData');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        
        // Search for user in database
        const foundUser = searchUserInDatabase(parsedData.name, parsedData.ssn);
        setDatabaseUser(foundUser);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        Cookies.remove('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== 'ssn') { // SSN is handled separately
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.ssn.trim()) {
      const userInfo: UserData = {
        name: formData.name.trim(),
        ssn: formData.ssn.trim()
      };
      
      // Search for user in database
      const foundUser = searchUserInDatabase(userInfo.name, userInfo.ssn);
      setDatabaseUser(foundUser);
      
      // Store in cookie (expires in 30 days)
      Cookies.set('userData', JSON.stringify(userInfo), { expires: 30 });
      setUserData(userInfo);
      setFormData({ name: '', ssn: '' });
      setSsnDisplayValue('');
      setSsnFocused(false);
    }
  };

  const handleSignOut = () => {
    Cookies.remove('userData');
    setUserData(null);
    setDatabaseUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Welcome back!</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{userData.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">SSN:</span>
              <span className="text-gray-900 font-mono">{userData.ssn}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        {databaseUser ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Your Applications ({databaseUser.applications.length})</h3>
            <div className="space-y-4">
              {databaseUser.applications.map((app, index) => (
                <div key={app.application_id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">Application #{index + 1}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.claude_recommendation === 'approve' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.claude_recommendation === 'approve' ? 'Approved' : 'Under Review'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{app.claude_summary}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Confidence: {Math.round(app.claude_confidence_level * 100)}%</span>
                    <span>{app.documents.length} documents</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Applications</h3>
            <p className="text-blue-700">No applications found in our system. Submit a new application to get started.</p>
          </div>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-8">
      <div className="max-w-md w-full px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Access your disability benefits dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-gray-50"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-2">
              Social Security Number
            </label>
            <input
              type="text"
              id="ssn"
              name="ssn"
              value={ssnFocused ? ssnDisplayValue : (formData.ssn ? '***-**-****' : '')}
              onChange={(e) => {
                // Extract only digits from the input
                const digits = e.target.value.replace(/\D/g, '');
                // Limit to 9 digits
                const limitedDigits = digits.substring(0, 9);
                // Format with dashes
                const formatted = formatSSN(limitedDigits);
                setSsnDisplayValue(formatted);
                setFormData(prev => ({
                  ...prev,
                  ssn: formatted
                }));
              }}
              onFocus={() => {
                setSsnFocused(true);
                setSsnDisplayValue(formData.ssn);
              }}
              onBlur={() => setSsnFocused(false)}
              required
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-gray-100 focus:bg-gray-50"
              placeholder={ssnFocused ? "123-45-6789" : "XXX-XX-XXXX"}
              maxLength={11}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">Your information is stored securely on your device.</p>
        </div>
      </div>
    </div>
  );
}