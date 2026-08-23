const express = require("express")
const router = express.Router()
const { getProducts, getFeaturedProducts, getDeals, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")
 
router.get("/featured", getFeaturedProducts)
router.get("/deals", getDeals)
 
router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

module.exports = router