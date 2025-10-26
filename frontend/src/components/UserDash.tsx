import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
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
  const navigate = useNavigate();

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'deny':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'further_review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return <CheckCircle className="w-4 h-4" />;
      case 'deny':
        return <XCircle className="w-4 h-4" />;
      case 'further_review':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApplicationClick = (applicationId: string) => {
    navigate(`/user/detail/${applicationId}`);
  };


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
    const getUserInitials = (name: string) => {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const getLastFourSSN = (ssn: string) => {
      return ssn.slice(-4);
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Animated User Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-white relative overflow-hidden cursor-pointer">
                {/* Animated floating bubbles */}
                <div className="absolute inset-0">
                  <div className="absolute w-8 h-8 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{top: '20%', left: '15%', animationDelay: '0s', animationDuration: '3s'}}></div>
                  <div className="absolute w-6 h-6 bg-green-300 rounded-full opacity-70 animate-bounce" style={{top: '60%', right: '20%', animationDelay: '1s', animationDuration: '2.5s'}}></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full opacity-80 animate-bounce" style={{top: '30%', right: '10%', animationDelay: '2s', animationDuration: '4s'}}></div>
                  <div className="absolute w-5 h-5 bg-blue-200 rounded-full opacity-50 animate-bounce" style={{bottom: '25%', left: '25%', animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
                  <div className="absolute w-7 h-7 bg-green-200 rounded-full opacity-60 animate-bounce" style={{top: '70%', left: '10%', animationDelay: '1.5s', animationDuration: '2.8s'}}></div>
                  <div className="absolute w-3 h-3 bg-white rounded-full opacity-90 animate-bounce" style={{top: '15%', right: '30%', animationDelay: '2.5s', animationDuration: '3.2s'}}></div>
                </div>
                
                {/* User initials */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-4xl font-bold text-gray-800 drop-shadow-lg">
                    {getUserInitials(userData.name)}
                  </span>
                </div>
              </div>
              
              {/* Side dropdown on hover */}
              <div className="absolute left-full top-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-48 mt-16">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{userData.name}</div>
                  <div className="text-xs text-gray-600 font-mono mb-3">****-****-{getLastFourSSN(userData.ssn)}</div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        
        {databaseUser ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Your Applications ({databaseUser.applications.length})</h3>
            <div className="space-y-4">
              {databaseUser.applications.map((app, index) => (
                <div
                  key={app.application_id}
                  onClick={() => handleApplicationClick(app.application_id)}
                  className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-slate-500" />
                          <span className="font-semibold text-slate-800">Application #{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{app.documents.length} documents</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">Approval Likeliness:</span>
                          <span className={`font-bold ${getConfidenceColor(app.claude_confidence_level)}`}>
                            {Math.round(app.claude_confidence_level * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">Status:</span>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-xs ${getRecommendationColor(app.claude_recommendation)}`}>
                            {getRecommendationIcon(app.claude_recommendation)}
                            <span className="capitalize">{app.claude_recommendation.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-slate-600 line-clamp-2">
                        <span className="font-medium">Application Summary:</span> {app.claude_summary}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Your Applications</h3>
            <p className="text-slate-600">No applications found in our system. Submit a new application to get started.</p>
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