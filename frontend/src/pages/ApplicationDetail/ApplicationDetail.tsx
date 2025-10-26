import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Loader2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { api, type Application } from '../../services/api';
import { maskSSN } from '../../utils/ssnUtils';

export default function ApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);
  const [actionLoading, setActionLoading] = useState<'approve' | 'deny' | null>(null);

  // Helper to extract base64 data
  const extractBase64 = (input: any): string | null => {
    if (!input) return null;

    // Handle Binary.createFromBase64('...', 0)
    if (typeof input === 'string' && input.includes('Binary.createFromBase64')) {
      const match = input.match(/Binary\.createFromBase64\('([^']+)'/);
      return match ? match[1] : null;
    }

    // Handle MongoDB Binary { $binary: { base64: "..." } }
    if (input?.$binary?.base64) {
      return input.$binary.base64;
    }

    // Handle pure base64 strings
    if (typeof input === 'string' && /^[A-Za-z0-9+/=]+$/.test(input)) {
      return input;
    }

    return null;
  };

  useEffect(() => {
  const fetchApplication = async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      const data = await api.getApplicationById(applicationId);
      setApplication(data);


      // --- Handle different possible shapes of the document field ---
      let base64: string | null = null;
      const doc = data.document;

      if (!doc) {
        console.warn('⚠️ No document field found');
      } else if (typeof doc === 'string') {
        // Example: Binary.createFromBase64('JVBERi0xLjQKJeLjz9M...', 0)
        const match = doc.match(/Binary\.createFromBase64\('([^']+)'/);
        if (match) {
          base64 = match[1];
        } else if (doc.startsWith('JVBER')) {
          // It's a direct base64 string
          base64 = doc;
        }
      } else if (doc.$binary?.base64) {
        base64 = doc.$binary.base64;
      }

      if (base64) {
        // Create a proper data URI for the PDF
        const dataUrl = `data:application/pdf;base64,${base64}`;
        setPdfSrc(dataUrl);
      } else {
        console.warn('❌ Could not extract base64 from document');
      }
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
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">Application not found.</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Application Detail</h1>
            <p className="text-sm text-slate-500 font-mono">ID: {application.application_id}</p>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">Document Viewer</h2>
            </div>
            {pdfSrc && (
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = pdfSrc;
                  link.download = `${application.application_id || 'document'}.pdf`;
                  link.click();
                }}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-md"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>

          <div className="h-[800px] bg-white">
            {pdfSrc && !pdfError ? (
              <iframe
                src={pdfSrc}
                title="Document PDF"
                className="w-full h-full border-0"
                onError={() => setPdfError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-slate-500">
                <div>
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p>{pdfError ? 'Unable to load PDF.' : 'No document available.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary & AI Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800">AI Summary</h3>
            <p className="text-slate-700 text-sm">{application.claude_summary}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Info</h3>
              <p><strong>Name:</strong> {application.applicant_name}</p>
              <p><strong>SSN:</strong> {maskSSN(application.applicant_ssn || '')}</p>
              <p><strong>ID:</strong> {application.application_id}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Recommendation</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getRecommendationColor(application.claude_recommendation)}`}>
                {getRecommendationIcon(application.claude_recommendation)}
                <span className="capitalize font-medium">
                  {application.claude_recommendation || 'N/A'}
                </span>
              </div>
              <div className="mt-3 text-sm">
                Confidence:{" "}
                <span className={getConfidenceColor(application.claude_confidence_level || 0)}>
                  {(application.claude_confidence_level * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading === 'approve'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {actionLoading === 'approve' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>Approve</span>
              </button>
              <button
                onClick={handleDeny}
                disabled={actionLoading === 'deny'}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {actionLoading === 'deny' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>Deny</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
