import { useState, useEffect } from 'react';
import { CalendarX2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { EventCard } from '../components/event/EventCard';
import { registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { EmptyState } from '../components/ui/EmptyState';
import { EventCardSkeleton } from '../components/ui/Skeleton';

export const MyRegistrations = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationLoadingId, setRegistrationLoadingId] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await registrationService.getMyRegistrations();
        setEvents(response.registrations);
      } catch (error) {
        showToast('Failed to load registrations.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [showToast]);

  const handleUnregister = async (eventId) => {
    try {
      setRegistrationLoadingId(eventId);
      await registrationService.unregister(eventId);
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      showToast('Registration cancelled.', 'success');
    } catch (error) {
      showToast(error.message || 'Unregistration failed.', 'error');
    } finally {
      setRegistrationLoadingId('');
    }
  };

  return (
    <div className="min-h-screen page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">My Registrations</h1>
          <p className="text-sm text-gray-600">Track every event you have already joined.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No registrations yet"
            description="Register for an event from the dashboard to see it here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered
                isOrganizer={event.organizer?._id === user?.id || event.organizer?.id === user?.id}
                onUnregister={handleUnregister}
                isActionLoading={registrationLoadingId === event._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
