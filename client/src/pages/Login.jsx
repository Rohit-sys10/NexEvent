import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md page-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">NexEvent</h1>
          <p className="mt-2 text-sm text-gray-600">Login to continue managing your events.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-700 hover:underline">
              Sign up here
            </Link>
        </p>
      </div>
    </div>
  );
};
