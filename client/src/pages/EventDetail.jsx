import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Image as ImageIcon, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getSocket, joinEventRoom } from '../lib/socket';
import { useToast } from '../hooks/useToast';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { getCategoryClass, getCategoryLabel, getEventStatus, formatEventDate, formatEventTime, getRegistrationDeadline } from '../lib/event';
import { useCountdown } from '../hooks/useCountdown';

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ''));

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [error, setError] = useState('');

  const eventId = id?.trim();
  const organizerId = event?.organizer?._id || event?.organizer?.id || event?.organizer;
  const isOrganizer = Boolean(eventId && organizerId && organizerId === user?.id);
  const countdown = useCountdown(getRegistrationDeadline(event));

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setEvent(null);
        setRegistrations([]);
        setError('Invalid event id.');
        setLoading(false);
        return;
      }

      if (!isValidObjectId(eventId)) {
        setEvent(null);
        setRegistrations([]);
        setError('Invalid event id.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await eventService.getById(eventId);
        setEvent(response?.event || null);
        setRegistrations(response.registrations || []);

        const userReg = response.registrations?.find((reg) => reg.user?._id === user?.id);
        setIsRegistered(!!userReg);
        joinEventRoom(eventId);
      } catch (error) {
        setEvent(null);
        setRegistrations([]);
        setIsRegistered(false);
        setError(error.message || 'Failed to load event.');
        showToast('Failed to load event.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    const socket = getSocket();
    const handleRegistrationUpdate = (data) => {
      if (data.eventId === eventId) {
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
  }, [eventId, user?.id, showToast]);

  const handleRegister = async () => {
    try {
      setRegistrationLoading(true);
      await registrationService.register(eventId);
      setIsRegistered(true);
      setEvent((prev) => ({
        ...prev,
        registrationCount: (prev?.registrationCount || 0) + 1,
      }));
      showToast('Successfully registered.', 'success');
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistrationLoading(true);
      await registrationService.unregister(eventId);
      setIsRegistered(false);
      setEvent((prev) => ({
        ...prev,
        registrationCount: Math.max(0, (prev?.registrationCount || 0) - 1),
      }));
      showToast('You have been unregistered.', 'success');
    } catch (error) {
      showToast(error.message || 'Unregistration failed.', 'error');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(eventId);
        showToast('Event deleted.', 'success');
        navigate('/dashboard');
      } catch (error) {
        showToast(error.message || 'Delete failed.', 'error');
      }
    }
  };

  if (!eventId) {
    return (
      <div className="min-h-screen page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Invalid event link"
            description="The event URL is missing its id parameter. Go back and try again."
            action={
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to dashboard
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Unable to load event"
            description={error}
            action={
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to dashboard
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Event not found"
            description="The event might have been deleted or moved."
          />
        </div>
      </div>
    );
  }
  const status = getEventStatus(event);
  const isClosed = status.label === 'Closed';
  const isFull = status.label === 'Full';
  const disableRegister = isClosed || (isFull && !isRegistered);

  return (
    <div className="min-h-screen page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm text-blue-700 transition-all duration-200 ease-in-out hover:bg-blue-50"
        >
          <ArrowLeft size={18} />
          <span>Back to Events</span>
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-400 text-white">
              <ImageIcon className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="space-y-6 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getCategoryClass(event.category)}>{getCategoryLabel(event.category)}</Badge>
              <Badge className={status.tone}>{status.label}</Badge>
              {isRegistered ? <Badge className="bg-emerald-100 text-emerald-700">You are registered</Badge> : null}
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {formatEventDate(event.date, true)} at {formatEventTime(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                {event.registrationCount || 0}
                {event.maxCapacity ? `/${event.maxCapacity}` : ''} attendees
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs uppercase tracking-wide text-blue-600">Registration Countdown</p>
              <p className="text-xl font-semibold text-blue-900">{countdown.label}</p>
            </div>

            <p className="whitespace-pre-wrap text-sm text-gray-600">{event.description}</p>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">Organizer</p>
              <p className="text-sm text-gray-600">{event.organizer?.name}</p>
              <p className="text-xs text-gray-400">{event.organizer?.email}</p>
            </div>

            {isOrganizer && registrations.length > 0 ? (
              <div className="space-y-3 rounded-2xl border border-gray-200 p-4">
                <p className="text-lg font-semibold text-gray-900">Attendees</p>
                {registrations.map((reg) => (
                  <div key={reg._id} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
                    <p className="text-sm font-medium text-gray-800">{reg.user?.name || 'Attendee'}</p>
                    <p className="text-xs text-gray-400">{reg.user?.email || 'Email unavailable'}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

          <Card className="h-fit space-y-4 lg:sticky lg:top-20">
            {!isOrganizer ? (
              <>
                <p className="text-sm text-gray-600">
                  {isRegistered ? 'You are currently registered for this event.' : 'Ready to join this event?'}
                </p>
                <Button
                  fullWidth
                  loading={registrationLoading}
                  variant={isRegistered ? 'danger' : 'primary'}
                  disabled={!isRegistered && disableRegister}
                  onClick={() => (isRegistered ? handleUnregister() : handleRegister())}
                >
                  {isRegistered
                    ? 'Unregister'
                    : isClosed
                      ? 'Registration Closed'
                      : isFull
                        ? 'Event Full'
                        : 'Register Now'}
                </Button>
              </>
            ) : (
              <>
                <Button fullWidth variant="secondary" onClick={() => navigate(`/events/${eventId}/edit`)}>
                  <Pencil className="h-4 w-4" />
                  Edit Event
                </Button>
                <Button fullWidth variant="danger" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete Event
                </Button>
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};
