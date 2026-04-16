import { useState } from 'react';
import { registrationService } from '../services/api';

export const useRegistrationActions = ({ onSuccess, onError }) => {
  const [registrationLoadingId, setRegistrationLoadingId] = useState('');

  const registerForEvent = async (eventId) => {
    try {
      setRegistrationLoadingId(eventId);
      const response = await registrationService.register(eventId);
      onSuccess?.({ type: 'register', eventId, response });
    } catch (error) {
      onError?.(error);
    } finally {
      setRegistrationLoadingId('');
    }
  };

  const unregisterFromEvent = async (eventId) => {
    try {
      setRegistrationLoadingId(eventId);
      const response = await registrationService.unregister(eventId);
      onSuccess?.({ type: 'unregister', eventId, response });
    } catch (error) {
      onError?.(error);
    } finally {
      setRegistrationLoadingId('');
    }
  };

  return {
    registrationLoadingId,
    registerForEvent,
    unregisterFromEvent,
  };
};
