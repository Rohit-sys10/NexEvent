import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Image as ImageIcon, MapPin, Pencil, Trash2, Users, Clock3, Ticket, User } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getSocket, joinEventRoom } from '../lib/socket';
import { useToast } from '../hooks/useToast';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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
      } catch (requestError) {
        setEvent(null);
        setRegistrations([]);
        setIsRegistered(false);
        setError(requestError.message || 'Failed to load event.');
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
    } catch (requestError) {
      showToast(requestError.message || 'Registration failed.', 'error');
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
    } catch (requestError) {
      showToast(requestError.message || 'Unregistration failed.', 'error');
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
      } catch (requestError) {
        showToast(requestError.message || 'Delete failed.', 'error');
      }
    }
  };

  if (!eventId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16 lg:py-10">
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
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16 lg:py-10">
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
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 md:px-10 lg:px-16 lg:py-10">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-80 w-full rounded-3xl" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16 lg:py-10">
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-8 md:px-10 lg:px-16 lg:py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-50"
        >
          <ArrowLeft size={18} />
          <span>Back to Events</span>
        </button>

        <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="relative h-[340px] w-full md:h-[420px]">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
                <ImageIcon className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="max-w-3xl space-y-4 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getCategoryClass(event.category)}>{getCategoryLabel(event.category)}</Badge>
                  <Badge className={status.tone}>{status.label}</Badge>
                  {isRegistered ? <Badge className="bg-white/15 text-white">You are registered</Badge> : null}
                </div>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatEventDate(event.date, true)} at {formatEventTime(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.registrationCount || 0}
                      {event.maxCapacity ? `/${event.maxCapacity}` : ''} attendees
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-blue-50 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
                    <Clock3 className="h-4 w-4" />
                    Countdown
                  </div>
                  <p className="mt-2 text-xl font-bold text-gray-900">{countdown.days}</p>
                  <p className="text-sm text-gray-500">Days left</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Hours</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{countdown.hours}</p>
                  <p className="text-sm text-gray-500">Remaining</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Minutes</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{countdown.minutes}</p>
                  <p className="text-sm text-gray-500">Remaining</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Seconds</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{countdown.seconds}</p>
                  <p className="text-sm text-gray-500">Remaining</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">About the Event</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{event.description}</p>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                  <User className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Organizer</p>
                  <h3 className="text-lg font-semibold text-gray-900">{event.organizer?.name}</h3>
                  <p className="text-sm text-gray-500">{event.organizer?.email}</p>
                </div>
                <Button variant="secondary" className="shrink-0">
                  View Profile
                </Button>
              </div>
            </section>

            {isOrganizer && registrations.length > 0 ? (
              <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">Attendees</h2>
                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <div key={reg._id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{reg.user?.name || 'Attendee'}</p>
                        <p className="text-xs text-gray-500">{reg.user?.email || 'Email unavailable'}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Registered</Badge>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Ticket className="h-4 w-4" />
                    Ticket Card
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-gray-900">
                    {event.ticketPrice ? `$${event.ticketPrice}` : 'Free'}
                  </p>
                </div>
                <Badge className={status.tone}>{status.label}</Badge>
              </div>

              <div className="space-y-4 pt-5">
                {!isOrganizer ? (
                  <>
                    <p className="text-sm leading-relaxed text-gray-500">
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
              </div>
            </section>

            <section className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <User className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Organizer</p>
                <h4 className="truncate text-lg font-semibold text-gray-900">{event.organizer?.name}</h4>
                <p className="truncate text-sm text-gray-500">{event.organizer?.email}</p>
              </div>
              <Button variant="secondary" className="shrink-0 px-4">
                Contact
              </Button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
