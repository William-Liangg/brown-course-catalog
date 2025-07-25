import { useState, useEffect } from 'react'
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

interface NavbarProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ onNavigate, isLoggedIn, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-amber-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Brown Course Catalog
        </div>
        <div className="space-x-6">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer">Home</button>
          <button onClick={() => onNavigate('courses')} className="hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer">Courses</button>
          <button onClick={() => onNavigate('schedule')} className="hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer">Schedule</button>
          {!isLoggedIn && (
            <button onClick={() => onNavigate('login')} className="hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer">Log in</button>
          )}
          {isLoggedIn && (
            <button onClick={onLogout} className="hover:text-amber-200 transition-colors bg-transparent border-none cursor-pointer">Log out</button>
          )}
        </div>
      </div>
    </nav>
  );
};

interface PageProps {
  onNavigate: (route: string) => void;
}

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
  else content = (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Trouble Picking Classes?
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to Brown Course Catalog
        </p>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onNavigate={setRoute} isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
      {content}
    </div>
  );
};

export default App;