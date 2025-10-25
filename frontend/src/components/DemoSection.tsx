import { useState } from 'react';
import { FileText, Clock, CheckCircle, ArrowRight, Eye, Zap, AlertCircle } from 'lucide-react';

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            See the Difference: <span className="text-blue-600">Live Demo</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI transforms 34 documents and 8-10 minutes of manual work 
            into a 30-second AI summary.
          </p>
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-semibold">
                This is a demo - NOT production ready
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'before'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Before (Manual)</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'after'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>After (AI-Powered)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'before' ? (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Manual Process: 8-10 Minutes</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Documents List */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">34 Documents to Review:</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[
                      'Medical Records (15 pages)',
                      'Employment History',
                      'Educational Records',
                      'Financial Statements',
                      'Tax Returns (3 years)',
                      'Bank Statements',
                      'Insurance Records',
                      'Prescription History',
                      'Doctor Notes',
                      'Lab Results',
                      'Imaging Reports',
                      'Therapy Records',
                      'Disability Questionnaire',
                      'Activities of Daily Living',
                      'Work History Report',
                      'Vocational Assessment',
                      'Residual Functional Capacity',
                      'Medical Source Statements',
                      'Treatment Records',
                      'Medication Lists',
                      'Hospital Records',
                      'Emergency Room Visits',
                      'Specialist Consultations',
                      'Physical Therapy Records',
                      'Mental Health Records',
                      'Substance Abuse Treatment',
                      'Rehabilitation Records',
                      'Workers Compensation',
                      'VA Benefits Records',
                      'Private Insurance',
                      'Medicare/Medicaid',
                      'Social Security Earnings',
                      'Birth Certificate',
                      'Social Security Card'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Manual Review Process:</h4>
                  <div className="space-y-4">
                    {[
                      { step: '1', task: 'Open each document individually', time: '2-3 minutes' },
                      { step: '2', task: 'Read and analyze medical records', time: '3-4 minutes' },
                      { step: '3', task: 'Cross-reference employment history', time: '1-2 minutes' },
                      { step: '4', task: 'Verify financial information', time: '1-2 minutes' },
                      { step: '5', task: 'Check for inconsistencies', time: '1-2 minutes' },
                      { step: '6', task: 'Make approval decision', time: '30 seconds' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.task}</p>
                          <p className="text-sm text-red-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-red-100 rounded-lg">
                    <p className="text-red-800 font-semibold text-center">
                      Total Time: 8-10 minutes per application
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">AI-Powered Process: 30 Seconds</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Summary:</h4>
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Medical Condition:</p>
                          <p className="text-gray-700">Chronic back pain with degenerative disc disease, supported by MRI and doctor notes</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Work History:</p>
                          <p className="text-gray-700">Construction worker for 15 years, unable to perform heavy lifting since injury</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Financial Status:</p>
                          <p className="text-gray-700">No income since injury, behind on rent, minimal savings</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Recommendation:</p>
                          <p className="text-gray-700">APPROVE - Meets disability criteria with strong medical evidence</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Processing Steps:</h4>
                  <div className="space-y-4">
                    {[
                      { step: '1', task: 'AI reads all 34 documents', time: '15 seconds' },
                      { step: '2', task: 'Extracts key information', time: '5 seconds' },
                      { step: '3', task: 'Generates comprehensive summary', time: '5 seconds' },
                      { step: '4', task: 'Human reviews AI summary', time: '5 seconds' },
                      { step: '5', task: 'Makes approval decision', time: '5 seconds' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.task}</p>
                          <p className="text-sm text-green-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <p className="text-green-800 font-semibold text-center">
                      Total Time: 30 seconds per application
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Result: <span className="text-green-600">20x Improvement</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">8-10 min</div>
                <p className="text-gray-700">Manual Process</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">30 sec</div>
                <p className="text-gray-700">AI-Powered Process</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">
                From 7 months to 1-2 days: Helping 940,000+ Americans get their benefits faster
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
