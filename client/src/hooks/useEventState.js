import { useContext } from 'react';
import { EventStateContext } from '../state/EventState';

export const useEventState = () => {
  const context = useContext(EventStateContext);
  if (!context) {
    throw new Error('useEventState must be used within an EventStateProvider');
  }
  return context;
};
