import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { api, type Application } from '../../services/api';
import { maskSSN } from '../../utils/ssnUtils';

export default function ApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-slate-600">Loading application...</span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Application Not Found</h2>
          <p className="text-slate-500 mb-6">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Application Detail</h1>
              <p className="text-slate-600 font-mono text-sm">ID: {application.application_id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Document Viewer</h2>
                </div>
                {Array.isArray(application.documents) && application.documents.length > 1 && (
                  <div className="mt-3 flex space-x-2">
                    {Array.isArray(application.documents) && application.documents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentDocumentIndex(index);
                          setPdfError(false);
                        }}
                        className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                          index === currentDocumentIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        Document {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">
                          {Array.isArray(application.documents) && application.documents[currentDocumentIndex] ? application.documents[currentDocumentIndex]?.split('/').pop() || 'Document' : 'No Document Available'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Document {currentDocumentIndex + 1} of {Array.isArray(application.documents) ? application.documents.length : 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setCurrentDocumentIndex(Math.max(0, currentDocumentIndex - 1));
                          setPdfError(false);
                        }}
                        disabled={currentDocumentIndex === 0}
                        className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          setCurrentDocumentIndex(Math.min(application.documents.length - 1, currentDocumentIndex + 1));
                          setPdfError(false);
                        }}
                        disabled={!Array.isArray(application.documents) || currentDocumentIndex === application.documents.length - 1}
                        className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
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
                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-[800px] bg-white">
                    {pdfError ? (
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
                    ) : (
                      <div className="w-full h-full">
                        {Array.isArray(application.documents) && application.documents.length > 0 && application.documents[currentDocumentIndex] ? (
                          <iframe
                            src={application.documents[currentDocumentIndex]}
                            className="w-full h-full border-0"
                            title={`Document ${currentDocumentIndex + 1}`}
                            onLoad={() => setPdfError(false)}
                            onError={() => setPdfError(true)}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-slate-600 mb-2">No Documents Available</h3>
                              <p className="text-slate-500">Documents are not yet uploaded for this application.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Overview</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Applicant Name</label>
                  <p className="text-slate-800 font-medium">{application.applicant_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">SSN</label>
                  <p className="text-slate-800 font-mono">{maskSSN(application.applicant_ssn || application.ssn || '')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Application ID</label>
                  <p className="text-slate-800 font-mono text-sm">{application.application_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Documents Submitted</label>
                  <p className="text-slate-800">{Array.isArray(application.documents) && application.documents.length > 0 ? application.documents.length : 0} {Array.isArray(application.documents) && application.documents.length === 1 ? 'document' : 'documents'}</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Confidence Level</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          application.claude_confidence_level >= 0.8 ? 'bg-green-500' :
                          application.claude_confidence_level >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${application.claude_confidence_level * 100}%` }}
                      />
                    </div>
                    <span className={`font-bold text-sm ${getConfidenceColor(application.claude_confidence_level)}`}>
                      {Math.round(application.claude_confidence_level * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Recommendation</label>
                  <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm mt-1 font-medium ${getRecommendationColor(application.claude_recommendation)}`}>
                    {getRecommendationIcon(application.claude_recommendation)}
                    <span className="capitalize">
                      {application.claude_recommendation === 'approve' ? 'Approved' :
                       application.claude_recommendation === 'deny' ? 'Denied' :
                       application.claude_recommendation === 'further_review' ? 'Needs Review' :
                       application.claude_recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Summary</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {application.claude_summary}
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading === 'approve'}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {actionLoading === 'approve' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Approve Application</span>
                </button>
                <button
                  onClick={handleDeny}
                  disabled={actionLoading === 'deny'}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {actionLoading === 'deny' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Deny Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}