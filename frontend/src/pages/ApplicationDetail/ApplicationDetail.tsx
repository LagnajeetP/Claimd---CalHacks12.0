import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertCircle, Loader2, Download, ZoomIn, ZoomOut, Shield, Sparkles, Eye, BarChart3, TrendingUp } from 'lucide-react';
import { api, type Application } from '../../services/api';
import { maskSSN } from '../../utils/ssnUtils';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

export default function ApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<'approve' | 'deny' | null>(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;
      
      try {
        setLoading(true);
        const data = await api.getApplicationById(applicationId);
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleApprove = async () => {
    if (!applicationId) return;
    
    setActionLoading('approve');
    try {
      const result = await api.approveApplication(applicationId);
      if (result.success) {
        alert(result.message);
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async () => {
    if (!applicationId) return;
    
    setActionLoading('deny');
    try {
      const result = await api.denyApplication(applicationId);
      if (result.success) {
        alert(result.message);
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error denying application:', error);
      alert('Failed to deny application');
    } finally {
      setActionLoading(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">Loading application details...</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Preparing document viewer</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Application Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      {/* Futuristic Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20"></div>
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="p-3 bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 rounded-xl transition-all duration-200 group backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      Application Detail
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-mono text-sm">ID: {application.application_id}</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Viewer - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover-lift">
              <div className="px-6 py-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-700/50 dark:to-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Document Viewer</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">AI-Powered Review</span>
                  </div>
                </div>
                {application.documents.length > 1 && (
                  <div className="mt-4 flex space-x-2">
                    {application.documents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentDocumentIndex(index);
                          setPdfError(false);
                        }}
                        className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${
                          index === currentDocumentIndex
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                        }`}
                      >
                        Document {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 overflow-hidden">
                  <div className="bg-white/70 dark:bg-slate-800/70 border-b border-slate-200/50 dark:border-slate-600/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {application.documents[currentDocumentIndex]?.split('/').pop() || 'Document'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Document {currentDocumentIndex + 1} of {application.documents.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setCurrentDocumentIndex(Math.max(0, currentDocumentIndex - 1));
                          setPdfError(false);
                        }}
                        disabled={currentDocumentIndex === 0}
                        className="px-4 py-2 text-xs bg-white/50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium text-slate-600 dark:text-slate-400"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          setCurrentDocumentIndex(Math.min(application.documents.length - 1, currentDocumentIndex + 1));
                          setPdfError(false);
                        }}
                        disabled={currentDocumentIndex === application.documents.length - 1}
                        className="px-4 py-2 text-xs bg-white/50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium text-slate-600 dark:text-slate-400"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = application.documents[currentDocumentIndex];
                          link.download = `document-${currentDocumentIndex + 1}.pdf`;
                          link.click();
                        }}
                        className="px-4 py-2 text-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-[800px] bg-white dark:bg-slate-800">
                    {pdfError ? (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                            <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">PDF Preview Unavailable</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Your browser doesn't support PDF preview. You can download the document to view it.
                          </p>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = application.documents[currentDocumentIndex];
                              link.download = `document-${currentDocumentIndex + 1}.pdf`;
                              link.click();
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-lg transform hover:scale-105"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full">
                        <iframe
                          src={application.documents[currentDocumentIndex]}
                          className="w-full h-full border-0"
                          title={`Document ${currentDocumentIndex + 1}`}
                          onLoad={() => {
                            console.log('PDF loaded successfully:', application.documents[currentDocumentIndex]);
                            setPdfError(false);
                          }}
                          onError={(e) => {
                            console.error('PDF load error:', e, 'URL:', application.documents[currentDocumentIndex]);
                            setPdfError(true);
                          }}
                        />
                        {/* Fallback object tag */}
                        <object
                          data={application.documents[currentDocumentIndex]}
                          type="application/pdf"
                          className="w-full h-full hidden"
                          onLoad={() => {
                            console.log('PDF loaded via object tag:', application.documents[currentDocumentIndex]);
                            setPdfError(false);
                          }}
                          onError={() => {
                            console.error('PDF load error via object tag:', application.documents[currentDocumentIndex]);
                            setPdfError(true);
                          }}
                        >
                          <div className="h-full flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-slate-600 mb-2">PDF Preview Unavailable</h3>
                              <p className="text-slate-500 mb-4">
                                Your browser doesn't support PDF preview. You can download the document to view it.
                              </p>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = application.documents[currentDocumentIndex];
                                  link.download = `document-${currentDocumentIndex + 1}.pdf`;
                                  link.click();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                              >
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>
                        </object>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 text-center">
                    Use your browser's PDF controls to zoom, scroll, and navigate through the document
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations & Actions - Right Column */}
          <div className="space-y-6">
            {/* Application Info */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Application Info</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Applicant</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{application.applicant_name}</p>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">SSN</span>
                  <p className="text-slate-800 dark:text-slate-200 font-mono text-lg font-semibold">{maskSSN(application.ssn || '')}</p>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Documents</span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{application.documents.length} files</p>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Summary from Claude</h3>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{application.claude_summary}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">AI Recommendation</h3>
              </div>
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-lg ${getRecommendationColor(application.claude_recommendation)}`}>
                {getRecommendationIcon(application.claude_recommendation)}
                <span className="capitalize">{application.claude_recommendation.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Confidence Level */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Confidence Level</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        application.claude_confidence_level >= 0.8
                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                          : application.claude_confidence_level >= 0.6
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                          : 'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${application.claude_confidence_level * 100}%` }}
                    />
                  </div>
                  <span className={`text-2xl font-bold ${getConfidenceColor(application.claude_confidence_level)}`}>
                    {Math.round(application.claude_confidence_level * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Actions</h3>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading !== null}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  {actionLoading === 'approve' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                  <span>Approve</span>
                </button>
                
                <button
                  onClick={handleDeny}
                  disabled={actionLoading !== null}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  {actionLoading === 'deny' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                  <span>Deny</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}