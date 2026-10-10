
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/api';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-[#E2E8F0]">
        <div className="text-center mb-6">
          <LogIn size={40} className="text-[#2563EB] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1E293B]">Welcome Back</h2>
          <p className="text-[#64748B] text-sm">Sign in to view your roadmaps</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Email</label>
            <input 
              type="email"
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#2563EB]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1E293B]">Password</label>
            <input 
              type="password"
              className="w-full bg-white border border-[#E2E8F0] rounded-md p-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#2563EB]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#2563EB] text-white p-3 rounded-md font-medium hover:bg-[#1D4ED8] transition-colors">
            Sign In
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-[#64748B]">
          Don't have an account? <Link to="/register" className="text-[#2563EB] hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
