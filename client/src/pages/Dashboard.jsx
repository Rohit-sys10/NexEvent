import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { getSocket, joinEventRoom } from '../lib/socket';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useSocket(); // Initialize socket
  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAll(category, page, 10);
        setEvents(response.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, page]);

  // Fetch user registrations
  useEffect(() => {
    const fetchUserRegistrations = async () => {
      if (user) {
        try {
          const response = await registrationService.getMyRegistrations();
          setUserRegistrations(response.registrations.map((e) => e._id));
        } catch (error) {
          console.error('Failed to fetch registrations:', error);
        }
      }
    };

    fetchUserRegistrations();
  }, [user]);

  // Join event rooms for real-time updates
  useEffect(() => {
    const socket = getSocket();
    
    events.forEach((event) => {
      joinEventRoom(event._id);
    });

    // Listen for registration updates
    const handleRegistrationUpdate = (data) => {
      const { eventId, registrationCount } = data;
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? { ...event, registrationCount }
            : event
        )
      );
    };

    socket.on('registrationUpdate', handleRegistrationUpdate);

    return () => {
      socket.off('registrationUpdate', handleRegistrationUpdate);
    };
  }, [events]);

  const handleRegister = async (eventId) => {
    try {
      setRegistrationLoading(true);
      const response = await registrationService.register(eventId);

      // Update local state
      setUserRegistrations((prev) => [...prev, eventId]);
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? { ...event, registrationCount: response.updatedCount }
            : event
        )
      );
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      setRegistrationLoading(true);
      const response = await registrationService.unregister(eventId);

      // Update local state
      setUserRegistrations((prev) => prev.filter((id) => id !== eventId));
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? { ...event, registrationCount: response.updatedCount }
            : event
        )
      );
    } catch (error) {
      console.error('Unregistration failed:', error);
      alert(error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-secondary mt-2">Discover and join events</p>
          </div>
          {user?.role === 'organizer' && (
            <button
              onClick={() => navigate('/create-event')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 flex space-x-4">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-border rounded focus:outline-none focus:border-primary"
          >
            <option value="">All Categories</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="networking">Networking</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-secondary">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={userRegistrations.includes(event._id)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                registrationLoading={registrationLoading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
