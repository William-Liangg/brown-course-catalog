import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, MapPin, Calendar, Plus, AlertTriangle, CheckCircle, User, X, ChevronDown } from "lucide-react";
import { getCourses, addToSchedule } from './utils/api';

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  days: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  professor: string | null;
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTbaPopup, setShowTbaPopup] = useState(false);
  const [tbaPopupMessage, setTbaPopupMessage] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('AFRI');
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  const [majorSearchTerm, setMajorSearchTerm] = useState<string>('');

  const fetchCourses = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const data = await getCourses(searchQuery);
      setCourses(data.courses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Extract majors from course codes
  const extractMajors = (courses: Course[]): string[] => {
    const majorSet = new Set<string>();
    courses.forEach(course => {
      const match = course.code.match(/^([A-Z]+)/);
      if (match) {
        majorSet.add(match[1]);
      }
    });
    return Array.from(majorSet).sort();
  };

  // Get majors from current courses
  const allMajors = extractMajors(courses);
  
  // Filter majors based on search term
  const filteredMajors = allMajors.filter(major => 
    major.toLowerCase().includes(majorSearchTerm.toLowerCase())
  );

  // Filter courses by selected major
  const filteredCourses = courses.filter(course => {
    if (selectedMajor === 'All Majors') return true;
    
    const courseMajor = course.code.match(/^([A-Z]+)/)?.[1];
    return courseMajor === selectedMajor;
  });

  const addToScheduleHandler = async (courseId: number) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setAddError('You must sign in to add courses to your schedule');
      return;
    }

    // Find the course to check for TBA/TBD attributes
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      setAddError('Course not found');
      return;
    }

    // Check for TBA/TBD attributes
    const tbaAttributes = [];
    if (!course.days || course.days === 'TBA' || course.days === 'TBD') {
      tbaAttributes.push('Days');
    }
    if (!course.start_time || course.start_time === 'TBA' || course.start_time === 'TBD') {
      tbaAttributes.push('Start Time');
    }
    if (!course.end_time || course.end_time === 'TBA' || course.end_time === 'TBD') {
      tbaAttributes.push('End Time');
    }
    if (!course.location || course.location === 'TBA' || course.location === 'TBD') {
      tbaAttributes.push('Location');
    }
    if (!course.professor || course.professor === 'TBA' || course.professor === 'TBD') {
      tbaAttributes.push('Professor');
    }

    // If any TBA/TBD attributes found, show popup and prevent adding
    if (tbaAttributes.length > 0) {
      const message = `Cannot add course to schedule. The following information is not yet available: ${tbaAttributes.join(', ')}.`;
      setTbaPopupMessage(message);
      setShowTbaPopup(true);
      return;
    }

    try {

      setAddingCourse(courseId);
      setAddError('');
      setConflictError(null);
      
      const data = await addToSchedule(courseId, selectedTerm);

      
      setShowSuccess(true);
      setSuccessMessage('Course added to schedule successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err: any) {

      
      if (err.message.includes('Time conflict detected')) {
        // Check if conflicts data is available in the error response
        if (err.conflicts && Array.isArray(err.conflicts)) {
          setConflictError({
            message: 'Time conflict detected',
            conflicts: err.conflicts
          });
        } else {
          setAddError('Time conflict detected with existing courses');
        }
      } else if (err.message.includes('401') || err.message.includes('No authentication token provided')) {
        setAddError('Please log in to add courses to your schedule');
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setAddError(err.message || 'Failed to add course to schedule');
      }
    } finally {
      setAddingCourse(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.major-dropdown')) {
        setShowMajorDropdown(false);
        setMajorSearchTerm(''); // Clear search when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(search);
  };

  // Real-time search as user types with debouncing
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      fetchCourses(value).finally(() => setIsSearching(false));
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const formatTime = (time: string | null) => {
    if (!time) return 'TBA';
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'TBA';
    }
  };

  // Helper function to convert abbreviated days to readable format
  const formatDays = (days: string | null): string => {
    if (!days) return 'TBA';
    
    // Handle day combinations first (before single letters)
    let result = days;
    
    // Replace common day combinations
    result = result.replace(/TTh/g, 'Tues, Thur');
    result = result.replace(/MWF/g, 'Mon, Wed, Fri');
    result = result.replace(/MW/g, 'Mon, Wed');
    result = result.replace(/WF/g, 'Wed, Fri');
    result = result.replace(/MT/g, 'Mon, Tues');
    result = result.replace(/TF/g, 'Tues, Fri');
    
    // Then handle remaining single days (only if not already processed)
    result = result.replace(/\bM\b/g, 'Mon');
    result = result.replace(/\bT\b/g, 'Tues');
    result = result.replace(/\bW\b/g, 'Wed');
    result = result.replace(/\bTh\b/g, 'Thur');
    result = result.replace(/\bF\b/g, 'Fri');
    
    return result;
  };

  // Helper function to check if a course has TBA/TBD attributes
  const hasTbaAttributes = (course: Course): boolean => {
    return !course.days || course.days === 'TBA' || course.days === 'TBD' ||
           !course.start_time || course.start_time === 'TBA' || course.start_time === 'TBD' ||
           !course.end_time || course.end_time === 'TBA' || course.end_time === 'TBD' ||
           !course.location || course.location === 'TBA' || course.location === 'TBD' ||
           !course.professor || course.professor === 'TBA' || course.professor === 'TBD';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <section className="relative py-8 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <BookOpen className="w-12 h-12 text-amber-900 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Course Catalog
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Explore Brown University's comprehensive course offerings. Find the perfect classes to advance your academic journey.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by course code (e.g., 1650), major (e.g., CSCI, APMA), or course name..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                  </div>
                )}
              </div>
              
              {/* Major Filter Dropdown */}
              <div className="relative major-dropdown">
                <button
                  type="button"
                  onClick={() => setShowMajorDropdown(!showMajorDropdown)}
                  className="flex items-center justify-between w-48 px-4 py-4 border border-gray-300 rounded-lg bg-white text-left text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent hover:bg-gray-50 transition-colors"
                >
                  <span className="truncate">{selectedMajor}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showMajorDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showMajorDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-10 max-h-80 overflow-hidden">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                      <input
                        type="text"
                        placeholder="Search majors..."
                        value={majorSearchTerm}
                        onChange={(e) => setMajorSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <div
                        onClick={() => {
                          setSelectedMajor('All Majors');
                          setShowMajorDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 font-semibold text-amber-900 transition-colors"
                      >
                        All Majors (85)
                      </div>
                      {filteredMajors.map((major) => (
                        <div
                          key={major}
                          onClick={() => {
                            setSelectedMajor(major);
                            setShowMajorDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <span className="font-medium">{major}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    {addError === 'You must sign in to add courses to your schedule' ? (
                      <>
                        <div className="w-6 h-6 text-amber-600 mr-3">🔒</div>
                        <h3 className="text-xl font-semibold text-gray-900">Authentication Required</h3>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">Error Adding Course</h3>
                      </>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-center">
                    {addError === 'You must sign in to add courses to your schedule' 
                      ? 'You must sign in to save and manage your schedule.'
                      : addError
                    }
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
                      {conflictError.conflicts.length === 1 ? 'Conflicting Course:' : 'Conflicting Courses:'}
                    </div>
                    <div className="space-y-3">
                      {conflictError.conflicts.map((conflict, index) => (
                        <div key={index} className="text-sm text-gray-700 border-l-2 border-red-300 pl-3">
                          <div className="font-medium">{conflict.code} - {conflict.name}</div>
                          <div className="text-gray-600">
                            {formatDays(conflict.days)} • {formatTime(conflict.start_time)} - {formatTime(conflict.end_time)}
                          </div>
                        </div>
                      ))}
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

          {/* TBA/TBD Error Modal */}
          {showTbaPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Course Information Not Available</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-center">
                    {tbaPopupMessage}
                  </p>
                  
                  <button
                    onClick={() => setShowTbaPopup(false)}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
                  >
                    OK, I Understand
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Count */}
          {!loading && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {selectedMajor === 'All Majors' 
                  ? `Showing all ${filteredCourses.length} courses`
                  : `Showing ${filteredCourses.length} ${selectedMajor} courses`
                }
              </p>
            </div>
          )}

          {/* Search Results Counter */}
          {!loading && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {search ? `Found ${filteredCourses.length} courses matching "${search}"` : `Showing ${filteredCourses.length} courses`}
                {selectedMajor !== 'All Majors' && ` in ${selectedMajor}`}
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mb-4"></div>
              <div className="text-xl text-gray-600">Loading courses...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => openCourseModal(course)}
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out border cursor-pointer ${
                    hasTbaAttributes(course) 
                      ? 'border-orange-200 hover:border-orange-300' 
                      : 'border-gray-100 hover:border-amber-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      {course.code}
                    </div>
                    {hasTbaAttributes(course) && (
                      <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        TBA
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {course.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 text-amber-900 mr-2" />
                      <span className="font-medium text-sm">{formatDays(course.days)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 text-amber-900 mr-2" />
                      <span className="font-medium text-sm">
                        {formatTime(course.start_time)} - {formatTime(course.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 text-amber-900 mr-2" />
                      <span className="font-medium text-sm">{course.location || 'TBA'}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <User className="w-4 h-4 text-amber-900 mr-2" />
                      <span className="font-medium text-sm">{course.professor || 'TBA'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCourses.length === 0 && !error && (
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

      {/* Course Details Modal */}
      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                    {selectedCourse.code}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCourse.name}
                  </h2>
                </div>
                <button
                  onClick={closeCourseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Course Description */}
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 text-amber-900 mr-3" />
                    <div>
                      <span className="font-semibold">Meeting Days:</span>
                      <span className="ml-2">{formatDays(selectedCourse.days)}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 text-amber-900 mr-3" />
                    <div>
                      <span className="font-semibold">Time:</span>
                      <span className="ml-2">
                        {formatTime(selectedCourse.start_time)} - {formatTime(selectedCourse.end_time)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 text-amber-900 mr-3" />
                    <div>
                      <span className="font-semibold">Professor:</span>
                      <span className="ml-2">{selectedCourse.professor || 'TBA'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 text-amber-900 mr-3" />
                    <div>
                      <span className="font-semibold">Location:</span>
                      <span className="ml-2">{selectedCourse.location || 'TBA'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TBA/TBD Warning */}
              {hasTbaAttributes(selectedCourse) && (
                <div className="border-t border-gray-200 pt-6 mb-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-semibold text-orange-800">Course Information Not Available</span>
                    </div>
                    <p className="text-orange-700 text-sm">
                      This course cannot be added to your schedule because some information (days, times, location, or professor) is not yet available.
                    </p>
                  </div>
                </div>
              )}

              {/* Add to Schedule Section */}
              <div className="border-t border-gray-200 pt-6">
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
                  onClick={() => {
                    addToScheduleHandler(selectedCourse.id);
                    closeCourseModal();
                  }}
                  disabled={addingCourse === selectedCourse.id || hasTbaAttributes(selectedCourse)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                    !isLoggedIn 
                      ? 'bg-gray-400 text-gray-600 hover:bg-gray-500'
                      : hasTbaAttributes(selectedCourse)
                      ? 'bg-orange-400 text-white cursor-not-allowed'
                      : 'bg-amber-900 text-white hover:bg-amber-800'
                  }`}
                >
                  {addingCourse === selectedCourse.id ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : !isLoggedIn ? (
                    <>
                      <div className="w-4 h-4 mr-2">🔒</div>
                      Sign in to Add
                    </>
                  ) : hasTbaAttributes(selectedCourse) ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Information Not Available
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
          </div>
        </div>
      )}


    </div>
  );
};

export default CoursesPage; 