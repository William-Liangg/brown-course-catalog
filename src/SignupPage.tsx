import { useState } from 'react';

interface Props {
  onNavigate: (route: string) => void;
}

const SignupPage = ({ onNavigate }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('token', data.token);
      onNavigate('home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-800">Sign Up</button>
      </form>
      <div className="mt-4 text-center">
        <span>Already have an account? </span>
        <button className="text-amber-900 underline" onClick={() => onNavigate('login')}>Login</button>
      </div>
    </div>
  );
};

export default SignupPage; 