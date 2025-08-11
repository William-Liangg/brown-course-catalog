import { GraduationCap, Search, Calendar, Users } from "lucide-react"

interface HomePageProps {
  onNavigate: (route: string) => void
  isLoggedIn: boolean
  userFirstName?: string
}

const HomePage = ({ onNavigate, isLoggedIn, userFirstName }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <GraduationCap className="w-16 h-16 text-amber-900 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {isLoggedIn && userFirstName ? (
                <>
                  Welcome,
                  <span className="text-amber-900 block">{userFirstName}!</span>
                </>
              ) : (
                <>
                  Find Your Perfect
                  <span className="text-amber-900 block">Schedule @ Brown</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Optimize your academic journey with our AI-assisted comprehensive course catalog for students at Brown. Make informed
              decisions about your education.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onNavigate("courses")}
              className="bg-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-colors shadow-lg"
            >
              Browse Courses
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => onNavigate("signup")}
                className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-amber-900 hover:bg-amber-50 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">2,000+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">40+</div>
              <div className="text-gray-600">Academic Departments</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">80+</div>
              <div className="text-gray-600">Concentrations Offered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Plan Your Academic Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and information you need to make informed course selections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Find courses by department, professor, keywords, or requirements with our advanced search filters.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule Planning</h3>
              <p className="text-gray-600">
                Build and visualize your course schedule to avoid conflicts and optimize your time.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professor Insights</h3>
              <p className="text-gray-600">Learn about instructors, their teaching styles, and course expectations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who use our platform to discover amazing courses and plan their academic
            success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("courses")}
              className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Browsing
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => onNavigate("signup")}
                className="bg-transparent text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-amber-900 transition-colors"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">BrunoTrack</h3>
              <p className="text-gray-400">Your comprehensive guide to Brown University's academic offerings.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate("courses")}
                  className="block text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Browse Courses
                </button>
                <button
                  onClick={() => onNavigate("schedule")}
                  className="block text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  My Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage 