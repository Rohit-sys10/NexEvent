const DEFAULT_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'https://nex-event-five.vercel.app',
]);

const getAllowedOrigins = () => {
  const origins = new Set(DEFAULT_ORIGINS);

  if (process.env.FRONTEND_URL) {
    origins.add(process.env.FRONTEND_URL);
  }

  return origins;
};

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return getAllowedOrigins().has(origin);
};

export const corsOriginDelegate = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Not allowed by CORS: ${origin}`), false);
};