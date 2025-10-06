import mongoose from "mongoose";
import Joi from "joi";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String },
    origin: { type: String, default: '' },
    category: { type: String, required: true },
    subcategory: { type: String, default: '' },
    subSubcategory: { type: String, default: '' },
    price: { type: Number },
    countInStock: { type: Number },
  },
  { timestamps: true }
);

// Joi validation schema
export const productValidationSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().optional(), // Made optional for updates
  description: Joi.string().required(),
  brand: Joi.string().optional(),
  origin: Joi.string().optional().allow(''),
  category: Joi.string().required(),
  subcategory: Joi.string().optional().allow(''),
  subSubcategory: Joi.string().optional().allow(''),
  price: Joi.number().optional(),
  countInStock: Joi.number().optional(),
});

const Product = mongoose.model("Product", productSchema);
export default Product;