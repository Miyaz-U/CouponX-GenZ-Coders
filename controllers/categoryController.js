const Category = require("../models/Category")
const Product = require("../models/Product")

async function getCategories (req, res) {
    try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function getProductsByCategory (req, res) {
    try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    const products = await Product.find({ category: category.name })
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message })
  }
}

async function createCategory (req, res) {
    try {
    const newCategory = new Category(req.body)
    const saved = await newCategory.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message })
  }
}

module.exports = { getCategories, getProductsByCategory, createCategory }