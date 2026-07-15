import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import userRoutes from './routes/userRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
