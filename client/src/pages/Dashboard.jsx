import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CalendarX2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { EventCard } from '../components/event/EventCard';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useEventFilters } from '../hooks/useEventFilters';
import { useRegistrationActions } from '../hooks/useRegistrationActions';
import { EmptyState } from '../components/ui/EmptyState';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useEventState } from '../hooks/useEventState';

const FILTER_CHIPS = ['all', 'conference', 'seminar', 'workshop', 'networking', 'other'];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { events, setFromApi, updateRegistrationCount } = useEventState();
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { search, setSearch, category, setCategory, filteredEvents } = useEventFilters(events);

  const { registrationLoadingId, registerForEvent, unregisterFromEvent } = useRegistrationActions({
    onSuccess: ({ type, eventId, response }) => {
      if (type === 'register') {
        setUserRegistrations((prev) => [...new Set([...prev, eventId])]);
        showToast('Successfully registered for the event.', 'success');
      }

      if (type === 'unregister') {
        setUserRegistrations((prev) => prev.filter((id) => id !== eventId));
        showToast('Registration cancelled.', 'success');
      }

      updateRegistrationCount(eventId, response.updatedCount);
    },
    onError: (error) => {
      showToast(error.message || 'Something went wrong.', 'error');
    },
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAll('', page, 30);
        setFromApi(response.events);
      } catch (error) {
        showToast('Failed to load events.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, showToast, setFromApi]);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      if (user) {
        try {
          const response = await registrationService.getMyRegistrations();
          setUserRegistrations(response.registrations.map((e) => e._id));
        } catch (error) {
          showToast('Failed to load your registrations.', 'error');
        }
      }
    };

    fetchUserRegistrations();
  }, [user, showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-8 md:px-10 lg:px-16 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore Events</h1>
            <p className="max-w-2xl text-sm text-gray-500">Discover, register, and track your next event.</p>
          </div>
          {user?.role === 'organizer' && (
            <Button
              onClick={() => navigate('/create-event')}
              className="w-full lg:w-auto"
            >
              <Plus size={18} />
              <span>Create Event</span>
            </Button>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, description, or location"
              className="h-12 w-full rounded-full border border-gray-300 bg-white pl-12 pr-5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {FILTER_CHIPS.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => {
                  setCategory(chip);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium capitalize transition-all duration-200 ${
                  category === chip
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {chip === 'all' ? 'All' : chip}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No events found"
            description="Try changing search terms or category filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                featured={index === 0}
                isOrganizer={event.organizer?._id === user?.id || event.organizer?.id === user?.id}
                isRegistered={userRegistrations.includes(event._id)}
                isActionLoading={registrationLoadingId === event._id}
                onRegister={registerForEvent}
                onUnregister={unregisterFromEvent}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
