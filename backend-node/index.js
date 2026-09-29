const express = require('express');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/errorHandler');
const usersRouter = require('./src/routes/users');
const salesRouter = require('./src/routes/sales');
const clientsRouter = require('./src/routes/clients');
const campaignsRouter = require('./src/routes/campaigns');
const seasonsRouter = require('./src/routes/seasons');
const seasonTypesRouter = require('./src/routes/seasonTypes');
const campaignTypesRouter = require('./src/routes/campaignTypes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use(authMiddleware);
app.use('/api/sales', salesRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/seasons', seasonsRouter);
app.use('/api/season_types', seasonTypesRouter);
app.use('/api/campaign_types', campaignTypesRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});