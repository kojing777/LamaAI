import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const StripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error(`Webhook Error: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log('Stripe event received:', JSON.stringify(event, null, 2));

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const { transactionId, appId } = session.metadata;
                console.log(`Processing checkout.session.completed for transactionId: ${transactionId} and appId: ${appId}`);


                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    if (transaction) {
                        console.log('Transaction found:', transaction._id);
                        // Update credits in user account
                        await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
                        console.log('User credits updated.');

                        // Mark transaction as paid
                        transaction.isPaid = true;
                        await transaction.save();
                        console.log('Transaction marked as paid.');
                    } else {
                        console.log('Transaction not found or already paid for transactionId:', transactionId);
                    }
                } else {
                    console.log(`Ignored event: Invalid App ID. Expected 'quickgpt', got '${appId}'`);
                }
                break;
            default:
                console.log('Unhandled event type', event.type);
        }
        res.json({ received: true });
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`, error);
        return res.status(500).send(`Webhook Error: ${error.message}`);
    }
}