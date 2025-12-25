import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { apiUrl } from '../lib/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(apiUrl('/auth.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => null)) as any;

      if (!res.ok || !data || data.success !== true) {
        setError(typeof data?.message === 'string' ? data.message : 'Login failed. Please try again.');
        return;
      }

      localStorage.setItem('admin_session', JSON.stringify({
        admin: data.admin,
        created_at: new Date().toISOString(),
      }));

      navigate('/admin/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
      
      


      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-repeat opacity-5" style={{ backgroundImage: `url('/logo2.png')`, backgroundSize: '100px' }} />

      <div className="relative z-10 bg-dark-v2 border border-white/20 rounded-lg shadow-2xl p-8 max-w-md w-full backdrop-blur-sm">
        <div className="mb-8 text-center">
          <img src="/logo-white.png" alt="Sledge Logo" className="mx-auto w-32 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
          <p className="text-gray-400 text-sm">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email/Username Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition duration-200"
          >
            {submitting ? 'Logging in…' : 'Login'}
          </button>

          {error && (
            <div className="mt-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
