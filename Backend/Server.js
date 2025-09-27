import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditsRouter from './routes/creditsRoute.js';
import { StripeWebhook } from './controllers/webhooks.js';

const app = express();

//Database
await connectDB();

//Stripe webhook
app.post('/api/webhook',express.raw({type: 'application/json'}),StripeWebhook);

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello from Backend !!');
});
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/credit', creditsRouter);

//Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});