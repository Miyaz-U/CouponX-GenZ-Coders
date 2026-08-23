const express = require("express")
const router = express.Router()
const { register, login, resetPassword, getProfile } = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)
router.post("/reset-password", resetPassword)
router.post("/profile", getProfile)

module.exports = router