import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, CheckCircle, XCircle, AlertCircle, ArrowRight, Shield, Plus } from 'lucide-react';
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
  const [ssnDisplayValue, setSsnDisplayValue] = useState('');
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

  const formatSSN = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
    if (!match) return value;
    
    const [, part1, part2, part3] = match;
    let formatted = '';
    if (part1) formatted += part1;
    if (part2) formatted += `-${part2}`;
    if (part3) formatted += `-${part3}`;
    return formatted;
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
    if (formData.name.trim() && formData.ssn.trim()) {
      const userData = {
        name: formData.name.trim(),
        ssn: formData.ssn.trim()
      };
      
      // Check if this is an admin SSN
      const adminSSN = import.meta.env.VITE_ADMIN_SSN || '123-00-4572'; // Fallback for development
      console.log('Admin SSN from env:', import.meta.env.VITE_ADMIN_SSN);
      console.log('Using admin SSN:', adminSSN);
      console.log('User entered SSN:', userData.ssn);
      
      const cleanInputSSN = userData.ssn.replace(/\D/g, '');
      const cleanAdminSSN = adminSSN.replace(/\D/g, '');
      
      console.log('Clean input SSN:', cleanInputSSN);
      console.log('Clean admin SSN:', cleanAdminSSN);
      console.log('Is admin?', cleanInputSSN === cleanAdminSSN);
      
      if (cleanInputSSN === cleanAdminSSN) {
        // Admin login - redirect to admin dashboard
        Cookies.set('userData', JSON.stringify({ ...userData, role: 'admin' }), { expires: 7 });
        navigate('/admin');
        return;
      }
      
      // Regular user login
      Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
      setUserData(userData);
      
      // Search in the current userDatabase state
      const cleanSSN = userData.ssn.replace(/\D/g, '');
      const foundUser = userDatabase.find(user => 
        user.name.toLowerCase() === userData.name.toLowerCase() && 
        user.ssn.replace(/\D/g, '') === cleanSSN
      ) || null;
      setDatabaseUser(foundUser);
      
      setFormData({ name: '', ssn: '' });
      setSsnDisplayValue('');
    }
  };

  const handleSignOut = () => {
    Cookies.remove('userData');
    setUserData(null);
    setDatabaseUser(null);
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData(prev => ({ ...prev, ssn: formatted }));
    setSsnDisplayValue(formatted);
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
          
          // Search in the freshly fetched data
          const cleanSSN = parsed.ssn.replace(/\D/g, '');
          const foundUser = fetchedData.find((user: any) => 
            user.name.toLowerCase() === parsed.name.toLowerCase() && 
            user.ssn.replace(/\D/g, '') === cleanSSN
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Sign In</h1>
                <p className="text-slate-600">Access your disability benefits dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="ssn" className="block text-sm font-medium text-slate-700 mb-2">
                  Social Security Number
                </label>
                <input
                  type="text"
                  id="ssn"
                  value={ssnDisplayValue}
                  onChange={handleSSNChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono"
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  Your SSN is encrypted and stored securely
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-20">
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Your Applications ({databaseUser.applications.length})</h3>
              <button
                onClick={() => navigate('/user/form')}
                className="group relative bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                title="Apply for Benefits"
              >
                <Plus className="w-6 h-6" />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Apply for Benefits
                </div>
              </button>
            </div>
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
                          <span className="text-sm font-medium text-slate-600">Predicted Outcome:</span>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">Your Applications</h3>
              <button
                onClick={() => navigate('/user/form')}
                className="group relative bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                title="Apply for Benefits"
              >
                <Plus className="w-6 h-6" />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Apply for Benefits
                </div>
              </button>
            </div>
            <p className="text-slate-600">No applications found in our system. Submit a new application to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}