import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const StripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Signature:', sig);

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('✅ Webhook signature verified');
        console.log('Event type:', event.type);
        console.log('Event ID:', event.id);
    } catch (error) {
        console.error(`❌ Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object;
                console.log('💰 Processing payment_intent.succeeded for:', paymentIntent.id);
                console.log('Payment Intent details:', {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    status: paymentIntent.status
                });
                
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                console.log('🔍 Found', sessionList.data.length, 'checkout sessions');

                if (sessionList.data.length === 0) {
                    console.log('❌ No checkout session found for payment intent:', paymentIntent.id);
                    return res.json({ received: true, message: 'No checkout session found' });
                }

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                console.log('📋 Session metadata:', { transactionId, appId });
                console.log('📋 Full session details:', {
                    id: session.id,
                    payment_status: session.payment_status,
                    metadata: session.metadata
                });

                if (appId === 'quickgpt') {
                    console.log('🔍 Looking for transaction:', transactionId);
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    if (!transaction) {
                        console.log('❌ Transaction not found or already paid:', transactionId);
                        // Let's also check if it exists but is already paid
                        const existingTransaction = await Transaction.findById(transactionId);
                        if (existingTransaction) {
                            console.log('📄 Transaction exists but isPaid =', existingTransaction.isPaid);
                        } else {
                            console.log('📄 Transaction does not exist in database');
                        }
                        return res.json({ received: true, message: 'Transaction not found or already paid' });
                    }

                    console.log('💳 Processing payment for transaction:', {
                        transactionId: transaction._id,
                        userId: transaction.userId,
                        credits: transaction.credits,
                        amount: transaction.amount
                    });

                    //update credits in user account and mark transaction as paid
                    const userUpdateResult = await User.updateOne(
                        { _id: transaction.userId }, 
                        { $inc: { credits: transaction.credits } }
                    );
                    console.log('👤 User credits update result:', userUpdateResult);

                    //mark transaction as paid
                    transaction.isPaid = true;
                    const savedTransaction = await transaction.save();
                    console.log('✅ Transaction marked as paid:', savedTransaction._id);

                    console.log('🎉 Payment processed successfully for transaction:', transactionId);
                }
                else {
                    console.log('❌ Invalid App ID:', appId);
                    return res.json({ received: true, message: 'Ignored event: Invalid App ID' });
                }
                break;
            }
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('🛒 Checkout session completed:', session.id);
                console.log('Payment status:', session.payment_status);
                console.log('Metadata:', session.metadata);
                break;
            }
            default:
                console.log('🤷 Unhandled event type:', event.type);
        }
    
        console.log('✅ Webhook processed successfully');
        res.json({ received: true });
    } catch (error) {
        console.error(`❌ Error handling webhook event: ${error.message}`);
        console.error('Error stack:', error.stack);
        return res.status(500).send(`Webhook Error: ${error.message}`);
    }
}