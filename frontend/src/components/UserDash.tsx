import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Plus } from 'lucide-react';
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
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [userDatabase, setUserDatabase] = useState<any[]>([]);
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

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLastFourSSN = (ssn: string) => {
    return ssn.slice(-4);
  };


  const fetchUserData = async () => {
    try {
      // Try to fetch from API first
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const apiData = await response.json();
        console.log('Fetched data from API:', apiData);
        setUserDatabase(apiData);
        return apiData;
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.log('API call failed, using sample data:', error);
      // Fallback to sample data
      setUserDatabase(sampleData);
      return sampleData;
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      // Check for admin login
      if (formData.username.toLowerCase() === 'admin' && formData.password === 'admin') {
        const userData = {
          name: 'Admin',
          ssn: 'admin'
        };
        Cookies.set('userData', JSON.stringify({ ...userData, role: 'admin' }), { expires: 7 });
        navigate('/admin');
        return;
      }
      
      // Regular user login - search by username
      const userData = {
        name: formData.username.trim(),
        ssn: formData.password.trim() // Using password as SSN for user matching
      };
      
      Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
      setUserData(userData);
      
      // Find user by name only
      const foundUser = userDatabase.find(user => 
        user.name.toLowerCase() === userData.name.toLowerCase()
      ) || null;
      setDatabaseUser(foundUser);
      
      setFormData({ username: '', password: '' });
    }
  };

  const handleSignOut = () => {
    Cookies.remove('userData');
    setUserData(null);
    setDatabaseUser(null);
  };



  useEffect(() => {
    const initializeData = async () => {
      // Fetch user data (API or fallback to sample)
      const fetchedData = await fetchUserData();
      
      // Check for saved user data
      const savedUserData = Cookies.get('userData');
      console.log('Saved user data from cookie:', savedUserData);
      
      if (savedUserData) {
        try {
          const parsed = JSON.parse(savedUserData);
          console.log('Parsed user data:', parsed);
          
          // Check if this is an admin user
          if (parsed.role === 'admin') {
            console.log('Admin user detected, redirecting to admin dashboard');
            navigate('/admin');
            return;
          }
          
          setUserData(parsed);
          
          // Search in the freshly fetched data by name only
          const foundUser = fetchedData.find((user: any) => 
            user.name.toLowerCase() === parsed.name.toLowerCase()
          ) || null;
          setDatabaseUser(foundUser);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          Cookies.remove('userData');
        }
      }
      setIsLoading(false);
    };

    initializeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600 font-light">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-thin text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600 font-light">Access your disability benefits dashboard</p>
          </div>
          
          {/* Form */}
          <div className="bg-white border border-gray-300 p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-light text-gray-600 mb-2 uppercase tracking-wider text-xs">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 transition-colors duration-200 font-light"
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-light text-gray-600 mb-2 uppercase tracking-wider text-xs">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 transition-colors duration-200 font-light"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 hover:bg-gray-800 transition-all duration-200 font-light"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* User Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-white relative overflow-hidden cursor-pointer">
              {/* Animated floating bubbles */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
              <div className="absolute bottom-6 left-8 w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-8 right-6 w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}></div>
              <div className="absolute top-12 left-12 w-3 h-3 bg-green-200 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.8s' }}></div>
              
              {/* User initials */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-800 drop-shadow-lg">
                  {getUserInitials(userData.name)}
                </span>
              </div>
            </div>
            
            {/* Dropdown below avatar on hover */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 min-w-[200px]">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Name</p>
                    <p className="text-slate-800 font-semibold">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">SSN</p>
                    <p className="text-slate-800 font-mono">***-**-{getLastFourSSN(userData.ssn)}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-3 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        {databaseUser ? (
          <div className="bg-white border border-gray-300 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-thin text-gray-900">Your Applications <span className="font-light text-gray-400">({databaseUser.applications.length})</span></h3>
              <button
                onClick={() => navigate('/user/form')}
                className="bg-gray-900 text-white p-3 hover:bg-gray-800 transition-all duration-200 font-light"
                title="Apply for Benefits"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              {databaseUser.applications.map((app, index) => (
                <div
                  key={app.application_id}
                  onClick={() => handleApplicationClick(app.application_id)}
                  className="border border-gray-300 p-6 hover:border-gray-900 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-6xl font-thin text-gray-300">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center space-x-3">
                            <span className="text-sm font-light text-gray-600 uppercase tracking-wider">Approval Likeliness</span>
                            <span className={`font-light text-lg ${getConfidenceColor(app.claude_confidence_level)}`}>
                              {Math.round(app.claude_confidence_level * 100)}%
                            </span>
                          </div>
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 border text-xs font-light ${getRecommendationColor(app.claude_recommendation)}`}>
                            {getRecommendationIcon(app.claude_recommendation)}
                            <span className="capitalize">{app.claude_recommendation.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 font-light line-clamp-2 pl-24">
                        {app.claude_summary}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-thin text-gray-900">Your Applications</h3>
              <button
                onClick={() => navigate('/user/form')}
                className="bg-gray-900 text-white p-3 hover:bg-gray-800 transition-all duration-200 font-light"
                title="Apply for Benefits"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 font-light">No applications found in our system. Submit a new application to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}