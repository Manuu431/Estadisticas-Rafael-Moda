const express = require('express');
const cors = require('cors');
require('dotenv').config();
process.env.TZ = 'Europe/Madrid';
const { secretProblem, parseOrigins } = require('./src/config/env');
const problem = secretProblem(process.env.JWT_SECRET);
if (problem) throw new Error(problem);

const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/errorHandler');
const usersRouter = require('./src/routes/users');
const salesRouter = require('./src/routes/sales');
const statisticsRouter = require('./src/routes/statistics');
const clientsRouter = require('./src/routes/clients');
const brandsRouter = require('./src/routes/brands');
const familiesRouter = require('./src/routes/families');
const productsRouter = require('./src/routes/products');
const { periodRouter, typeRouter } = require('./src/routes/periodRouters');
const { dailyDemoUpdate } = require('./src/controllers/dailyDemoUpdateController');

const app = express();
const PORT = process.env.PORT || 8000;

app.disable('x-powered-by');
app.set('case sensitive routing', true);
app.use(cors({ origin: parseOrigins(process.env.CORS_ORIGIN) }));
app.use(express.json());

app.get('/api/internal/daily-demo-update', dailyDemoUpdate);

app.use('/api/users', usersRouter);
app.use(authMiddleware);
app.use('/api/sales', salesRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/families', familiesRouter);
app.use('/api/products', productsRouter);
app.use('/api/campaigns', periodRouter('campaign'));
app.use('/api/seasons', periodRouter('season'));
app.use('/api/season_types', typeRouter('season'));
app.use('/api/campaign_types', typeRouter('campaign'));
app.use(errorHandler);

if (require.main === module) app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
module.exports = app;