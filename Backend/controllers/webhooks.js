// controllers/webhooks.js - CORRECTED VERSION
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { transactionId, appId } = session.metadata;

            if (appId !== 'quickgpt') {
                return res.json({ received: true, message: 'Ignored event: Invalid App ID' });
            }

            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                console.error('Transaction not found:', transactionId);
                return res.status(404).json({ error: 'Transaction not found' });
            }

            if (transaction.isPaid) {
                return res.json({ received: true, message: 'Transaction already processed' });
            }

            // Update user credits and mark transaction as paid
            await User.findByIdAndUpdate(transaction.userId, { 
                $inc: { credits: transaction.credits } 
            });

            transaction.isPaid = true;
            await transaction.save();

            console.log(`Payment successful for transaction: ${transactionId}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}