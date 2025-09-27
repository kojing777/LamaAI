// controllers/webhooks.js - FIXED VERSION
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body.toString();
    
    console.log('🔵 Webhook Received - Type: payment_intent.succeeded');

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('✅ Event constructed:', event.type);
    } catch (error) {
        console.error('❌ Webhook signature failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        if (event.type === 'payment_intent.succeeded') {
            await handlePaymentIntentSucceeded(event);
        } else if (event.type === 'checkout.session.completed') {
            await handleCheckoutSessionCompleted(event);
        } else {
            console.log('⚡ Ignoring event type:', event.type);
        }

        res.json({ received: true });
        
    } catch (error) {
        console.error('💥 Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}

// FIXED: Handle payment_intent.succeeded
const handlePaymentIntentSucceeded = async (event) => {
    const paymentIntent = event.data.object;
    console.log('💳 Payment Intent Succeeded:', paymentIntent.id);

    // CRITICAL FIX: Get the checkout session that created this payment intent
    const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1
    });

    if (sessions.data.length === 0) {
        console.error('❌ No checkout session found for payment intent:', paymentIntent.id);
        return;
    }

    const session = sessions.data[0];
    console.log('📦 Found Checkout Session:', session.id);
    console.log('🔍 Session Metadata:', session.metadata);

    const { transactionId, appId } = session.metadata || {};
    
    if (!transactionId) {
        console.error('❌ No transactionId in session metadata');
        return;
    }

    if (appId !== 'quickgpt') {
        console.log('❌ Invalid appId - skipping');
        return;
    }

    await processPaymentSuccess(transactionId, session);
}

// Handle checkout.session.completed (alternative approach)
const handleCheckoutSessionCompleted = async (event) => {
    const session = event.data.object;
    console.log('💰 Checkout Session Completed:', session.id);
    
    const { transactionId, appId } = session.metadata || {};

    if (!transactionId || appId !== 'quickgpt') {
        console.log('❌ Invalid metadata - skipping');
        return;
    }

    await processPaymentSuccess(transactionId, session);
}

// Process successful payment
const processPaymentSuccess = async (transactionId, session) => {
    try {
        console.log('🔍 Processing transaction:', transactionId);
        
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.error('❌ Transaction not found:', transactionId);
            return;
        }

        if (transaction.isPaid) {
            console.log('⚠️ Transaction already paid - skipping');
            return;
        }

        console.log('👤 Updating user credits for:', transaction.userId);
        
        // Update user credits
        const updatedUser = await User.findByIdAndUpdate(
            transaction.userId,
            { $inc: { credits: transaction.credits } },
            { new: true }
        );

        if (!updatedUser) {
            console.error('❌ User not found:', transaction.userId);
            return;
        }

        // Mark transaction as paid
        transaction.isPaid = true;
        transaction.stripeSessionId = session.id;
        transaction.paidAt = new Date();
        await transaction.save();

        console.log('✅ Payment processed successfully!');
        console.log('📈 Credits added:', {
            userId: transaction.userId,
            creditsAdded: transaction.credits,
            newBalance: updatedUser.credits
        });

    } catch (error) {
        console.error('❌ Error processing payment:', error);
        throw error;
    }
}