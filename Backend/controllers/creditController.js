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
export const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        const plan = plans.find(plan => plan._id === planId);
        if (!plan) {
            return res.json({ success: false, message: "Invalid plan ID" });
        }
        //create a new transaction
        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        });

        const {origin} = req.headers;

        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({

            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: plan.price * 100,
                        product_data: {
                            name: plan.name,

                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?payment=success&transactionId=${transaction._id}`,
            cancel_url: `${origin}`,
            metadata: {
                transactionId: transaction._id.toString(),
                appId:'quickgpt'
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60 // 30 minutes from now
        });

        res.json({ success: true,url: session.url});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

