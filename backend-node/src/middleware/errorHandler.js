const errorHandler = (err, req, res, next) => {
  if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: 'Bad request' });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
};

module.exports = errorHandler;