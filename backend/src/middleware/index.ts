import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../types';

/**
 * Error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not found';
  } else if (err.message) {
    message = err.message;
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(response);
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  };
  
  res.status(404).json(response);
};

/**
 * Rate limiting middleware
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiting for valuation endpoints
 */
export const valuationRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // limit each IP to 10 valuation requests per minute
  message: {
    success: false,
    error: 'Too many valuation requests, please try again later',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

/**
 * Validation middleware factory
 */
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.details[0].message,
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

/**
 * Query parameter validation middleware
 */
export const validateQuery = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.details[0].message,
        timestamp: new Date().toISOString()
      };
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

/**
 * Health check middleware
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection
    const { testConnection } = await import('../config/database');
    const dbHealthy = await testConnection();
    
    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbHealthy ? 'connected' : 'disconnected'
    };
    
    const response: ApiResponse = {
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    };
    
    res.status(dbHealthy ? 200 : 503).json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    };
    
    res.status(503).json(response);
  }
};