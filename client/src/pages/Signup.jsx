import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, role);
      showToast('Account created successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md page-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">Join NexEvent and start exploring events.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            required
          />
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

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">Account Type</span>
            <div className="grid grid-cols-2 gap-2">
              {['user', 'organizer'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`h-10 rounded-2xl border text-sm font-medium capitalize transition-all duration-200 ease-in-out ${
                    role === option
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>

          <Button type="submit" loading={loading} fullWidth>
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-700 hover:underline">
              Login here
            </Link>
        </p>
      </div>
    </div>
  );
};
