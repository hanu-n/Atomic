import express from 'express'
import Product from '../models/productSchema.js'

const router=express.Router()

router.get('/',async(req,res)=>{
    try {
        const product=await Product.find({})
          res.json(product);
    } catch (error) {
         res.status(500).json({ message: "Failed to fetch products" });
    }
})

router.get('/:id',async(req,res)=>{
    try {
        const product=Product.findById(req.params.id)
        if (product) {
            res.json(product);
        }
            else { res.status(404).json({ message: "Product not found" });}
    } catch (error) {
         res.status(500).json({ message: "Error retrieving product" });
    }
})

export default router