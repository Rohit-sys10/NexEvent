import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Bell, LogOut, Plus } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold text-primary">
            NexEvent
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-foreground hover:text-primary transition">
              Events
            </Link>
            <Link to="/my-registrations" className="text-foreground hover:text-primary transition">
              My Events
            </Link>
            {user?.role === 'organizer' && (
              <Link to="/create-event" className="text-foreground hover:text-primary transition">
                Create Event
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <NotificationBell unreadCount={unreadCount} />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-input transition"
              >
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-secondary capitalize">{user?.role}</p>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded shadow-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-input flex items-center space-x-2 rounded-t"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 flex flex-col space-y-2">
          <Link to="/dashboard" className="text-foreground hover:text-primary transition">
            Events
          </Link>
          <Link to="/my-registrations" className="text-foreground hover:text-primary transition">
            My Events
          </Link>
          {user?.role === 'organizer' && (
            <Link to="/create-event" className="text-foreground hover:text-primary transition flex items-center space-x-2">
              <Plus size={16} />
              <span>Create Event</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
