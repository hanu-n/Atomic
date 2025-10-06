import express from "express";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import paypalClient from "../utils/paypal.js";
import Order from "../models/Order.js";
import { firebaseAuth } from '../middlewares/firebaseAuth.js'

const router = express.Router();

// Create PayPal order
router.post("/create-order", async (req, res) => {
  const { total } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log("✅ PayPal order created:", order.result.id);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("❌ PayPal create-order error:", err.message || err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// Capture PayPal payment & save order in DB
router.post("/capture-order", firebaseAuth, async (req, res) => {
  const { orderID, orderItems, shippingAddress, totalPrice } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);

    // Save order in MongoDB after successful capture
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: capture.result,
    });

    const createdOrder = await order.save();

    res.json({ capture: capture.result, order: createdOrder });
  } catch (err) {
    console.error("❌ Capture failed:", err.message || err);
    res.status(500).json({ error: err.message || "Capture failed" });
  }
});

export default router;
