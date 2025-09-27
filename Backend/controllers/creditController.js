import Transaction from "../models/Transaction.js";
import Stripe from "stripe";
import User from "../models/User.js";

const plans = [
  { _id: "basic", name: "Basic", price: 10, credits: 100 },
  { _id: "pro", name: "Pro", price: 20, credits: 500 },
  { _id: "premium", name: "Premium", price: 30, credits: 1000 },
];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPlans = async (req, res) => {
  res.json({ success: true, plans });
};

export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((p) => p._id === planId);
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan ID" });

    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const origin = req.headers.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: { name: plan.name },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancel`,
      metadata: { transactionId: transaction._id.toString(), appId: "quickgpt" },
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
