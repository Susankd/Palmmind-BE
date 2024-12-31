import express, { Express } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import bodyParser from 'body-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import { morgan } from './modules/logger';
import { jwtStrategy } from './modules/auth';
import { authLimiter } from './modules/utils';
import { ApiError, errorConverter, errorHandler } from './modules/errors';
import routes from './routes/v1';

const app: Express = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());
app.options('*', cors());

// Parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// Gzip compression
app.use(compression());

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 API routes
app.use('/v1', routes);

// Handle unknown API requests
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

// Export the app for HTTP server setup
export default app;
