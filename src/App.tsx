import { useState, useEffect } from 'react'
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import CoursesPage from './CoursesPage';
import HomePage from './HomePage';
import SchedulePage from './SchedulePage';

interface NavbarProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ onNavigate, isLoggedIn, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-amber-900 text-white p-5 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => onNavigate("home")}>
          BrunoTrack
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
              onClick={onLogout}
              className="text-lg hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [route, setRoute] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [route]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRoute('home');
  };

  let content;
  if (route === 'login') content = <LoginPage onNavigate={setRoute} />;
  else if (route === 'signup') content = <SignupPage onNavigate={setRoute} />;
  else if (route === 'courses') content = <CoursesPage onNavigate={setRoute} />;
  else if (route === 'schedule') content = <SchedulePage onNavigate={setRoute} />;
  else content = <HomePage onNavigate={setRoute} isLoggedIn={isLoggedIn} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onNavigate={setRoute} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {content}
    </div>
  );
};

export default App;