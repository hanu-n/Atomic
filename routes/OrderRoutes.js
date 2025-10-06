import express from 'express'
import { firebaseAuth } from '../middlewares/firebaseAuth.js'
import {createOrder,getMyOrders,getAllOrders,markOrderAsSeen} from '../controllers/orderController.js'


const router=express.Router()

  router.post('/',firebaseAuth,createOrder)
router.get('/myorders',firebaseAuth,getMyOrders)

// GET all orders (admin only)
router.get('/all', firebaseAuth, getAllOrders);

// PUT to mark order as seen
router.put('/:id/seen', firebaseAuth, markOrderAsSeen);
// router.get("/:id/receipt",firebaseAuth,generateReceipt)


export default router