const Product = require("../models/Product")

// Get all products
async function getProducts (req, res) {
    try {
    const { category, minPrice, maxPrice, sort, search, brand } = req.query
    let filter = {}
    if (category) filter.category = category
    if (brand) filter.brand = brand
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }
    let sortOption = {}
    if (sort === "price_asc") sortOption.price = 1
    else if (sort === "price_desc") sortOption.price = -1
    else if (sort === "newest") sortOption._id = -1
    const products = await Product.find(filter).sort(sortOption)
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Get featured products
async function getFeaturedProducts (req, res) {
    try {
    const products = await Product.find().sort({ _id: -1 }).limit(8)
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Get deals
async function getDeals (req, res) {
    try {
    const deals = await Product.find({ isDeal: true })
    res.status(200).json(deals)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Get product by ID
async function getProductById (req, res) {
    try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

// Create a new product
async function createProduct (req, res) {
    try {
    const newProduct = new Product(req.body)
    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

// Update a product
async function updateProduct (req, res) {
    try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ message: "Product not found" })
    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

// Delete a product
async function deleteProduct (req, res) {
    try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Product not found" })
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

module.exports = { getProducts, getFeaturedProducts, getDeals, getProductById, createProduct, updateProduct, deleteProduct }