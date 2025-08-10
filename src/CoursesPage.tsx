import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, MapPin, Calendar, Plus, AlertTriangle } from "lucide-react";

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  days: string;
  start_time: string;
  end_time: string;
  location: string;
}

interface Props {
  onNavigate: (route: string) => void;
}

const CoursesPage = ({ onNavigate }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingCourse, setAddingCourse] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState('Fall 2024');
  const [addError, setAddError] = useState('');

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
    try {
      setAddingCourse(courseId);
      setAddError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        onNavigate('login');
        return;
      }

      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          term: selectedTerm
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          onNavigate('login');
          return;
        }
        throw new Error(data.error || 'Failed to add course to schedule');
      }

      // Show success message
      alert('Course added to schedule successfully!');
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddingCourse(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
          {error && (
            <div className="mb-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl max-w-2xl mx-auto text-center">
              <div className="text-lg font-semibold mb-2">Error</div>
              {error}
            </div>
          )}

          {addError && (
            <div className="mb-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl max-w-2xl mx-auto text-center">
              <div className="text-lg font-semibold mb-2">Error Adding Course</div>
              {addError}
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
                <div key={course.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100 hover:border-amber-200">
                  <div className="mb-6">
                    <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                      {course.code}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 text-amber-900 mr-3" />
                      <span className="font-medium">{course.days}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 text-amber-900 mr-3" />
                      <span className="font-medium">
                        {formatTime(course.start_time)} - {formatTime(course.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 text-amber-900 mr-3" />
                      <span className="font-medium">{course.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="mb-4">
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      >
                        <option value="Fall 2024">Fall 2024</option>
                        <option value="Spring 2025">Spring 2025</option>
                        <option value="Summer 2025">Summer 2025</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => addToSchedule(course.id)}
                      disabled={addingCourse === course.id}
                      className="w-full bg-amber-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {addingCourse === course.id ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
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
            Plan My Schedule
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage; 