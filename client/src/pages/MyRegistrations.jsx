import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard';
import { registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const MyRegistrations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await registrationService.getMyRegistrations();
        setEvents(response.registrations);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleUnregister = async (eventId) => {
    try {
      setRegistrationLoading(true);
      await registrationService.unregister(eventId);
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Registrations</h1>
          <p className="text-secondary mt-2">Events you&apos;re attending</p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-secondary">Loading your registrations...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">You haven&apos;t registered for any events yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={true}
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
