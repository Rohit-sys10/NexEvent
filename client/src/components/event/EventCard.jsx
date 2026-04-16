import { Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getCategoryClass, getCategoryLabel, getEventStatus, formatEventDate, formatEventTime, getRegistrationDeadline } from '../../lib/event';
import { useCountdown } from '../../hooks/useCountdown';

export const EventCard = ({
  event,
  isOrganizer = false,
  isRegistered = false,
  isActionLoading = false,
  onRegister,
  onUnregister,
}) => {
  const status = getEventStatus(event);
  const countdown = useCountdown(getRegistrationDeadline(event));
  const isFull = status.label === 'Full';
  const isClosed = status.label === 'Closed';
  const canRegister = !isOrganizer && !isRegistered && !isFull && !isClosed;

  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md">
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-40 w-full rounded-t-2xl object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-400 text-white">
          <ImageIcon className="h-10 w-10 opacity-90" />
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge className={getCategoryClass(event.category)}>{getCategoryLabel(event.category)}</Badge>
          <Badge className={status.tone}>{status.label}</Badge>
        </div>

        <Link to={`/events/${event._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 transition-all duration-200 ease-in-out group-hover:text-blue-700">
            {event.title}
          </h3>
        </Link>

        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatEventDate(event.date)}</span>
            <span className="text-xs text-gray-400">{formatEventTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>
              {event.registrationCount || 0}
              {event.maxCapacity ? `/${event.maxCapacity}` : ''} attendees
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
          <p className="text-xs text-blue-600">Registration closes in</p>
          <p className="text-sm font-semibold text-blue-800">{countdown.label}</p>
        </div>

        <p className="line-clamp-2 text-sm text-gray-600">{event.description}</p>

        {isRegistered ? (
          <Badge className="bg-emerald-100 text-emerald-700">You are registered</Badge>
        ) : null}

        {isOrganizer ? (
          <Badge className="bg-blue-100 text-blue-700">You are organizer</Badge>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              variant={isRegistered ? 'danger' : 'primary'}
              loading={isActionLoading}
              disabled={!isRegistered && !canRegister}
              onClick={() => {
                if (isRegistered) onUnregister?.(event._id);
                if (!isRegistered && canRegister) onRegister?.(event._id);
              }}
            >
              {isRegistered
                ? 'Unregister'
                : isClosed
                  ? 'Registration Closed'
                  : isFull
                    ? 'Event Full'
                    : 'Register'}
            </Button>
            <Link to={`/events/${event._id}`} className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
