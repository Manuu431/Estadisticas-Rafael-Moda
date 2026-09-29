const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.email } });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };