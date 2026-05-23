import { useSyncExternalStore } from 'react';
import { getApiStatusSnapshot, subscribeToApiStatus } from '../services/http';

export const useApiWakeState = () => {
  return useSyncExternalStore(subscribeToApiStatus, getApiStatusSnapshot, () => false);
};