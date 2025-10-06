import Product from '../models/productModels.js';
import { productValidationSchema } from '../models/productModels.js';

export const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Request body:', req.body);
    console.log('File uploaded:', req.file);
    console.log('User:', req.user?.email);

    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    // Determine image source: file upload or direct URL
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && (req.body.image.startsWith('http://') || req.body.image.startsWith('https://'))) {
      image = req.body.image;
    }

    if (!image) {
      console.error('No image provided');
      return res.status(400).json({ message: 'Image is required (file upload or valid URL)' });
    }

    // Validate request body with Joi
    const { error } = productValidationSchema.validate({
      ...req.body,
      image,
      subcategory: req.body.subcategory || '',
      subSubcategory: req.body.subSubcategory || '',
      origin: req.body.origin || '',
    });
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, price, description, category, brand, origin, countInStock, subcategory, subSubcategory } = req.body;

    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      category,
      brand,
      origin,
      countInStock: parseInt(countInStock),
      subcategory: subcategory || '',
      subSubcategory: subSubcategory || '',
      image,
      user: req.user.uid, // From firebaseAuth
    });

    const saved = await product.save();
    console.log('✅ Product created successfully:', saved._id);
    console.log('Product data:', {
      name: saved.name,
      price: saved.price,
      image: saved.image,
      category: saved.category
    });
    res.status(201).json({
      message: 'Product added successfully',
      product: saved,
    });
  } catch (error) {
    console.error('❌ Product creation error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log('Update request body:', req.body, 'File:', req.file); // Debug
    
    // Prepare validation data
    const validationData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || 'existing-image'),
      subcategory: req.body.subcategory || '',
      subSubcategory: req.body.subSubcategory || '',
      origin: req.body.origin || '',
    };
    
    console.log('Validation data:', validationData); // Debug
    
    const { error } = productValidationSchema.validate(validationData);
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, price, countInStock, description, category, brand, origin, subcategory, subSubcategory } = req.body;
    const updateFields = {
      name,
      price: parseFloat(price),
      countInStock: parseInt(countInStock),
      description,
      category,
      brand,
      origin,
      subcategory: subcategory || '',
      subSubcategory: subSubcategory || '',
    };

    // Only update image if a new file was uploaded
    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }
    // If no new image, keep the existing image (don't update the image field)

    const updated = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('✅ Product updated:', updated._id);
    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};