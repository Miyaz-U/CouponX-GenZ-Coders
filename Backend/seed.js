const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(async function () {
  console.log("Connected. Seeding...")

  const Category = mongoose.model("Category", new mongoose.Schema({
    name: String, description: String, image: String
  }), "Categories")

  const Product = mongoose.model("Product", new mongoose.Schema({
    name: String, description: String, price: Number,
    category: String, brand: String, stock: Number,
    image: String, isDeal: Boolean, dealPrice: Number, dealDiscountPercent: Number
  }), "Products")

  await Category.deleteMany({})
  await Product.deleteMany({})

  await Category.insertMany([
    { name: "Laptops", description: "Portable computers", image: "" },
    { name: "Accessories", description: "Computer accessories", image: "" },
    { name: "Mobiles", description: "Smartphones", image: "" },
    { name: "Audio", description: "Headphones and speakers", image: "" },
    { name: "Wearables", description: "Smartwatches and fitness bands", image: "" },
    { name: "Gaming", description: "Gaming gear", image: "" }
  ])

  await Product.insertMany([
    { name: "Dell Inspiron 15", description: "15 inch laptop", price: 50000, category: "Laptops", brand: "Dell", stock: 10, image: "", isDeal: true, dealPrice: 45000, dealDiscountPercent: 10 },
    { name: "Logitech Wireless Mouse", description: "Ergonomic wireless mouse", price: 1750, category: "Accessories", brand: "Logitech", stock: 50, image: "", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Sony Over-Ear Headphones", description: "Noise cancelling headphones", price: 6500, category: "Audio", brand: "Sony", stock: 20, image: "", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Fitbit Smartwatch", description: "Fitness tracking smartwatch", price: 8200, category: "Wearables", brand: "Fitbit", stock: 15, image: "", isDeal: true, dealPrice: 6150, dealDiscountPercent: 25 },
    { name: "Mechanical Keyboard", description: "RGB mechanical keyboard", price: 4000, category: "Accessories", brand: "HP", stock: 30, image: "", isDeal: true, dealPrice: 3200, dealDiscountPercent: 20 },
    { name: "Webcam HD 1080p", description: "Full HD webcam", price: 2000, category: "Accessories", brand: "Logitech", stock: 25, image: "", isDeal: true, dealPrice: 1750, dealDiscountPercent: 30 },
    { name: "65W USB-C Charger", description: "Fast charging adapter", price: 1400, category: "Accessories", brand: "Dell", stock: 40, image: "", isDeal: true, dealPrice: 1275, dealDiscountPercent: 15 },
    { name: "Wireless Game Controller", description: "Bluetooth game controller", price: 3000, category: "Gaming", brand: "HP", stock: 20, image: "", isDeal: true, dealPrice: 2460, dealDiscountPercent: 18 },
    { name: "Phone Case + Screen Guard", description: "Combo protection kit", price: 1000, category: "Mobiles", brand: "HP", stock: 100, image: "", isDeal: true, dealPrice: 780, dealDiscountPercent: 22 }
  ])

  console.log("Seeding done!")
  mongoose.disconnect()
}).catch(function (err) {
  console.log("Error:", err)
})