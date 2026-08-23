const express = require("express")
const router = express.Router()
const { getCategories, getProductsByCategory, createCategory } = require("../controllers/categoryController")
 
router.get("/", getCategories)
router.get("/:id/products", getProductsByCategory)
router.post("/", createCategory)

module.exports = router