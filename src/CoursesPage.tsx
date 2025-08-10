import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, MapPin, Calendar, Plus, AlertTriangle, CheckCircle, User } from "lucide-react";

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  days: string;
  start_time: string;
  end_time: string;
  location: string;
  professor: string;
}

interface Props {
  onNavigate: (route: string) => void;
  conflictError: {
    message: string;
    conflicts: Array<{
      code: string;
      name: string;
      days: string;
      start_time: string;
      end_time: string;
    }>;
  } | null;
  setConflictError: React.Dispatch<React.SetStateAction<{
    message: string;
    conflicts: Array<{
      code: string;
      name: string;
      days: string;
      start_time: string;
      end_time: string;
    }>;
  } | null>>;
  isLoggedIn: boolean;
}

const CoursesPage = ({ onNavigate, conflictError, setConflictError, isLoggedIn }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingCourse, setAddingCourse] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState('Fall 2025');
  const [addError, setAddError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCourses = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const url = searchQuery 
        ? `/api/courses?search=${encodeURIComponent(searchQuery)}`
        : '/api/courses';
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch courses');
      setCourses(data.courses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToSchedule = async (courseId: number) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setAddError('You must sign in to add courses to your schedule');
      return;
    }

    try {
      console.log('Adding course to schedule:', courseId, 'for term:', selectedTerm);
      setAddingCourse(courseId);
      setAddError('');
      setConflictError(null);
      
      // For demo purposes, make request without authentication
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId,
          term: selectedTerm
        })
      });

      const data = await res.json();
      console.log('Response status:', res.status);
      console.log('Response data:', data);
      
      if (!res.ok) {
        if (res.status === 400 && data.error === 'Time conflict detected') {
          console.log('Setting conflict error:', data);
          setConflictError({
            message: 'This course cannot be added because it conflicts with courses already in your schedule',
            conflicts: data.conflicts || []
          });
          return;
        }
        throw new Error(data.error || 'Failed to add course to schedule');
      }

      // Show success message
      setSuccessMessage('Course added to schedule successfully!');
      setShowSuccess(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error in addToSchedule:', err);
      setAddError(err.message);
    } finally {
      setAddingCourse(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Debug: Log when conflictError changes
  useEffect(() => {
    console.log('conflictError state changed:', conflictError);
  }, [conflictError]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(search);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to convert abbreviated days to readable format
  const formatDays = (days: string): string => {
    const dayMap: { [key: string]: string } = {
      'M': 'Mon',
      'T': 'Tues', 
      'W': 'Wed',
      'R': 'Thur',
      'F': 'Fri'
    };
    
    return days.split('').map(day => dayMap[day] || day).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <section className="relative py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <BookOpen className="w-16 h-16 text-amber-900 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Course Catalog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore Brown University's comprehensive course offerings. Find the perfect classes to advance your academic journey.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-colors shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Error Message Modal */}
          {error && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Error</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-center">
                    {error}
                  </p>
                  
                  <button
                    onClick={() => setError('')}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Error Message Modal */}
          {addError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Error Adding Course</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-center">
                    {addError}
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAddError('')}
                      className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    {addError === 'You must sign in to add courses to your schedule' && (
                      <button
                        onClick={() => {
                          setAddError('');
                          onNavigate('login');
                        }}
                        className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
                      >
                        Go to Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message Modal */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Success!</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-center">
                    {successMessage}
                  </p>
                  
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Conflict Error Modal */}
          {conflictError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Schedule Time Conflict</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    This course cannot be added because it conflicts with courses already in your schedule for {selectedTerm}.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Conflicting Course:
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{conflictError.conflicts[0].code} - {conflictError.conflicts[0].name}</div>
                      <div className="text-gray-600">
                        {formatDays(conflictError.conflicts[0].days)} • {formatTime(conflictError.conflicts[0].start_time)} - {formatTime(conflictError.conflicts[0].end_time)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setConflictError(null)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                  >
                    OK, I Understand
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mb-4"></div>
              <div className="text-xl text-gray-600">Loading courses...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100 hover:border-amber-200 flex flex-col">
                  <div className="flex-1">
                    <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                      {course.code}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {course.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 text-amber-900 mr-3" />
                        <span className="font-medium">{formatDays(course.days)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 text-amber-900 mr-3" />
                        <span className="font-medium">
                          {formatTime(course.start_time)} - {formatTime(course.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <User className="w-5 h-5 text-amber-900 mr-3" />
                        <span className="font-medium">{course.professor || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 text-amber-900 mr-3" />
                        <span className="font-medium">{course.location || 'TBA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="mb-4">
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      >
                        <option value="Fall 2025">Fall 2025</option>
                        <option value="Spring 2025">Spring 2025</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => addToSchedule(course.id)}
                      disabled={addingCourse === course.id}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                        isLoggedIn 
                          ? 'bg-amber-900 text-white hover:bg-amber-800' 
                          : 'bg-gray-400 text-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {addingCourse === course.id ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : !isLoggedIn ? (
                        <>
                          <div className="w-4 h-4 mr-2">🔒</div>
                          Sign in to Add
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Schedule
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && !error && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-xl text-gray-600 mb-2">No courses found</div>
              <div className="text-gray-500">Try adjusting your search criteria</div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Planning Your Schedule?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Use our schedule planner to organize your courses and avoid conflicts.
          </p>
          <button
            onClick={() => onNavigate("schedule")}
            className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {isLoggedIn ? "Plan My Schedule" : "Sign in to Plan Schedule"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage; 