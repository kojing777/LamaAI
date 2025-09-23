import express from 'express';
import { getPlans, purchasePlan } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditsRouter = express.Router();

creditsRouter.post('/purchase', getPlans);
creditsRouter.get('/plans', protect, purchasePlan);

export default creditsRouter;