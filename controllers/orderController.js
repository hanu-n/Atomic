import Order from '../models/Order.js'

export const createOrder=async (req,res)=>{
const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

if (orderItems || orderItems.length===0) {
        return res.status(400).json({ message: 'No order items' });

}

const order=new Order({
     user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
})

const createdOrder = await order.save()
  res.status(201).json(createdOrder);

}

export const getMyOrders=async()=>{
  const Orders=Order.find({ user: req.user.id })
  res.json(Orders)
}