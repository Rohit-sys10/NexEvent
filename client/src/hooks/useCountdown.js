import { useEffect, useMemo, useState } from 'react';

const computeRemaining = (targetTime) => {
  if (!targetTime) {
    return { expired: false, totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const target = new Date(targetTime).getTime();
  if (!Number.isFinite(target)) {
    return { expired: false, totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalMs = Math.max(0, target - Date.now());
  const expired = totalMs <= 0;

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  return { expired, totalMs, days, hours, minutes, seconds };
};

export const useCountdown = (targetTime) => {
  const [remaining, setRemaining] = useState(() => computeRemaining(targetTime));

  useEffect(() => {
    setRemaining(computeRemaining(targetTime));

    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev.expired) return prev;
        return computeRemaining(targetTime);
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime]);

  const label = useMemo(() => {
    if (remaining.expired) return 'Registration Closed';
    return `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`;
  }, [remaining]);

  return {
    ...remaining,
    label,
  };
};
