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
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':{
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
                    return res.json({ received: true, message: 'Ignored event: Invalid App ID' });
                }
                break;
            }
            default:
                console.log('Unhandled event type', event.type);
        }
    
        res.json({ received: true });
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
        return res.status(500).send(`Webhook Error: ${error.message}`);
    }
}// controllers/webhooks.js - COPY PASTE THIS ENTIRE FILE
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeWebhook = async (req, res) => {
    console.log('=== 🎯 WEBHOOK RECEIVED ===');
    console.log('📅 Time:', new Date().toISOString());
    console.log('📋 Headers:', {
        'stripe-signature': req.headers['stripe-signature'] ? 'Present' : 'Missing',
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
    });

    const sig = req.headers['stripe-signature'];
    const rawBody = req.body.toString();

    let event;
    try {
        console.log('🔄 Constructing event with webhook secret...');
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('✅ Event constructed successfully');
        console.log('📝 Event Type:', event.type);
        console.log('🆔 Event ID:', event.id);
    } catch (error) {
        console.error('❌ Webhook signature verification FAILED');
        console.error('Error message:', error.message);
        console.error('Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
        return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }

    try {
        console.log('🔄 Processing event type:', event.type);
        
        if (event.type === 'checkout.session.completed') {
            console.log('🎯 Handling checkout.session.completed (PRIMARY)');
            await handleCheckoutSessionCompleted(event);
        }
        else if (event.type === 'payment_intent.succeeded') {
            console.log('🔧 Handling payment_intent.succeeded (BACKUP)');
            await handlePaymentIntentSucceeded(event);
        }
        else {
            console.log('👻 Ignoring event type:', event.type);
            return res.json({ received: true, message: 'Event ignored' });
        }

        console.log('✅ Webhook processing completed successfully');
        res.json({ received: true, message: 'Webhook processed successfully' });
        
    } catch (error) {
        console.error('💥 ERROR in webhook processing:');
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}

const handleCheckoutSessionCompleted = async (event) => {
    const session = event.data.object;
    
    console.log('💰 CHECKOUT SESSION COMPLETED DETAILS:');
    console.log('- Session ID:', session.id);
    console.log('- Payment Status:', session.payment_status);
    console.log('- Amount:', session.amount_total);
    console.log('- Currency:', session.currency);
    console.log('- Customer Email:', session.customer_email);
    console.log('- Full Metadata:', JSON.stringify(session.metadata, null, 2));

    const { transactionId, appId } = session.metadata || {};
    
    if (!transactionId) {
        console.error('❌ CRITICAL ERROR: No transactionId in metadata');
        console.error('Available metadata keys:', Object.keys(session.metadata || {}));
        throw new Error('No transactionId in session metadata');
    }

    if (appId !== 'quickgpt') {
        console.error('❌ Invalid appId:', appId);
        throw new Error('Invalid appId');
    }

    if (session.payment_status !== 'paid') {
        console.error('❌ Payment not completed. Status:', session.payment_status);
        throw new Error('Payment not completed');
    }

    await processPaymentSuccess(transactionId, session);
}

const handlePaymentIntentSucceeded = async (event) => {
    const paymentIntent = event.data.object;
    console.log('💳 PAYMENT INTENT SUCCEEDED (BACKUP):', paymentIntent.id);

    try {
        console.log('🔍 Searching for checkout session...');
        const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1
        });

        if (sessions.data.length === 0) {
            console.error('❌ No checkout session found for payment intent');
            return;
        }

        const session = sessions.data[0];
        console.log('📦 Found Checkout Session:', session.id);
        console.log('🔍 Session Metadata:', JSON.stringify(session.metadata, null, 2));

        const { transactionId, appId } = session.metadata || {};
        
        if (!transactionId || appId !== 'quickgpt') {
            console.error('❌ Invalid metadata in backup handler');
            return;
        }

        await processPaymentSuccess(transactionId, session);
    } catch (error) {
        console.error('❌ Error in backup handler:', error.message);
    }
}

const processPaymentSuccess = async (transactionId, session) => {
    console.log('🔍 PROCESSING PAYMENT SUCCESS:');
    console.log('- Transaction ID:', transactionId);
    console.log('- Session ID:', session.id);

    try {
        console.log('📊 Looking up transaction in database...');
        const transaction = await Transaction.findById(transactionId);
        
        if (!transaction) {
            console.error('❌ TRANSACTION NOT FOUND in database:', transactionId);
            throw new Error(`Transaction ${transactionId} not found`);
        }

        console.log('✅ Transaction found:', {
            id: transaction._id,
            userId: transaction.userId,
            amount: transaction.amount,
            credits: transaction.credits,
            isPaid: transaction.isPaid
        });

        if (transaction.isPaid) {
            console.log('⚠️ Transaction already paid - skipping');
            return;
        }

        console.log('👤 Updating user credits for user ID:', transaction.userId);
        
        const updatedUser = await User.findByIdAndUpdate(
            transaction.userId,
            { $inc: { credits: transaction.credits } },
            { new: true }
        );

        if (!updatedUser) {
            console.error('❌ USER NOT FOUND:', transaction.userId);
            throw new Error(`User ${transaction.userId} not found`);
        }

        transaction.isPaid = true;
        transaction.stripeSessionId = session.id;
        transaction.paidAt = new Date();
        await transaction.save();

        console.log('🎉 PAYMENT SUCCESSFULLY PROCESSED!');
        console.log('📈 Credits updated:');
        console.log('- User ID:', transaction.userId);
        console.log('- Credits added:', transaction.credits);
        console.log('- New credit balance:', updatedUser.credits);
        console.log('- Transaction marked as paid');

    } catch (error) {
        console.error('❌ ERROR processing payment success:');
        console.error('Error:', error.message);
        throw error;
    }
}

// Add test endpoint
export const testWebhook = async (req, res) => {
    try {
        console.log('🧪 Webhook test endpoint called');
        res.json({ 
            success: true, 
            message: 'Webhook endpoint is working!',
            timestamp: new Date().toISOString(),
            environment: {
                stripeSecret: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Add debug session endpoint
export const debugSession = async (req, res) => {
    try {
        const { sessionId } = req.query;
        
        if (!sessionId) {
            return res.json({ error: 'Please provide sessionId parameter' });
        }

        console.log('🔍 Debugging session:', sessionId);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        res.json({
            success: true,
            session: {
                id: session.id,
                metadata: session.metadata,
                payment_status: session.payment_status,
                status: session.status,
                amount_total: session.amount_total,
                currency: session.currency,
                customer_email: session.customer_email,
                payment_intent: session.payment_intent
            },
            metadataAnalysis: {
                hasMetadata: !!session.metadata,
                transactionId: session.metadata?.transactionId,
                appId: session.metadata?.appId,
                userId: session.metadata?.userId
            }
        });
    } catch (error) {
        console.error('Debug session error:', error);
        res.status(500).json({ error: error.message });
    }
}