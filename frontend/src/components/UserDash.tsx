import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, CheckCircle, XCircle, AlertCircle, ArrowRight, Sparkles, Shield, BarChart3, TrendingUp, Clock, Eye, Zap } from 'lucide-react';
import Cookies from 'js-cookie';
import sampleData from '../sample_api_call_db.json';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Preparing your applications</p>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        {/* Futuristic Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20"></div>
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Your Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Disability Benefits Management Portal</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {databaseUser?.applications.length || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Applications</div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* User Profile Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden cursor-pointer shadow-2xl">
                {/* Animated floating particles */}
                <div className="absolute inset-0">
                  <div className="absolute w-8 h-8 bg-white/30 rounded-full opacity-60 animate-bounce" style={{top: '20%', left: '15%', animationDelay: '0s', animationDuration: '3s'}}></div>
                  <div className="absolute w-6 h-6 bg-blue-300/40 rounded-full opacity-70 animate-bounce" style={{top: '60%', right: '20%', animationDelay: '1s', animationDuration: '2.5s'}}></div>
                  <div className="absolute w-4 h-4 bg-white/50 rounded-full opacity-80 animate-bounce" style={{top: '30%', right: '10%', animationDelay: '2s', animationDuration: '4s'}}></div>
                  <div className="absolute w-5 h-5 bg-purple-300/40 rounded-full opacity-50 animate-bounce" style={{bottom: '25%', left: '25%', animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
                  <div className="absolute w-7 h-7 bg-indigo-300/40 rounded-full opacity-60 animate-bounce" style={{top: '70%', left: '10%', animationDelay: '1.5s', animationDuration: '2.8s'}}></div>
                  <div className="absolute w-3 h-3 bg-white/60 rounded-full opacity-90 animate-bounce" style={{top: '15%', right: '30%', animationDelay: '2.5s', animationDuration: '3.2s'}}></div>
                </div>
                
                {/* User initials */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {getUserInitials(userData.name)}
                  </span>
                </div>
              </div>
              
              {/* Enhanced dropdown on hover */}
              <div className="absolute left-full top-0 ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-6 min-w-56 mt-16">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{userData.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mb-4">****-****-{getLastFourSSN(userData.ssn)}</div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 text-sm font-medium shadow-lg transform hover:scale-105"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        
          {databaseUser ? (
            <div className="space-y-6">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Your Applications ({databaseUser.applications.length})</h3>
                </div>
                <div className="space-y-6">
                  {databaseUser.applications.map((app, index) => (
                    <div
                      key={app.application_id}
                      onClick={() => handleApplicationClick(app.application_id)}
                      className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-blue-300/50 dark:hover:border-blue-400/50 transition-all duration-300 cursor-pointer hover-lift"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-6 mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg">Application #{index + 1}</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{app.documents.length} documents</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Approval Likeliness:</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      app.claude_confidence_level >= 0.8
                                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                                        : app.claude_confidence_level >= 0.6
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                        : 'bg-gradient-to-r from-red-400 to-red-500'
                                    }`}
                                    style={{ width: `${app.claude_confidence_level * 100}%` }}
                                  />
                                </div>
                                <span className={`font-bold text-sm ${getConfidenceColor(app.claude_confidence_level)}`}>
                                  {Math.round(app.claude_confidence_level * 100)}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status:</span>
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(app.claude_recommendation)}`}>
                                {getRecommendationIcon(app.claude_recommendation)}
                                <span className="capitalize">{app.claude_recommendation.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Application Summary:</span> {app.claude_summary}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-6">
                          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-12 text-center hover-lift">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Applications Found</h3>
              <p className="text-slate-500 dark:text-slate-400">No applications found in our system. Submit a new application to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        {/* Futuristic Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Sign In
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Access your disability benefits dashboard</p>
            </div>
          </div>
        </div>
        
        {/* Futuristic Form */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-8 hover-lift">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="ssn" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
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
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 font-mono text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder={ssnFocused ? "123-45-6789" : "XXX-XX-XXXX"}
                maxLength={11}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your information is stored securely on your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}