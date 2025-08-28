import { useState, useEffect } from 'react'
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import CoursesPage from './CoursesPage';
import HomePage from './HomePage';
import SchedulePage from './SchedulePage';
import ProfilePage from './ProfilePage';
import { logout } from './utils/api';

interface NavbarProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ onNavigate, isLoggedIn }: NavbarProps) => {
  return (
    <nav className="bg-amber-900 text-white p-5 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
          <img 
            src="/brown-logo.png" 
            alt="Brown University Logo" 
            className="h-8 w-8 mr-3"
          />
          <span className="text-2xl font-bold">BrunoTrack</span>
        </div>
        <div className="space-x-6">
          <button
            onClick={() => onNavigate("home")}
            className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("courses")}
            className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
          >
            Courses
          </button>
          <button
            onClick={() => onNavigate("schedule")}
            className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
          >
            Schedule
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => onNavigate("login")}
              className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={() => onNavigate("profile")}
              className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
            >
              My Profile
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [route, setRoute] = useState(() => {
    // Get the saved route from localStorage, default to 'home'
    return localStorage.getItem('currentRoute') || 'home';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const [conflictError, setConflictError] = useState<{
    message: string;
    conflicts: Array<{
      code: string;
      name: string;
      days: string;
      start_time: string;
      end_time: string;
    }>;
  } | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const authToken = localStorage.getItem('authToken');
    
    if (userEmail && userId && userName && authToken) {
      setIsLoggedIn(true);
      setUser({ 
        id: parseInt(userId), 
        email: userEmail, 
        name: userName
      });
    } else {
      setIsLoggedIn(false);
      setUser(null);
      // Clear any cached schedule data when user logs out
      setConflictError(null);
    }
  }, [route]);

  // Save the current route to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentRoute', route);
  }, [route]);

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the httpOnly cookie
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear user data and token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Reset state
    setIsLoggedIn(false);
    setUser(null);
    setConflictError(null);
    
    // Navigate to home
    setRoute('home');
  };

  const handleNavigate = (newRoute: string) => {
    // Check if user is trying to access schedule without being logged in
    if (newRoute === 'schedule' && !isLoggedIn) {
      setShowAuthPopup(true);
      return;
    }
    
    // For other routes, navigate normally
    setRoute(newRoute);
  };

  const handleUserUpdate = (userData: { id: number; email: string; name: string }) => {
    setUser(userData);
  };

  let content;
  if (route === 'login') content = <LoginPage onNavigate={handleNavigate} />;
  else if (route === 'signup') content = <SignupPage onNavigate={handleNavigate} />;
  else if (route === 'courses') content = <CoursesPage onNavigate={handleNavigate} conflictError={conflictError} setConflictError={setConflictError} isLoggedIn={isLoggedIn} />;
  else if (route === 'schedule') content = <SchedulePage key={user?.id || 'no-user'} onNavigate={handleNavigate} />;
  else if (route === 'profile') content = <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />;
  else content = <HomePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} userFirstName={user?.name ? user.name.split(' ')[0] : undefined} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {content}

      {/* Authentication Required Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 text-amber-600 mr-3">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900">Authentication Required</h3>
              </div>
              
              <p className="text-gray-700 mb-6 text-center">
                You must sign in to save and manage your schedule.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAuthPopup(false);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAuthPopup(false);
                    setRoute('login');
                  }}
                  className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;