import { createContext, useCallback, useMemo, useState } from 'react';

export const EventStateContext = createContext();

const upsert = (list, incoming) => {
  const index = list.findIndex((item) => item._id === incoming._id);
  if (index === -1) return [incoming, ...list];
  const copy = [...list];
  copy[index] = { ...copy[index], ...incoming };
  return copy;
};

export const EventStateProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const setFromApi = useCallback((nextEvents) => {
    setEvents(nextEvents || []);
  }, []);

  const upsertEvent = useCallback((event) => {
    if (!event?._id) return;
    setEvents((prev) => upsert(prev, event));
  }, []);

  const updateRegistrationCount = useCallback((eventId, registrationCount) => {
    setEvents((prev) =>
      prev.map((event) =>
        event._id === eventId
          ? {
              ...event,
              registrationCount,
            }
          : event
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      events,
      setFromApi,
      upsertEvent,
      updateRegistrationCount,
    }),
    [events, setFromApi, upsertEvent, updateRegistrationCount]
  );

  return <EventStateContext.Provider value={value}>{children}</EventStateContext.Provider>;
};
