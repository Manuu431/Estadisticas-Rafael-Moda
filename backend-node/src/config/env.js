const secretProblem = (secret) => {
  if (!secret) return 'Missing JWT_SECRET';
  if (secret.startsWith('change_me')) return 'JWT_SECRET is still the example value';
  if (secret.length < 32) return 'JWT_SECRET must be at least 32 characters';
  return null;
};

const parseOrigins = (value) => {
  if (!value) return ['http://localhost:5173'];
  return value.split(',').map((origin) => origin.trim().replace(/\/$/, '')).filter(Boolean);
};

module.exports = { secretProblem, parseOrigins };