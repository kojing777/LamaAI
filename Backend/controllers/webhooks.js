import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { transactionId, appId } = session.metadata;

      if (!transactionId || appId !== "quickgpt") return res.json({ received: true });

      const transaction = await Transaction.findById(transactionId);
      if (!transaction || transaction.isPaid) return res.json({ received: true });

      // Update user credits
      await User.findByIdAndUpdate(transaction.userId, { $inc: { credits: transaction.credits } });

      // Mark transaction as paid
      transaction.isPaid = true;
      await transaction.save();

      console.log(`Transaction ${transaction._id} processed successfully`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
};
