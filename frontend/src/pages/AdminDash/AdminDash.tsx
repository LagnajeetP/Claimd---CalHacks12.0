
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { api, type Application } from '../../services/api';
import { maskSSN } from '../../utils/ssnUtils';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

export default function AdminDash() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState<string>('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await api.getAllApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.application_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRecommendation === 'all' || app.claude_recommendation === filterRecommendation;
    return matchesSearch && matchesFilter;
  });

  const handleApplicationClick = (applicationId: string) => {
    navigate(`/admin/detail/${applicationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">Loading applications...</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Preparing your dashboard</p>
        </div>
      </div>
    );
  }

  const approvedCount = applications.filter(app => app.claude_recommendation === 'approve').length;
  const pendingCount = applications.filter(app => app.claude_recommendation === 'further_review').length;
  const deniedCount = applications.filter(app => app.claude_recommendation === 'deny').length;

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
                      Admin Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">AI-Powered Application Review System</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {applications.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Applications</div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover-lift group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Applications</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{applications.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover-lift group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover-lift group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover-lift group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Denied</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{deniedCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search by name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterRecommendation}
                onChange={(e) => setFilterRecommendation(e.target.value)}
                className="px-6 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Recommendations</option>
                <option value="approve">Approve</option>
                <option value="deny">Deny</option>
                <option value="further_review">Further Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No applications found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm || filterRecommendation !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No applications are currently available.'
                }
              </p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <div
                key={application.application_id}
                onClick={() => handleApplicationClick(application.application_id)}
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
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{application.applicant_name}</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{application.documents.length} documents</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Confidence:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                application.claude_confidence_level >= 0.8
                                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                                  : application.claude_confidence_level >= 0.6
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                  : 'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${application.claude_confidence_level * 100}%` }}
                            />
                          </div>
                          <span className={`font-bold text-sm ${getConfidenceColor(application.claude_confidence_level)}`}>
                            {Math.round(application.claude_confidence_level * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Recommendation:</span>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(application.claude_recommendation)}`}>
                          {getRecommendationIcon(application.claude_recommendation)}
                          <span className="capitalize">{application.claude_recommendation.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Synopsis Preview:</span> {application.claude_summary}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {application.application_id.slice(0, 8)}...</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}