export default function MinimalProblem() {
  const problems = [
    {
      number: '01',
      title: '7 Month Wait',
      description: 'Average processing time leaves applicants in financial limbo',
      stat: '940,000 people currently waiting'
    },
    {
      number: '02',
      title: '34 Documents',
      description: 'Manual review of 34 documents per application takes 8-10 minutes',
      stat: 'SSA workers overwhelmed'
    },
    {
      number: '03',
      title: 'Human Error',
      description: 'Manual processing leads to delays and inconsistencies',
      stat: 'Higher error rates'
    }
  ];

  return (
    <section className="min-h-screen bg-white text-gray-900 flex items-center justify-center py-32 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-32">
          <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">The Problem</div>
          <h2 className="text-5xl md:text-7xl font-thin mb-6 text-gray-900">
            940,000 Americans are waiting<span className="text-red-600">.</span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Social Security disability benefits take an average of 7 months to process. 
            Every day counts when you can't pay rent.
          </p>
        </div>

        <div className="space-y-24">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="border-t border-gray-300 pt-12 flex flex-col md:flex-row gap-8 md:justify-between items-start"
            >
              <div className="flex-1">
                <div className="text-6xl font-thin text-gray-300 mb-4">{problem.number}</div>
                <h3 className="text-3xl md:text-5xl font-light mb-4 text-gray-900">{problem.title}</h3>
                <p className="text-xl text-gray-600 font-light mb-4">{problem.description}</p>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{problem.stat}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Final emphasis */}
        <div className="mt-32 text-center">
          <div className="text-8xl md:text-9xl font-thin mb-8 text-gray-200">7</div>
          <div className="text-xl text-gray-600">months of uncertainty</div>
        </div>
      </div>
    </section>
  );
}

