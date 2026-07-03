const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const entrepreneurRoutes = require('./routes/entrepreneur.routes');
const publicRoutes = require('./routes/public.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const mediaRoutes = require('./routes/media.routes');
const cmsRoutes = require('./routes/cms.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');
const uploadRoutes = require('./routes/upload.routes');

const express = require('express');
const cors = require('cors');
const { corsOptions } = require('./config/cors');
const {
  helmetMiddleware,
  compressionMiddleware,
  hppMiddleware,
  apiRateLimiter,
  authRateLimiter,
} = require('./middlewares/security.middleware');
const cookieParser = require('cookie-parser');
const { httpLoggerMiddleware } = require('./middlewares/logger.middleware');

const path = require('path');

const { notFoundMiddleware } = require('./middlewares/not-found.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

app.use(helmetMiddleware);
app.use(compressionMiddleware);
app.use(hppMiddleware);
app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(httpLoggerMiddleware);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API Red Mujeres Backend funcionando correctamente',
    version: '1.0.0',
  });
});

app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

app.use('/api/auth', authRateLimiter);
app.use('/api', apiRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/entrepreneurs', entrepreneurRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
