import { useState } from 'react';
import { login } from './utils/api';

interface Props {
  onNavigate: (route: string) => void;
}

const LoginPage = ({ onNavigate }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    try {
      const data = await login(email, password);
      
      // Store user data in localStorage (but not the token - that's in httpOnly cookie)
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userId', data.user.id.toString());
      localStorage.setItem('userFirstName', data.user.firstName);
      localStorage.setItem('userLastName', data.user.lastName);
      
      onNavigate('home');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle validation errors
      if (err.validationErrors) {
        const errors: {[key: string]: string} = {};
        err.validationErrors.forEach((error: any) => {
          errors[error.field] = error.message;
        });
        setValidationErrors(errors);
        return;
      }
      
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-amber-50 to-orange-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button 
              type="button"
              className="text-amber-900 underline hover:text-amber-800" 
              onClick={() => onNavigate('signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 