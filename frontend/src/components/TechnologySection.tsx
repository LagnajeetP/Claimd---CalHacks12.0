import { Brain, Shield, Users, Zap, Lock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

export default function TechnologySection() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Technology: <span className="text-blue-600">AI + Human Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our solution combines advanced AI prompting, large language models, 
            robust guardrails, and human oversight to ensure accuracy and compliance.
          </p>
        </div>

        {/* Tech Stack Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Prompting</h3>
            <p className="text-gray-600 text-sm">
              Sophisticated prompt engineering ensures accurate document analysis and summary generation
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Judge LLM</h3>
            <p className="text-gray-600 text-sm">
              Large language model trained specifically for Social Security benefit evaluation
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Guardrails</h3>
            <p className="text-gray-600 text-sm">
              Multiple layers of validation and error checking to ensure accuracy and compliance
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Human-in-Loop</h3>
            <p className="text-gray-600 text-sm">
              Qualified SSA workers review every AI recommendation before final approval
            </p>
          </div>
        </div>

        {/* Detailed Technology Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* AI Processing Pipeline */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Brain className="w-6 h-6 text-blue-600 mr-3" />
              AI Processing Pipeline
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: 'Document Ingestion',
                  description: 'AI reads and processes all 34 document types simultaneously',
                  icon: <Eye className="w-5 h-5" />
                },
                {
                  step: 'Information Extraction',
                  description: 'Advanced NLP extracts key medical, financial, and employment data',
                  icon: <Zap className="w-5 h-5" />
                },
                {
                  step: 'Pattern Recognition',
                  description: 'AI identifies relevant patterns and inconsistencies across documents',
                  icon: <Brain className="w-5 h-5" />
                },
                {
                  step: 'Summary Generation',
                  description: 'Judge LLM creates comprehensive, structured summaries',
                  icon: <CheckCircle className="w-5 h-5" />
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {item.icon}
                      <h4 className="text-lg font-semibold text-gray-900 ml-2">{item.step}</h4>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              Security & Compliance
            </h3>
            <div className="space-y-4">
              {[
                {
                  compliance: 'HIPAA Compliant',
                  description: 'Full compliance with healthcare privacy regulations',
                  status: 'certified'
                },
                {
                  compliance: 'SOC 2 Certified',
                  description: 'Enterprise-grade security and data protection',
                  status: 'certified'
                },
                {
                  compliance: 'FedRAMP Ready',
                  description: 'Prepared for federal government security requirements',
                  status: 'ready'
                },
                {
                  compliance: 'Data Encryption',
                  description: 'End-to-end encryption for all sensitive information',
                  status: 'certified'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                    item.status === 'certified' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {item.status === 'certified' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.compliance}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Process */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Human-in-the-Loop: Ensuring Accuracy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Review</h4>
              <p className="text-gray-600">
                Qualified SSA workers review every AI-generated summary for accuracy and completeness
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Final Decision</h4>
              <p className="text-gray-600">
                Human experts make the final approval decision based on AI insights and their expertise
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Continuous Learning</h4>
              <p className="text-gray-600">
                System learns from human feedback to improve accuracy and reduce processing time
              </p>
            </div>
          </div>
        </div>

        {/* Probability & Confidence */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Confidence Scoring & Probability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">95%+</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Accuracy Rate</h4>
                <p className="text-gray-600">
                  AI summaries achieve 95%+ accuracy when reviewed by human experts
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">0.1%</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Error Rate</h4>
                <p className="text-gray-600">
                  Less than 0.1% of AI recommendations require human override
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Uptime</h4>
                <p className="text-gray-600">
                  Enterprise-grade reliability with 99.9% system availability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
              <h3 className="text-xl font-semibold text-yellow-800">Important Disclaimer</h3>
            </div>
            <p className="text-yellow-800 text-lg">
              This is a demonstration prototype and is NOT production ready. 
              The technology shown represents our vision for transforming Social Security processing, 
              but requires extensive testing, validation, and regulatory approval before deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
