import { useMemo, useState } from 'react';

export const useEventFilters = (events) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === 'all' || event.category === category;
      const target = `${event.title} ${event.description} ${event.location}`.toLowerCase();
      const matchesSearch = target.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, category, search]);

  return {
    search,
    setSearch,
    category,
    setCategory,
    filteredEvents,
  };
};
