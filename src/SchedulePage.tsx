import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Trash2, X, AlertTriangle, User } from 'lucide-react';

interface ScheduledCourse {
  id: number;
  code: string;
  name: string;
  description: string;
  days: string;
  start_time: string;
  end_time: string;
  location: string;
  term: string;
  professor: string;
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
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  // Helper function to check if a course day matches a grid day
  const dayMatches = (courseDays: string, gridDay: string): boolean => {
    const dayMap: { [key: string]: string[] } = {
      'Monday': ['M'],
      'Tuesday': ['T'],
      'Wednesday': ['W'],
      'Thursday': ['R'],
      'Friday': ['F']
    };
    
    const gridDayAbbrevs = dayMap[gridDay];
    if (!gridDayAbbrevs) return false;
    
    return gridDayAbbrevs.some(abbrev => courseDays.includes(abbrev));
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

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      // For demo purposes, fetch schedule without authentication
      const res = await fetch('/api/schedule');
      
      if (!res.ok) {
        throw new Error('Failed to fetch schedule');
      }
      
      const data = await res.json();
      setSchedule(data.schedule);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromSchedule = async (courseId: number) => {
    try {
      // For demo purposes, remove course without authentication
      const res = await fetch(`/api/schedule/${courseId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to remove course');
      }

      // Refresh schedule
      fetchSchedule();
      // Close modal if the removed course was selected
      if (selectedCourse?.id === courseId) {
        setShowModal(false);
        setSelectedCourse(null);
      }
    } catch (err: any) {
      setError(err.message);
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

  useEffect(() => {
    fetchSchedule();
  }, []);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeSlotIndex = (time: string) => {
    // Handle different time formats
    let hour: number;
    
    if (time.includes(':')) {
      // Handle "10:00:00" format
      const timeParts = time.split(':');
      hour = parseInt(timeParts[0], 10);
    } else {
      // Handle other formats
      hour = new Date(`2000-01-01T${time}`).getHours();
    }
    
    const index = hour - 8; // 8 AM is index 0
    
    // Ensure index is valid
    if (index < 0 || index >= timeSlots.length) {
      return -1; // Return invalid index
    }
    
    return index;
  };

  const getTimeSlotSpan = (startTime: string, endTime: string) => {
    let startHour: number;
    let endHour: number;
    
    if (startTime.includes(':')) {
      const startParts = startTime.split(':');
      startHour = parseInt(startParts[0], 10);
    } else {
      startHour = new Date(`2000-01-01T${startTime}`).getHours();
    }
    
    if (endTime.includes(':')) {
      const endParts = endTime.split(':');
      endHour = parseInt(endParts[0], 10);
    } else {
      endHour = new Date(`2000-01-01T${endTime}`).getHours();
    }
    
    const span = endHour - startHour;
    return Math.max(1, span); // Minimum 1 slot
  };

  const checkConflicts = (course: ScheduledCourse) => {
    const conflicts = schedule.filter(otherCourse => {
      if (otherCourse.id === course.id) return false;
      if (otherCourse.days !== course.days) return false;
      if (otherCourse.term !== course.term) return false;
      
      // Check for time overlap using string comparison (since times are in HH:MM:SS format)
      const hasOverlap = !(
        course.end_time <= otherCourse.start_time || 
        course.start_time >= otherCourse.end_time
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
      <section className="relative py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Calendar className="w-16 h-16 text-amber-900 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              My Schedule
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              View and manage your course schedule. Click on any course to see details. Conflicts are highlighted for easy identification.
            </p>
          </div>

          {/* Term Selector */}
          <div className="mb-8">
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
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl max-w-2xl mx-auto">
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
              {/* Schedule Grid */}
              <div className="grid grid-cols-6 gap-1">
                {/* Header Row */}
                <div className="bg-amber-900 text-white p-4 font-semibold text-center">Time</div>
                {days.map(day => (
                  <div key={day} className="bg-amber-900 text-white p-4 font-semibold text-center">
                    {day}
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map((timeSlot, timeIndex) => (
                  <div key={timeSlot} className="contents">
                    <div className="bg-gray-50 p-2 text-sm text-gray-600 text-center border-r border-gray-200">
                      {timeSlot}
                    </div>
                    {days.map(day => {
                      const course = filteredSchedule.find(c => {
                        const courseTimeIndex = getTimeSlotIndex(c.start_time);
                        const dayMatch = dayMatches(c.days, day);
                        const timeMatch = courseTimeIndex === timeIndex;
                        
                        return dayMatch && timeMatch;
                      });
                      
                      if (course) {
                        const span = getTimeSlotSpan(course.start_time, course.end_time);
                        const hasConflict = checkConflicts(course);
                        

                        
                        return (
                          <div
                            key={`${day}-${timeIndex}`}
                            className={`p-2 border-b border-gray-200 ${hasConflict ? 'bg-red-50 border-red-400 shadow-sm' : 'bg-amber-50'} cursor-pointer hover:${hasConflict ? 'bg-red-100' : 'bg-amber-100'} transition-colors`}
                            style={{ gridRow: `span ${Math.max(1, span)}` }}
                            onClick={() => openCourseModal(course)}
                          >
                            <div className="text-xs font-semibold text-gray-900 mb-1">
                              {course.code}
                            </div>
                            <div className="text-xs text-gray-700 mb-1 truncate">
                              {course.name}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {formatDays(course.days)}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {formatTime(course.start_time)} - {formatTime(course.end_time)}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {course.location}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {course.professor || 'TBA'}
                            </div>
                            {hasConflict && (
                              <div className="space-y-2 mb-2">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromSchedule(course.id);
                              }}
                              className="text-xs text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </button>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={`${day}-${timeIndex}`} className="p-2 border-b border-gray-200 bg-white">
                        </div>
                      );
                    })}
                  </div>
                ))}
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
                  onClick={() => removeFromSchedule(selectedCourse.id)}
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
                  onClick={() => removeFromSchedule(conflictInfo.course.id)}
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