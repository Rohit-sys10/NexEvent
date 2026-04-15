import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const EventCard = ({
  event,
  isRegistered = false,
  onRegister,
  onUnregister,
  registrationLoading = false,
}) => {
  const { user } = useAuth();
  const isOrganizer = event.organizer._id === user?.id || event.organizer.id === user?.id;
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-border rounded shadow hover:shadow-lg transition">
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
        <span className="text-white text-lg font-semibold">{event.title.charAt(0)}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {event.category && (
          <span className="inline-block bg-blue-50 text-primary text-xs px-2 py-1 rounded mb-2 capitalize">
            {event.category}
          </span>
        )}

        {/* Title */}
        <Link to={`/event/${event._id}`} className="block">
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Date & Time */}
        <div className="flex items-center space-x-2 text-secondary text-sm mt-2">
          <Calendar size={16} />
          <span>
            {formattedDate} at {formattedTime}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-secondary text-sm mt-1">
          <MapPin size={16} />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Registration Count */}
        <div className="flex items-center space-x-2 text-secondary text-sm mt-2">
          <Users size={16} />
          <span>{event.registrationCount} registered</span>
          {event.maxCapacity && <span>/ {event.maxCapacity}</span>}
        </div>

        {/* Description */}
        <p className="text-secondary text-sm mt-3 line-clamp-2">{event.description}</p>

        {/* Organizer Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-secondary">
            by <span className="font-medium text-foreground">{event.organizer.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/event/${event._id}`}
            className="flex-1 text-center bg-input hover:bg-border text-foreground py-2 rounded transition"
          >
            View Details
          </Link>

          {!isOrganizer && (
            <button
              onClick={() => (isRegistered ? onUnregister(event._id) : onRegister(event._id))}
              disabled={registrationLoading}
              className={`flex-1 py-2 rounded transition font-medium ${
                isRegistered
                  ? 'bg-destructive text-white hover:bg-red-600'
                  : 'bg-primary text-white hover:bg-blue-600'
              } disabled:opacity-50`}
            >
              {registrationLoading ? 'Processing...' : isRegistered ? 'Unregister' : 'Register'}
            </button>
          )}
        </div>

        {/* Organizer Badge */}
        {isOrganizer && (
          <div className="mt-4 p-2 bg-blue-50 rounded">
            <p className="text-xs text-primary font-medium">You are the organizer</p>
          </div>
        )}
      </div>
    </div>
  );
};
