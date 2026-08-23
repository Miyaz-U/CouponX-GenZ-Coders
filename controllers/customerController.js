const User = require("../models/User")

// Get all customers
async function getCustomers(req, res) {
    try {
        const customers = await User.find(
            { role: "customer" },
            { name: 1, email: 1, mobile: 1, createdDate: 1 }
        ).sort({ createdDate: -1 })
        const data = customers.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.mobile || null,
            createdAt: u.createdDate
        }))
        res.status(200).json({ success: true, data })
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message })
    }
}

module.exports = { getCustomers }
