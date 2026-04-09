import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataStore from './store/dataStore.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import userRoutes from './routes/users.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded resumes
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const stats = dataStore.getStats();

        res.json({
            status: 'OK',
            message: 'Job Portal API is running',
            storage: 'In-Memory (no database)',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Server error',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await seedDatabase();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(` Using in-memory storage (no database)`);
    console.log(`⚠️  Data will be lost on server restart`);
});

export default app;
