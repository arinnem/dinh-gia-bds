import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { testConnection, closePool } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler, requestLogger, corsOptions } from './middleware';
import { ApiResponse } from './types';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors(corsOptions));

    // Compression
    this.app.use(compression());

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
      this.app.use(requestLogger);
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy (for rate limiting behind reverse proxy)
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Root endpoint
    this.app.get('/', (req, res) => {
      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Real Estate Valuation API',
          version: '1.0.0',
          status: 'running',
          endpoints: {
            health: '/api/v1/health',
            docs: '/api/v1/docs',
            properties: '/api/v1/properties',
            valuations: '/api/v1/valuations',
            locations: '/api/v1/locations'
          }
        },
        timestamp: new Date().toISOString()
      };
      res.json(response);
    });

    // API routes
    const apiPrefix = process.env.API_PREFIX || '/api';
    const apiVersion = process.env.API_VERSION || 'v1';
    this.app.use(`${apiPrefix}/${apiVersion}`, routes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      console.log('🔍 Testing database connection...');
      const dbConnected = await testConnection();
      
      if (!dbConnected) {
        console.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
      }

      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📚 API Documentation: http://localhost:${this.port}/api/v1/docs`);
        console.log(`🏥 Health Check: http://localhost:${this.port}/api/v1/health`);