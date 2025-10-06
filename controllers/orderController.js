import Order from '../models/Order.js'

export const createOrder=async (req,res)=>{
const {
    orderItems,
    shippingAddress,
    totalPrice,
  } = req.body;
  try{

if (orderItems || orderItems.length===0) {
        return res.status(400).json({ message: 'No order items' });

}

const order=new Order({
     user: req.user.id,
    orderItems,
    shippingAddress,
    totalPrice,
})

const createdOrder = await order.save()
  res.status(201).json(createdOrder);

  }
  catch(error){
        res.status(500).json({ message: "Failed to create orders" });

  }
}

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
