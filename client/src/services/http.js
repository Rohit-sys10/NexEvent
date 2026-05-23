const API_URL = import.meta.env.VITE_API_URL;

const SLOW_REQUEST_THRESHOLD = 2500;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined');
}

const getToken = () => sessionStorage.getItem('token');

let activeRequests = 0;
let wakeTimer = null;
let isWakingUp = false;
const statusListeners = new Set();

const notifyStatusListeners = () => {
  statusListeners.forEach((listener) => listener());
};

const setWakingUp = (nextValue) => {
  if (isWakingUp === nextValue) {
    return;
  }

  isWakingUp = nextValue;
  notifyStatusListeners();
};

const clearWakeTimer = () => {
  if (wakeTimer !== null) {
    clearTimeout(wakeTimer);
    wakeTimer = null;
  }
};

const scheduleWakeIndicator = () => {
  if (wakeTimer !== null || activeRequests === 0) {
    return;
  }

  wakeTimer = setTimeout(() => {
    wakeTimer = null;

    if (activeRequests > 0) {
      setWakingUp(true);
    }
  }, SLOW_REQUEST_THRESHOLD);
};

const startRequest = () => {
  activeRequests += 1;

  if (activeRequests === 1) {
    scheduleWakeIndicator();
  }
};

const finishRequest = () => {
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests === 0) {
    clearWakeTimer();
    setWakingUp(false);
  }
};

export const subscribeToApiStatus = (listener) => {
  statusListeners.add(listener);

  return () => {
    statusListeners.delete(listener);
  };
};

export const getApiStatusSnapshot = () => isWakingUp;

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  startRequest();

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || 'API Error');
    }

    return data;
  } finally {
    finishRequest();
  }
};
