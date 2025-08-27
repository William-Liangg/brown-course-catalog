import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Trash2, X, AlertTriangle, User } from 'lucide-react';
import { getSchedule, removeFromSchedule } from './utils/api';

interface ScheduledCourse {
  id: number;
  code: string;
  name: string;
  description: string;
  days: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  term: string;
  professor: string | null;
}

interface Props {
  onNavigate: (route: string) => void;
}

const SchedulePage = ({ onNavigate }: Props) => {
  const [schedule, setSchedule] = useState<ScheduledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Fall 2025');
  const [selectedCourse, setSelectedCourse] = useState<ScheduledCourse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{ course: ScheduledCourse; conflicts: ScheduledCourse[] } | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Time grid configuration - 15-minute increments internally
  const GRID_START_HOUR = 8; // 8:00 AM
  const GRID_END_HOUR = 20; // 8:00 PM
  const TIME_INCREMENT_MINUTES = 15; // 15-minute increments
  
  // Calculate total number of time slots
  const totalHours = GRID_END_HOUR - GRID_START_HOUR;
  const slotsPerHour = 60 / TIME_INCREMENT_MINUTES;
  const totalTimeSlots = totalHours * slotsPerHour;

  // Generate hourly labels for display (only show once per hour)
  const generateHourlyLabels = () => {
    const labels = [];
    for (let hour = GRID_START_HOUR; hour < GRID_END_HOUR; hour++) {
      const time = new Date(2000, 0, 1, hour, 0);
      const label = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      labels.push(label);
    }
    return labels;
  };

  const hourlyLabels = generateHourlyLabels();

  // Helper function to convert time string to grid row index (15-minute precision)
  const timeToGridIndex = (timeString: string | null): number => {
    if (!timeString) return -1;
    
    try {
      // Handle different time formats
      let time: Date;
      
      if (timeString.includes(':')) {
        // Handle "HH:MM:SS" format
        const [hours, minutes] = timeString.split(':').map(Number);
        time = new Date(2000, 0, 1, hours, minutes);
      } else {
        // Handle other formats
        time = new Date(`2000-01-01T${timeString}`);
      }
      
      const hour = time.getHours();
      const minute = time.getMinutes();
      
      // Calculate grid index
      const hourDiff = hour - GRID_START_HOUR;
      const minuteIndex = Math.floor(minute / TIME_INCREMENT_MINUTES);
      const gridIndex = hourDiff * slotsPerHour + minuteIndex + 1; // +1 because grid rows start at 1
      
      return Math.max(1, Math.min(gridIndex, totalTimeSlots));
    } catch (error) {
      console.error('Error converting time to grid index:', timeString, error);
      return -1;
    }
  };

  // Helper function to calculate grid row span for a course
  const calculateGridSpan = (startTime: string | null, endTime: string | null): number => {
    if (!startTime || !endTime) return 1;
    
    const startIndex = timeToGridIndex(startTime);
    const endIndex = timeToGridIndex(endTime);
    
    if (startIndex === -1 || endIndex === -1) return 1;
    
    const span = endIndex - startIndex;
    return Math.max(1, span);
  };

  // Helper function to check if a course day matches a grid day
  const dayMatches = (courseDays: string, gridDay: string): boolean => {
    const dayMap: { [key: string]: string[] } = {
      'Monday': ['M'],
      'Tuesday': ['T'],
      'Wednesday': ['W'],
      'Thursday': ['Th'],
      'Friday': ['F']
    };
    
    const gridDayAbbrevs = dayMap[gridDay];
    if (!gridDayAbbrevs) return false;
    
    return gridDayAbbrevs.some(abbrev => courseDays.includes(abbrev));
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

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is logged in
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('Please log in to view your schedule');
        setSchedule([]);
        setLoading(false);
        return;
      }
      
      const data = await getSchedule();
      setSchedule(data.schedule);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('No authentication token provided')) {
        setError('Please log in to view your schedule');
        setSchedule([]);
        // Redirect to login if not authenticated
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError(err.message || 'Failed to fetch schedule');
        setSchedule([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromScheduleHandler = async (courseId: number) => {
    try {
      await removeFromSchedule(courseId);
      
      // Refresh schedule
      fetchSchedule();
      // Close modal if the removed course was selected
      if (selectedCourse?.id === courseId) {
        setShowModal(false);
        setSelectedCourse(null);
      }
    } catch (err: any) {
      if (err.message.includes('401') || err.message.includes('No authentication token provided')) {
        setError('Please log in to manage your schedule');
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError(err.message || 'Failed to remove course');
      }
    }
  };

  const openCourseModal = (course: ScheduledCourse) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const showConflictDetails = (course: ScheduledCourse) => {
    const conflicts = schedule.filter(otherCourse => 
      otherCourse.id !== course.id &&
      otherCourse.days === course.days &&
      otherCourse.term === course.term &&
      course.end_time && course.start_time && otherCourse.start_time && otherCourse.end_time &&
      !(
        course.end_time <= otherCourse.start_time || 
        course.start_time >= otherCourse.end_time
      )
    );
    
    if (conflicts.length > 0) {
      setConflictInfo({ course, conflicts });
      setShowConflictModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const closeConflictModal = () => {
    setShowConflictModal(false);
    setConflictInfo(null);
  };

  // Clear schedule when user changes
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      fetchSchedule();
    } else {
      // Clear schedule if no user is logged in
      setSchedule([]);
      setLoading(false);
    }

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userId' || e.key === 'token') {
        const newUserId = localStorage.getItem('userId');
        if (newUserId) {
          fetchSchedule();
        } else {
          setSchedule([]);
          setSelectedCourse(null);
          setShowModal(false);
          setShowConflictModal(false);
          setConflictInfo(null);
          setError('');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to clear state when component unmounts or user changes
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      setSchedule([]);
      setSelectedCourse(null);
      setShowModal(false);
      setShowConflictModal(false);
      setConflictInfo(null);
      setError('');
    };
  }, []);

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

  const checkConflicts = (course: ScheduledCourse) => {
    const conflicts = schedule.filter(otherCourse => {
      if (otherCourse.id === course.id) return false;
      if (otherCourse.days !== course.days) return false;
      if (otherCourse.term !== course.term) return false;
      
      // Check for time overlap using string comparison (since times are in HH:MM:SS format)
      // Add null checks for time values
      if (!course.start_time || !course.end_time || !otherCourse.start_time || !otherCourse.end_time) {
        return false; // Can't determine overlap if times are null
      }
      
      // At this point, TypeScript knows all time values are non-null
      const courseStart = course.start_time;
      const courseEnd = course.end_time;
      const otherStart = otherCourse.start_time;
      const otherEnd = otherCourse.end_time;
      
      const hasOverlap = !(
        courseEnd <= otherStart || 
        courseStart >= otherEnd
      );
      
      return hasOverlap;
    });
    
    return conflicts.length > 0;
  };

  const filteredSchedule = schedule.filter(course => course.term === selectedTerm);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mb-4"></div>
          <div className="text-xl text-gray-600">Loading your schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <section className="relative py-8 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <Calendar className="w-12 h-12 text-amber-900 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              My Schedule
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              View and manage your course schedule. Click on any course to see details. Conflicts are highlighted for easy identification.
            </p>
          </div>

          {/* Term Selector */}
          <div className="mb-4">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2025">Spring 2025</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}
          

        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-xl text-gray-600 mb-2">No courses in your schedule</div>
              <div className="text-gray-500 mb-8">Add some courses to get started!</div>
              <button
                onClick={() => onNavigate('courses')}
                className="bg-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header Row - Separate from time grid */}
              <div className="grid grid-cols-6 gap-1" style={{ gridTemplateColumns: '100px repeat(5, 1fr)' }}>
                <div className="bg-amber-900 text-white p-4 font-semibold text-center">Time</div>
                {days.map(day => (
                  <div key={day} className="bg-amber-900 text-white p-4 font-semibold text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Schedule Body Grid - Separate from header */}
              <div 
                className="grid grid-cols-6 gap-0 border-t border-gray-300" 
                style={{ 
                  gridTemplateRows: `repeat(${totalTimeSlots}, minmax(30px, auto))`,
                  gridTemplateColumns: '100px repeat(5, 1fr)'
                }}
              >
                {/* Time Labels Column - Only show hourly labels */}
                {hourlyLabels.map((hourLabel, hourIndex) => {
                  const startRow = hourIndex * slotsPerHour + 1;
                  const endRow = (hourIndex + 1) * slotsPerHour;
                  
                  return (
                    <div
                      key={hourLabel}
                      className="bg-gray-50 p-2 text-sm text-gray-600 text-center border-r border-gray-200 flex items-center justify-center"
                      style={{ 
                        gridRow: `${startRow} / ${endRow + 1}`,
                        gridColumn: '1'
                      }}
                    >
                      {hourLabel}
                    </div>
                  );
                })}

                {/* Add thin white grid lines between hours */}
                {hourlyLabels.slice(0, -1).map((_, hourIndex) => {
                  const separatorRow = (hourIndex + 1) * slotsPerHour + 1;
                  
                  return (
                    <div
                      key={`separator-${hourIndex}`}
                      className="bg-white border-b border-white"
                      style={{ 
                        gridRow: `${separatorRow} / ${separatorRow + 1}`,
                        gridColumn: '1',
                        height: '5px'
                      }}
                    />
                  );
                })}

                {/* Course Grid Cells */}
                {days.map(day => {
                  // Find all courses for this day
                  const dayCourses = filteredSchedule.filter(course => course.days && dayMatches(course.days, day));
                  
                  return dayCourses.map(course => {
                    if (!course.start_time || !course.end_time) return null;
                    
                    const gridStart = timeToGridIndex(course.start_time);
                    const gridSpan = calculateGridSpan(course.start_time, course.end_time);
                    const hasConflict = checkConflicts(course);
                    
                    if (gridStart === -1) return null;
                    
                    return (
                      <div
                        key={`${day}-${course.id}`}
                        className="p-2"
                        style={{ 
                          gridRow: `${gridStart} / span ${gridSpan}`,
                          gridColumn: `${days.indexOf(day) + 2} / ${days.indexOf(day) + 3}` // Explicitly constrain to single column
                        }}
                      >
                        <div className={`bg-stone-100 border border-stone-200 rounded-lg p-3 h-full hover:bg-stone-200 transition-colors cursor-pointer ${hasConflict ? 'border-red-400 shadow-sm' : ''}`} onClick={() => openCourseModal(course)}>
                          <div className="text-sm font-semibold text-gray-900 mb-1">{course.code}</div>
                          <div className="text-xs text-gray-700 mb-2 line-clamp-2">{course.name}</div>
                          <div className="text-xs text-gray-600 mb-1">{formatDays(course.days)}</div>
                          <div className="text-xs text-gray-600 mb-1">{formatTime(course.start_time)} - {formatTime(course.end_time)}</div>
                          <div className="text-xs text-gray-600 mb-1">{course.location}</div>
                          <div className="text-xs text-gray-600">{course.professor || 'TBA'}</div>
                          {hasConflict && (
                            <div className="space-y-2 mb-2 mt-2">
                              <div className="flex items-center text-xs text-red-700 bg-red-100 px-2 py-1 rounded border border-red-300">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                <span className="font-semibold">Time Conflict</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showConflictDetails(course);
                                }}
                                className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-300 transition-colors"
                              >
                                View Conflicts
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Course Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  onClick={closeModal}
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
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-amber-900 mr-3" />
                  <span className="font-medium text-lg">{formatDays(selectedCourse.days)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 text-amber-900 mr-3" />
                  <span className="font-medium text-lg">
                    {formatTime(selectedCourse.start_time)} - {formatTime(selectedCourse.end_time)}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-amber-900 mr-3" />
                  <span className="font-medium text-lg">{selectedCourse.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 text-amber-900 mr-3" />
                  <span className="font-medium text-lg">{selectedCourse.professor || 'TBA'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-amber-900 mr-3" />
                  <span className="font-medium text-lg">{selectedCourse.term}</span>
                </div>
              </div>

              {/* Conflict Warning */}
              {checkConflicts(selectedCourse) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                  <div className="flex items-center text-red-700 mb-3">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-lg">Schedule Time Conflict</span>
                  </div>
                  <p className="text-red-600 mb-3">
                    This course conflicts with other courses in your schedule for {selectedCourse.term}.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-200">
                    <div className="font-semibold mb-2 text-red-800 text-sm">Conflicting courses:</div>
                    <ul className="space-y-2">
                      {schedule
                        .filter(otherCourse => 
                          otherCourse.id !== selectedCourse.id &&
                          otherCourse.days === selectedCourse.days &&
                          otherCourse.term === selectedCourse.term &&
                          otherCourse.start_time && otherCourse.end_time &&
                          selectedCourse.start_time && selectedCourse.end_time &&
                          (
                            (otherCourse.start_time <= selectedCourse.start_time && otherCourse.end_time > selectedCourse.start_time) ||
                            (otherCourse.start_time < selectedCourse.end_time && otherCourse.end_time >= selectedCourse.end_time) ||
                            (otherCourse.start_time >= selectedCourse.start_time && otherCourse.end_time <= selectedCourse.end_time)
                          )
                        )
                        .map((conflict, index) => (
                          <li key={index} className="text-red-700 border-l-2 border-red-400 pl-3 py-1">
                            <div className="font-medium text-sm">{conflict.code} - {conflict.name}</div>
                                                    <div className="text-red-600 text-xs">
                          {formatDays(conflict.days)} • {formatTime(conflict.start_time)} - {formatTime(conflict.end_time)} • {conflict.professor || 'TBA'}
                        </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => removeFromScheduleHandler(selectedCourse.id)}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove from Schedule
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Details Modal */}
      {showConflictModal && conflictInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                    ⚠️ Time Conflict
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Schedule Conflict Detected
                  </h2>
                </div>
                <button
                  onClick={closeConflictModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Conflict Details */}
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="font-semibold text-red-800 mb-2">Course with Conflict:</div>
                  <div className="text-lg font-medium text-gray-900 mb-1">
                    {conflictInfo.course.code} - {conflictInfo.course.name}
                  </div>
                  <div className="text-red-700">
                    {formatDays(conflictInfo.course.days)} • {formatTime(conflictInfo.course.start_time)} - {formatTime(conflictInfo.course.end_time)}
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="font-semibold text-red-800 mb-3">Conflicting Courses:</div>
                  <div className="space-y-3">
                    {conflictInfo.conflicts.map((conflict, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r-lg">
                        <div className="font-semibold text-gray-900">{conflict.code} - {conflict.name}</div>
                        <div className="text-red-700 text-sm mt-1">
                          <span className="font-medium">Days:</span> {formatDays(conflict.days)} • 
                          <span className="font-medium ml-2">Time:</span> {formatTime(conflict.start_time)} - {formatTime(conflict.end_time)} • 
                          <span className="font-medium ml-2">Professor:</span> {conflict.professor || 'TBA'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => removeFromScheduleHandler(conflictInfo.course.id)}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Conflicting Course
                </button>
                <button
                  onClick={closeConflictModal}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;