const express = require("express")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const couponRoutes = require("./routes/couponRoutes")
const orderRoutes = require("./routes/orderRoutes")
const customerRoutes = require("./routes/customerRoutes")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))

connectDB()

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/customers", customerRoutes)

// HOME PAGE REDIRECT
app.get("/", (req, res) => {
    res.redirect("/login.html")
})

// START SERVER
app.listen(PORT, function () {
    console.log(`CouponX server running at http://localhost:${PORT}`)
})
