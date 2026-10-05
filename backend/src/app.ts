import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import representativeRoutes from './modules/representatives/routes.js';
import providerRoutes from './modules/providers/routes.js';
import availabilityRoutes from './modules/availability/routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

// Root welcome route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'AssetBridge Member 2 API Server is running!',
    health: '/api/health',
    representatives: '/api/representatives',
    providers: '/api/providers',
  });
});

// API Health / Status
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'AssetBridge Member 2 API' });
});

// Member 2 Feature Modules
app.use('/api/representatives', representativeRoutes);
app.use('/api/providers/:id/availability', availabilityRoutes);
app.use('/api/providers', providerRoutes);

// 404 Handler for API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});
