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
                console.log(`Processing payment_intent.succeeded for payment: ${paymentIntent.id}`);
                
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                if (!sessionList.data || sessionList.data.length === 0) {
                    console.error(`No checkout session found for payment intent: ${paymentIntent.id}`);
                    return res.json({ received: true, message: 'No session found' });
                }

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                console.log(`Session metadata - transactionId: ${transactionId}, appId: ${appId}`);

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    if (!transaction) {
                        console.error(`Transaction not found or already paid: ${transactionId}`);
                        return res.json({ received: true, message: 'Transaction not found or already paid' });
                    }

                    console.log(`Found transaction: ${transaction._id}, credits: ${transaction.credits}`);

                    // Verify user exists before updating
                    const user = await User.findById(transaction.userId);
                    if (!user) {
                        console.error(`User not found: ${transaction.userId}`);
                        return res.json({ received: true, message: 'User not found' });
                    }

                    //update credits in user account and mark transaction as paid
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });

                    //mark transaction as paid
                    transaction.isPaid = true;
                    await transaction.save();

                    console.log(`Payment successful! User ${user._id} credited with ${transaction.credits} credits`);
                }
                else {
                    console.log(`Ignored event: Invalid app ID - ${appId}`);
                    return res.json({ received: true, message: 'Ignored event: Invalid App ID' });
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
        return res.status(500).send(`Webhook Error: ${error.message}`);
    }
}