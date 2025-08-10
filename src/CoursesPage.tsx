import { useState, useEffect } from 'react';

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Catalog</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading courses...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {course.code}
                </h3>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  {course.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {course.description}
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium w-16">Days:</span>
                  <span>{course.days}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">Time:</span>
                  <span>
                    {formatTime(course.start_time)} - {formatTime(course.end_time)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">Location:</span>
                  <span>{course.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && !error && (
        <div className="text-center py-8">
          <div className="text-gray-600">No courses found.</div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 