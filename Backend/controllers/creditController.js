import Transaction from "../models/Transaction.js"
import Stripe from "stripe";

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]


//API controller to get api plans 
export const getPlans = async (req, res) => {
    try {
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//exporting plans for external use
// controllers/creditController.js - ENSURING METADATA IS SET
export const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        const plan = plans.find(plan => plan._id === planId);
        
        if (!plan) {
            return res.json({ success: false, message: "Invalid plan ID" });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        });

        console.log('🛒 Created transaction:', transaction._id);

        const { origin } = req.headers;

        // Create Stripe checkout session WITH PROPER METADATA
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.name,
                            description: `${plan.credits} credits`
                        },
                        unit_amount: plan.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?payment=success&transactionId=${transaction._id}`,
            cancel_url: `${origin}/?payment=cancelled`,
            customer_email: req.user.email,
            // CRITICAL: Ensure metadata is properly set
            metadata: {
                transactionId: transaction._id.toString(),
                appId: 'quickgpt',
                userId: userId.toString(),
                planName: plan.name
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60
        });

        console.log('🔗 Stripe session created:', session.id);
        console.log('📋 Session metadata:', session.metadata); // Verify metadata

        res.json({ 
            success: true, 
            url: session.url,
            sessionId: session.id,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error('❌ Purchase error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}