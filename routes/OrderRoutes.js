import express from 'express'
import { firebaseAuth } from '../middlewares/firebaseAuth.js'
import {createOrder,getMyOrders} from '../controllers/orderController.js'


const router=express.Router()

  router.post('/',firebaseAuth,createOrder)
router.get('/myorders',firebaseAuth,getMyOrders)

export default router