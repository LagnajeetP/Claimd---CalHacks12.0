import { Zap, Clock, CheckCircle, ArrowRight, Brain, Shield, Users } from 'lucide-react';

export default function SolutionSection() {
  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Solution: <span className="text-green-600">20x Faster</span> Processing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Instead of humans reading through 34 different documents and fields, 
            we give SSA workers a short AI summary that takes 30 seconds instead of 8-10 minutes.
          </p>
        </div>

        {/* Main Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Before */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center mb-6">
              <Clock className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-900">Before: Manual Process</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-3">❌</span>
                <span className="text-gray-700">8-10 minutes per application</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3">❌</span>
                <span className="text-gray-700">Manual review of 34 documents</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3">❌</span>
                <span className="text-gray-700">High error rates</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3">❌</span>
                <span className="text-gray-700">7-month average wait time</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 font-semibold text-center">
                7 months = 210 days of waiting
              </p>
            </div>
          </div>

          {/* After */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-900">After: AI-Powered Process</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">30 seconds per application</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">AI summary of all documents</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Reduced error rates</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">1-2 day processing time</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold text-center">
                1-2 days = 20x faster processing
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced AI reads and analyzes all 34 documents instantly, 
              providing comprehensive summaries for human review.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Human-in-the-Loop</h3>
            <p className="text-gray-600">
              Every AI summary is reviewed by qualified SSA workers, 
              ensuring accuracy while dramatically reducing processing time.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Better Outcomes</h3>
            <p className="text-gray-600">
              Faster processing means Americans get their benefits sooner, 
              reducing financial hardship and improving quality of life.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              The Impact: Real Numbers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">20x</div>
                <p className="text-gray-700 font-semibold">Faster Processing</p>
                <p className="text-sm text-gray-600">From 8-10 minutes to 30 seconds</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1-2</div>
                <p className="text-gray-700 font-semibold">Days Instead of Months</p>
                <p className="text-sm text-gray-600">From 7 months to 1-2 days</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">940k+</div>
                <p className="text-gray-700 font-semibold">Americans Helped</p>
                <p className="text-sm text-gray-600">Currently waiting for benefits</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">30s</div>
                <p className="text-gray-700 font-semibold">Per Application</p>
                <p className="text-sm text-gray-600">AI summary generation time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Social Security Processing?
            </h3>
            <p className="text-gray-600 mb-6">
              Join us in helping 940,000+ Americans get their benefits faster. 
              This is a demo - not production ready, but the potential is clear.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto">
              <span>See How It Works</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
