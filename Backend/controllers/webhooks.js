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

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const { transactionId, appId } = session.metadata;

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    if (transaction) {
                        // Update credits in user account
                        await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });

                        // Mark transaction as paid
                        transaction.isPaid = true;
                        await transaction.save();
                    }
                } else {
                    console.log('Ignored event: Invalid App ID');
                }
                break;
            default:
                console.log('Unhandled event type', event.type);
        }
        res.json({ received: true });
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
        return res.status(500).send(`Webhook Error: ${error.message}`);
    }
}