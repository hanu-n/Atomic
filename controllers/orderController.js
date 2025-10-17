import Order from '../models/Order.js'
import User from '../models/User.js'

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // 🔍 Find the Mongo user by Firebase UID
    const mongoUser = await User.findOne({ firebaseUID: req.user.uid });
    if (!mongoUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 🛍️ Create new order linked to that user
    const order = new Order({
      user: mongoUser._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
};


// @desc Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email');
    res.json(orders);
  } catch (error) {
    console.error("❌ Failed to fetch all orders:", error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc Mark order as seen by admin
export const markOrderAsSeen = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isSeenByAdmin = true;
    order.seenAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// export const generateReceipt = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("user");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     createReceiptPDF(order, res); 
//   } catch (error) {
//     console.error("Error generating receipt:", error);
//     res.status(500).json({ message: "Failed to generate receipt" });
//   }
// };


