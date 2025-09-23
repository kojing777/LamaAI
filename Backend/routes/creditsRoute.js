import express from 'express';
import { getPlans, purchasePlan } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditsRouter = express.Router();

creditsRouter.get('/plan', getPlans);
creditsRouter.post('/purchase', protect, purchasePlan);


export default creditsRouter;