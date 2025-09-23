import express from 'express';
import { getPlans, purchasePlan, verifyTransaction, manualVerifyPayment, getUserTransactions } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditsRouter = express.Router();

creditsRouter.get('/plan', getPlans);
creditsRouter.post('/purchase', protect, purchasePlan);
creditsRouter.get('/verify-transaction', verifyTransaction);
creditsRouter.post('/manual-verify', manualVerifyPayment);
creditsRouter.get('/transactions', protect, getUserTransactions);


export default creditsRouter;