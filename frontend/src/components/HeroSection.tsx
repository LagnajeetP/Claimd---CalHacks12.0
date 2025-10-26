import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Zap, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            From{' '}
            <span className="text-red-600">7 months</span>{' '}
            to{' '}
            <span className="text-green-600">1-2 days</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
            Get your Social Security benefits approved{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              20x faster
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Instead of humans reading through 34 different documents and fields, 
            we give SSA workers a short AI summary that takes 30 seconds instead of 8-10 minutes.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-md">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">940,000+</span>
              <span className="text-gray-600">Americans affected</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-md">
              <Clock className="w-6 h-6 text-red-600" />
              <span className="text-lg font-semibold text-gray-900">7 months</span>
              <span className="text-gray-600">average wait time</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-md">
              <Zap className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">20x</span>
              <span className="text-gray-600">faster processing</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/user"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>See Demo</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Human-in-the-Loop</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
