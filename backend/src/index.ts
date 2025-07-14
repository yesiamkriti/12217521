import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { logger } from './middleware/logger';
import urlRoutes from './routes/urlRoutes';
import { handleRedirect } from './controllers/urlController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // Custom logging middleware

// Routes
app.use('/shorturls', urlRoutes);                 // Main API route
app.get('/shorturls/r/:shortcode', handleRedirect); // Redirect endpoint

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!, { dbName: 'url_shortener' })
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
