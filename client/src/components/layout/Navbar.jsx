import { Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../notification/NotificationDropdown';

const baseLinks = [
  { to: '/dashboard', label: 'Events' },
  { to: '/my-registrations', label: 'My Registrations' },
];

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const links = [...baseLinks];
  if (user?.role === 'organizer') {
    links.push({ to: '/create-event', label: 'Create Event', icon: Plus });
  }

  const isActive = (to) => location.pathname === to;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-blue-700">
          NexEvent
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group relative text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive(link.to) ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ease-in-out ${
                  isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <NotificationDropdown unreadCount={unreadCount} />
          <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2.5 py-1.5">
            <Avatar name={user?.name} />
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="secondary" className="h-10 px-3" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl border border-gray-200 p-2 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="space-y-3 border-t border-gray-200 px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <Avatar name={user?.name} />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <NotificationDropdown unreadCount={unreadCount} />
          </div>

          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : null}
    </nav>
  );
};
