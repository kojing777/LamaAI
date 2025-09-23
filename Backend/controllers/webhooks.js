import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { response } from "express";

export const StripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    //update credits in user account and mark transaction as paid
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });

                    //mark transaction as paid
                    transaction.isPaid = true;
                    await transaction.save();
                }
                else {
                    return res.json({ received: true, message: 'Ignored event: Invalid app' });
                }
                break;
            }
            default:
                console.log('Unhandled event type:', event.type);
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
         response.status(500).send(`Webhook Error: ${error.message}`);
    }
}