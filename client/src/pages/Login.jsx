import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2 overflow-hidden bg-white">
      {/* LEFT SECTION: Branding & Imagery */}
      <section className="hidden md:flex md:flex-col md:justify-center md:items-start relative overflow-hidden p-12 md:p-10 lg:p-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-purple-900/40 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl space-y-10">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.5C4.94772 1.5 4.5 1.94772 4.5 2.5V5.5C4.5 6.05228 4.94772 6.5 5.5 6.5H10.5C11.0523 6.5 11.5 6.05228 11.5 5.5V2.5C11.5 1.94772 11.0523 1.5 10.5 1.5Z M14.5 1.5H9.5C8.94772 1.5 8.5 1.94772 8.5 2.5V5.5C8.5 6.05228 8.94772 6.5 9.5 6.5H14.5C15.0523 6.5 15.5 6.05228 15.5 5.5V2.5C15.5 1.94772 15.0523 1.5 14.5 1.5Z M10.5 9.5H5.5C4.94772 9.5 4.5 9.94772 4.5 10.5V13.5C4.5 14.0523 4.94772 14.5 5.5 14.5H10.5C11.0523 14.5 11.5 14.0523 11.5 13.5V10.5C11.5 9.94772 11.0523 9.5 10.5 9.5Z M14.5 9.5H9.5C8.94772 9.5 8.5 9.94772 8.5 10.5V13.5C8.5 14.0523 8.94772 14.5 9.5 14.5H14.5C15.0523 14.5 15.5 14.0523 15.5 13.5V10.5C15.5 9.94772 15.0523 9.5 14.5 9.5Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white/95 tracking-tight">NexEvent</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
              Manage and join{' '}
              <span className="block">
                events{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  effortlessly
                </span>
              </span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-md font-medium">
              Step into the digital curator experience. Orchestrate world-class exhibitions and conferences with precision.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-4">
            {['Exhibitions', 'Conferences', 'Global Summits'].map((tag) => (
              <div
                key={tag}
                className="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-sm font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-default"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Blur Elements */}
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-[-10%] w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      </section>

      {/* RIGHT SECTION: Login Card */}
      <section className="flex flex-col justify-center items-center w-full p-6 md:p-8 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.5C4.94772 1.5 4.5 1.94772 4.5 2.5V5.5C4.5 6.05228 4.94772 6.5 5.5 6.5H10.5C11.0523 6.5 11.5 6.05228 11.5 5.5V2.5C11.5 1.94772 11.0523 1.5 10.5 1.5Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            NexEvent
          </span>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md space-y-8 page-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Login to NexEvent
            </h2>
            <p className="text-gray-500 text-base font-medium leading-relaxed">
              Access your events and manage your curator dashboard.
            </p>
          </div>

          {/* Login Card Container */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/70 p-8 hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 ml-1 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="curator@nexevent.com"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gray-300 shadow-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-medium outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-600 block">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-gray-300 shadow-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-3 px-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-gray-300 bg-white cursor-pointer accent-purple-600 transition-all duration-200"
                />
                <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                  Remember for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <p className="text-center text-gray-600 text-sm font-medium">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
              Create a free curator account
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-5 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
};
