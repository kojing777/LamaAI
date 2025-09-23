import express from 'express';
import { StripeWebhook } from '../controllers/webhooks.js';

const webhookRouter = express.Router();

webhookRouter.post('/', express.raw({ type: 'application/json' }), StripeWebhook);

export default webhookRouter;
