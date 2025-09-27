// app.js - CORRECTED VERSION
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js'; // ← ONLY ONCE
import creditsRouter from './routes/creditsRoute.js';
import { StripeWebhook } from './controllers/webhooks.js';

const app = express();

// Connect to database
await connectDB();

// Stripe webhook (must come before express.json())
app.post('/api/webhook', express.raw({ type: 'application/json' }), StripeWebhook);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('QuickGPT Backend is running!');
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter); // ← ONLY ONCE
app.use('/api/credit', creditsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});