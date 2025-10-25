import { Clock, Users, FileText, AlertTriangle, DollarSign, Home } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="py-20 bg-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Problem: <span className="text-red-600">7 Months</span> of Waiting
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every day, thousands of Americans face the reality of waiting months for their Social Security benefits 
            while struggling to make ends meet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* 940k Americans */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">940,000 Americans</h3>
            </div>
            <p className="text-gray-600">
              Currently waiting for their Social Security disability benefits to be approved, 
              many unable to pay rent or basic necessities.
            </p>
          </div>

          {/* 7 Month Wait */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <Clock className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">7 Month Average</h3>
            </div>
            <p className="text-gray-600">
              The average wait time for Social Security disability benefits approval, 
              during which applicants face financial hardship and uncertainty.
            </p>
          </div>

          {/* Manual Processing */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-yellow-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">34 Documents</h3>
            </div>
            <p className="text-gray-600">
              SSA workers must manually review 34 different documents and fields for each application, 
              taking 8-10 minutes per case.
            </p>
          </div>
        </div>

        {/* Emotional Impact */}
        <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Real Stories, Real Pain
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Can't Pay Rent</h4>
                <p className="text-gray-600">
                  "I'm behind on rent and utilities. Every day I wait is another day of stress."
                </p>
              </div>
              <div className="text-center">
                <Home className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Facing Eviction</h4>
                <p className="text-gray-600">
                  "My landlord is threatening eviction. I need these benefits to survive."
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Months of Uncertainty</h4>
                <p className="text-gray-600">
                  "Seven months of waiting, not knowing if I'll be approved or denied."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Process Pain Points */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            The Current Process is Broken
          </h3>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">For Applicants:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Submit extensive documentation
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Wait 7 months on average
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Face financial hardship during wait
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    No visibility into progress
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">For SSA Workers:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Manually review 34 documents per case
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Spend 8-10 minutes per application
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    High error rates from manual processing
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Overwhelming backlog of cases
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
