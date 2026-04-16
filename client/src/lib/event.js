const CATEGORY_STYLES = {
  conference: 'bg-blue-100 text-blue-600',
  seminar: 'bg-purple-100 text-purple-600',
  other: 'bg-gray-100 text-gray-600',
  workshop: 'bg-emerald-100 text-emerald-600',
  networking: 'bg-amber-100 text-amber-700',
};

const CATEGORY_LABELS = {
  conference: 'Conference',
  seminar: 'Seminar',
  other: 'Other',
  workshop: 'Workshop',
  networking: 'Networking',
};

export const getCategoryClass = (category) => {
  if (!category) return CATEGORY_STYLES.other;
  return CATEGORY_STYLES[category.toLowerCase()] || CATEGORY_STYLES.other;
};

export const getCategoryLabel = (category) => {
  if (!category) return CATEGORY_LABELS.other;
  return CATEGORY_LABELS[category.toLowerCase()] || CATEGORY_LABELS.other;
};

export const getEventStatus = (event) => {
  const now = Date.now();
  const deadline = new Date(
    event?.registrationDeadline || event?.dateTime || event?.date
  ).getTime();
  const isPast = Number.isFinite(deadline) && deadline < now;
  const maxCapacity = Number(event?.maxCapacity || 0);
  const count = Number(event?.registrationCount || 0);
  const isFull = maxCapacity > 0 && count >= maxCapacity;

  if (isPast) {
    return { label: 'Closed', tone: 'bg-gray-100 text-gray-600' };
  }

  if (isFull) {
    return { label: 'Full', tone: 'bg-rose-100 text-rose-600' };
  }

  return { label: 'Upcoming', tone: 'bg-emerald-100 text-emerald-600' };
};

export const formatEventDate = (value, long = false) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Date pending';

  return date.toLocaleDateString('en-US', {
    weekday: long ? 'long' : 'short',
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: long ? 'numeric' : undefined,
  });
};

export const getRegistrationDeadline = (event) =>
  event?.registrationDeadline || event?.dateTime || event?.date;

export const formatEventTime = (value) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Time pending';

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
