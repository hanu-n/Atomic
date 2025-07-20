import express from 'express'
import { firebaseAuth } from '../middlewares/firebaseAuth'
import {createOrder,getMyOrders} from '../controllers/orderController'


const router=express.Router()

router.post('/',firebaseAuth,createOrder)
router.get('/myorders',firebaseAuth,getMyOrders)