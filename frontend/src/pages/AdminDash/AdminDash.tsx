
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
  ArrowRight
} from 'lucide-react';
import { api, type Application } from '../../services/api';

export default function AdminDash() {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-slate-600">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Review and manage disability applications</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-slate-600">Total Applications</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterRecommendation}
                onChange={(e) => setFilterRecommendation(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No applications found</h3>
              <p className="text-slate-500">
                {searchTerm || filterRecommendation !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No applications are currently available.'
                }
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.application_id}
                onClick={() => handleApplicationClick(application.application_id)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-slate-500" />
                        <span className="font-semibold text-slate-800">{application.applicant_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{application.documents.length} documents</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Confidence:</span>
                        <span className={`font-bold ${getConfidenceColor(application.claude_confidence_level)}`}>
                          {Math.round(application.claude_confidence_level * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Recommendation:</span>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-xs ${getRecommendationColor(application.claude_recommendation)}`}>
                          {getRecommendationIcon(application.claude_recommendation)}
                          <span className="capitalize">{application.claude_recommendation.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-600 line-clamp-2">
                      <span className="font-medium">Synopsis Preview:</span> {application.claude_summary}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-slate-500 font-mono">ID: {application.application_id.slice(0, 8)}...</span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
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