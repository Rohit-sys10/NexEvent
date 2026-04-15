import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { getSocket, joinEventRoom } from '../lib/socket';
import { Calendar, MapPin, Users, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  useSocket(); // Initialize socket
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Fetch event details and setup socket listeners
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await eventService.getById(id);
        setEvent(response.event);
        setRegistrations(response.registrations || []);

        // Check if user is registered
        const userReg = response.registrations?.find((reg) => reg.user._id === user?.id);
        setIsRegistered(!!userReg);

        // Join event room for real-time updates
        joinEventRoom(id);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Setup socket listener for registration updates
    const socket = getSocket();
    const handleRegistrationUpdate = (data) => {
      if (data.eventId === id) {
        setEvent((prev) => ({
          ...prev,
          registrationCount: data.registrationCount,
        }));
      }
    };

    socket.on('registrationUpdate', handleRegistrationUpdate);

    return () => {
      socket.off('registrationUpdate', handleRegistrationUpdate);
    };
  }, [id, user?.id]);

  const isOrganizer = event?.organizer._id === user?.id || event?.organizer.id === user?.id;

  const handleRegister = async () => {
    try {
      setRegistrationLoading(true);
      await registrationService.register(id);
      setIsRegistered(true);
      setEvent((prev) => ({
        ...prev,
        registrationCount: prev.registrationCount + 1,
      }));
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistrationLoading(true);
      await registrationService.unregister(id);
      setIsRegistered(false);
      setEvent((prev) => ({
        ...prev,
        registrationCount: Math.max(0, prev.registrationCount - 1),
      }));
    } catch (error) {
      console.error('Unregistration failed:', error);
      alert(error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Delete failed:', error);
        alert(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <p className="text-secondary">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <p className="text-secondary">Event not found</p>
        </div>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={18} />
          <span>Back to Events</span>
        </button>

        {/* Hero Image */}
        <div className="w-full h-64 bg-gradient-to-br from-primary to-blue-600 rounded mb-8 flex items-center justify-center">
          <span className="text-white text-5xl font-semibold">{event.title.charAt(0)}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Event Details */}
          <div className="lg:col-span-2">
            {/* Category */}
            {event.category && (
              <span className="inline-block bg-blue-50 text-primary text-xs px-3 py-1 rounded mb-4 capitalize">
                {event.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>

            {/* Date & Location */}
            <div className="space-y-3 mb-8 text-lg text-secondary">
              <div className="flex items-center space-x-3">
                <Calendar size={20} />
                <span>
                  {formattedDate} at {formattedTime}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users size={20} />
                <span>{event.registrationCount} registered</span>
                {event.maxCapacity && <span>/ {event.maxCapacity}</span>}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">About this event</h2>
              <p className="text-secondary whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Organizer */}
            <div className="bg-input rounded p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-2">Organized by</h3>
              <p className="text-secondary">{event.organizer.name}</p>
              <p className="text-secondary text-sm">{event.organizer.email}</p>
            </div>

            {/* Registrations List (if organizer) */}
            {isOrganizer && registrations.length > 0 && (
              <div className="bg-input rounded p-6">
                <h3 className="font-semibold text-foreground mb-4">Attendees</h3>
                <div className="space-y-2">
                  {registrations.map((reg) => (
                    <div key={reg._id} className="flex items-center space-x-2 p-2 rounded hover:bg-border">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                        {reg.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{reg.user.name}</p>
                        <p className="text-xs text-secondary">{reg.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Actions */}
          <div>
            {/* Registration Card */}
            {!isOrganizer && (
              <div className="bg-white border border-border rounded shadow p-6 sticky top-4">
                <p className="text-sm text-secondary mb-4">
                  {isRegistered
                    ? '✓ You are registered for this event'
                    : 'Ready to join? Register now'}
                </p>
                <button
                  onClick={() => (isRegistered ? handleUnregister() : handleRegister())}
                  disabled={registrationLoading}
                  className={`w-full py-2 rounded font-medium transition ${
                    isRegistered
                      ? 'bg-destructive text-white hover:bg-red-600'
                      : 'bg-primary text-white hover:bg-blue-600'
                  } disabled:opacity-50`}
                >
                  {registrationLoading
                    ? 'Processing...'
                    : isRegistered
                      ? 'Unregister'
                      : 'Register Now'}
                </button>
              </div>
            )}

            {/* Organizer Actions */}
            {isOrganizer && (
              <div className="bg-white border border-border rounded shadow p-6 sticky top-4 space-y-3">
                <button
                  onClick={() => navigate(`/edit-event/${id}`)}
                  className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  <Edit2 size={16} />
                  <span>Edit Event</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center space-x-2 bg-destructive text-white py-2 rounded hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                  <span>Delete Event</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
