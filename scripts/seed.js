const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "../.env") })

mongoose.connect(process.env.MONGODB_URI).then(async function () {
  console.log("Connected. Seeding...")

  // Same Category schema as in server.js
  const Category = mongoose.model("Category", new mongoose.Schema({
    name: String, description: String, image: String
  }), "Categories")

  // Same Product schema as in server.js
  const Product = mongoose.model("Product", new mongoose.Schema({
    name: String, description: String, price: Number,
    category: String, brand: String, stock: Number,
    image: String, isDeal: Boolean, dealPrice: Number, dealDiscountPercent: Number
  }), "Products")

  // Same Coupon schema as in server.js
  const Coupon = mongoose.model("Coupon", new mongoose.Schema({
    code: String, discountType: String, discountValue: Number,
    minPurchaseAmount: Number, maxDiscountAmount: Number, expiryDate: Date,
    usageLimit: Number, usedCount: Number, status: String
  }), "Coupons")

  await Category.deleteMany({})
  await Product.deleteMany({})
  await Coupon.deleteMany({})

  await Category.insertMany([
    { name: "Laptops", description: "Portable computers", image: "images/categories/Laptops.jpeg" },
    { name: "Accessories", description: "Computer accessories", image: "images/categories/Accessories.jpeg" },
    { name: "Mobiles", description: "Smartphones", image: "images/categories/Mobiles.jpeg" },
    { name: "Audio", description: "Headphones and speakers", image: "images/categories/Audio.jpeg" },
    { name: "Wearables", description: "Smartwatches and fitness bands", image: "images/categories/Wearables.jpeg" },
    { name: "Gaming", description: "Gaming gear", image: "images/categories/Gaming.jpeg" },
    { name: "Cameras", description: "Digital cameras and accessories", image: "images/categories/Cameras.jpeg" },
    { name: "Home Appliances", description: "Everyday household appliances", image: "images/categories/HomeAppliances.jpeg" },
    { name: "Tablets", description: "Tablets and e-readers", image: "images/categories/Tablets.jpeg" },
    { name: "Networking", description: "Routers, extenders and networking gear", image: "images/categories/Networking.jpeg" },
    { name: "Storage", description: "External drives and memory cards", image: "images/categories/Storage.jpeg" }
  ])

  await Product.insertMany([
    { name: "Dell Inspiron 15", description: "15 inch laptop", price: 50000, category: "Laptops", brand: "Dell", stock: 10, image: "images/products/DellInspiron15.jpeg", isDeal: true, dealPrice: 45000, dealDiscountPercent: 10 },
    { name: "HP Pavilion 14", description: "14 inch slim laptop", price: 55000, category: "Laptops", brand: "HP", stock: 12, image: "images/products/HPPavilion14.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Lenovo IdeaPad Slim 3", description: "Lightweight everyday laptop", price: 42000, category: "Laptops", brand: "Lenovo", stock: 8, image: "images/products/LenovoIdeaPadSlim3.jpeg", isDeal: true, dealPrice: 37800, dealDiscountPercent: 10 },
    { name: "Asus ROG Strix G15", description: "Gaming laptop with RTX graphics", price: 85000, category: "Laptops", brand: "Asus", stock: 6, image: "images/products/AsusROGStrixG15.jpeg", isDeal: true, dealPrice: 76500, dealDiscountPercent: 10 },
    { name: "Apple MacBook Air M2", description: "13 inch laptop with M2 chip", price: 110000, category: "Laptops", brand: "Apple", stock: 5, image: "images/products/AppleMacbookAirM2.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Logitech Wireless Mouse", description: "Ergonomic wireless mouse", price: 1750, category: "Accessories", brand: "Logitech", stock: 50, image: "images/products/LogitechWirelessMouse.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Mechanical Keyboard", description: "RGB mechanical keyboard", price: 4000, category: "Accessories", brand: "HP", stock: 30, image: "images/products/MechanicalKeyboard.jpeg", isDeal: true, dealPrice: 3200, dealDiscountPercent: 20 },
    { name: "HD 1080p Webcam", description: "Full HD webcam", price: 2000, category: "Accessories", brand: "Logitech", stock: 25, image: "images/products/WebcamHD1080p.jpeg", isDeal: true, dealPrice: 1750, dealDiscountPercent: 30 },
    { name: "65W USB-C Charger", description: "Fast charging adapter", price: 1400, category: "Accessories", brand: "Dell", stock: 40, image: "images/products/65WUSBCCharger.jpeg", isDeal: true, dealPrice: 1275, dealDiscountPercent: 15 },
    { name: "USB-C Hub 7-in-1", description: "Multiport adapter for laptops", price: 2200, category: "Accessories", brand: "HP", stock: 45, image: "images/products/USBCHub7In1.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Anker Power Bank 20000mAh", description: "Fast charging portable power bank", price: 2800, category: "Accessories", brand: "Anker", stock: 50, image: "images/products/AnkerPowerBank20000mAh.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Phone Case + Screen Guard", description: "Combo protection kit", price: 1000, category: "Mobiles", brand: "HP", stock: 100, image: "images/products/PhoneCaseAndScreenGuard.jpeg", isDeal: true, dealPrice: 780, dealDiscountPercent: 22 },
    { name: "Samsung Galaxy M14", description: "Budget smartphone", price: 12000, category: "Mobiles", brand: "Samsung", stock: 35, image: "images/products/SamsungGalaxyM14.jpeg", isDeal: true, dealPrice: 10200, dealDiscountPercent: 15 },
    { name: "OnePlus Nord CE", description: "Mid-range smartphone", price: 20000, category: "Mobiles", brand: "OnePlus", stock: 18, image: "images/products/OnePlusNordCE.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "iPhone 14", description: "Apple smartphone with A15 chip", price: 65000, category: "Mobiles", brand: "Apple", stock: 10, image: "images/products/iPhone14.jpeg", isDeal: true, dealPrice: 59800, dealDiscountPercent: 8 },
    { name: "Realme Narzo 60", description: "Budget-friendly smartphone", price: 15000, category: "Mobiles", brand: "Realme", stock: 22, image: "images/products/RealmeNarzo60.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Sony Over-Ear Headphones", description: "Noise cancelling headphones", price: 6500, category: "Audio", brand: "Sony", stock: 20, image: "images/products/SonyOverEarHeadphones.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "JBL Bluetooth Speaker", description: "Portable wireless speaker", price: 3500, category: "Audio", brand: "JBL", stock: 40, image: "images/products/JBLBluetoothSpeaker.jpeg", isDeal: true, dealPrice: 2975, dealDiscountPercent: 15 },
    { name: "boAt Wired Earphones", description: "In-ear wired earphones", price: 500, category: "Audio", brand: "boAt", stock: 100, image: "images/products/boAtWiredEarphones.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Sony WH-1000XM5", description: "Premium noise cancelling headphones", price: 28000, category: "Audio", brand: "Sony", stock: 12, image: "images/products/SonyWH1000XM5.jpeg", isDeal: true, dealPrice: 25200, dealDiscountPercent: 10 },
    { name: "Boat Rockerz 450", description: "Wireless on-ear headphones", price: 1500, category: "Audio", brand: "boAt", stock: 60, image: "images/products/BoatRockerz450.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Fitbit Smartwatch", description: "Fitness tracking smartwatch", price: 8200, category: "Wearables", brand: "Fitbit", stock: 15, image: "images/products/FitbitSmartwatch.jpeg", isDeal: true, dealPrice: 6150, dealDiscountPercent: 25 },
    { name: "Noise ColorFit Pro", description: "Smartwatch with heart rate monitor", price: 3200, category: "Wearables", brand: "Noise", stock: 25, image: "images/products/NoiseColorFitPro.jpeg", isDeal: true, dealPrice: 2560, dealDiscountPercent: 20 },
    { name: "Mi Band 8", description: "Fitness band with AMOLED display", price: 2500, category: "Wearables", brand: "Xiaomi", stock: 30, image: "images/products/MiBand8.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Apple Watch SE", description: "Smartwatch with fitness tracking", price: 29000, category: "Wearables", brand: "Apple", stock: 9, image: "images/products/AppleWatchSE.jpeg", isDeal: true, dealPrice: 26100, dealDiscountPercent: 10 },
    { name: "Samsung Galaxy Watch 6", description: "Advanced health tracking smartwatch", price: 24000, category: "Wearables", brand: "Samsung", stock: 11, image: "images/products/SamsungGalaxyWatch6.jpg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Wireless Game Controller", description: "Bluetooth game controller", price: 3000, category: "Gaming", brand: "HP", stock: 20, image: "images/products/WirelessGameController.jpeg", isDeal: true, dealPrice: 2460, dealDiscountPercent: 18 },
    { name: "Logitech Gaming Headset", description: "Over-ear headset with mic", price: 4500, category: "Gaming", brand: "Logitech", stock: 15, image: "images/products/LogitechGamingHeadset.jpeg", isDeal: true, dealPrice: 3825, dealDiscountPercent: 15 },
    { name: "Razer Gaming Mouse", description: "High DPI gaming mouse", price: 3800, category: "Gaming", brand: "Razer", stock: 20, image: "images/products/RazerGamingMouse.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Sony DualSense Controller", description: "Wireless controller for PS5", price: 5500, category: "Gaming", brand: "Sony", stock: 18, image: "images/products/SonyDualSenseController.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Logitech G Pro Gaming Keyboard", description: "Mechanical keyboard for esports", price: 9500, category: "Gaming", brand: "Logitech", stock: 14, image: "images/products/LogitechGProGamingKeyboard.jpeg", isDeal: true, dealPrice: 8075, dealDiscountPercent: 15 },

    { name: "Canon EOS 1500D", description: "Entry-level DSLR camera", price: 38000, category: "Cameras", brand: "Canon", stock: 7, image: "images/products/CanonEOS1500D.jpeg", isDeal: true, dealPrice: 34200, dealDiscountPercent: 10 },
    { name: "GoPro Hero 11", description: "Waterproof action camera", price: 32000, category: "Cameras", brand: "GoPro", stock: 9, image: "images/products/GoProHero11.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Nikon D3500 Camera Bag", description: "Padded camera carry bag", price: 1800, category: "Cameras", brand: "Nikon", stock: 30, image: "images/products/NikonD3500CameraBag.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },

    { name: "Philips Air Fryer", description: "Digital air fryer, 4.1L", price: 7500, category: "Home Appliances", brand: "Philips", stock: 16, image: "images/products/PhilipsAirFryer.jpeg", isDeal: true, dealPrice: 6375, dealDiscountPercent: 15 },
    { name: "Prestige Mixer Grinder", description: "750W mixer grinder with 3 jars", price: 3200, category: "Home Appliances", brand: "Prestige", stock: 24, image: "images/products/PrestigeMixerGrinder.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Havells Room Heater", description: "Compact fan room heater", price: 2100, category: "Home Appliances", brand: "Havells", stock: 20, image: "images/products/HavellsRoomHeater.jpeg", isDeal: true, dealPrice: 1785, dealDiscountPercent: 15 },

    { name: "Samsung Galaxy Tab A9", description: "10.1 inch Android tablet", price: 18000, category: "Tablets", brand: "Samsung", stock: 13, image: "images/products/SamsungGalaxyTabA9.jpeg", isDeal: true, dealPrice: 15300, dealDiscountPercent: 15 },
    { name: "Apple iPad 10th Gen", description: "10.9 inch tablet with A14 chip", price: 45000, category: "Tablets", brand: "Apple", stock: 8, image: "images/products/AppleiPad10thGen.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Lenovo Tab M10", description: "Budget-friendly Android tablet", price: 12000, category: "Tablets", brand: "Lenovo", stock: 17, image: "images/products/LenovoTabM10.jpeg", isDeal: true, dealPrice: 10200, dealDiscountPercent: 15 },

    { name: "TP-Link AX1500 Router", description: "Dual band Wi-Fi 6 router", price: 3500, category: "Networking", brand: "TP-Link", stock: 22, image: "images/products/TPLinkAX1500Router.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Netgear Wi-Fi Extender", description: "Range extender for home Wi-Fi", price: 2200, category: "Networking", brand: "Netgear", stock: 28, image: "images/products/NetgearWiFiExtender.jpeg", isDeal: true, dealPrice: 1870, dealDiscountPercent: 15 },

    { name: "SanDisk 128GB Pen Drive", description: "USB 3.0 flash drive", price: 900, category: "Storage", brand: "SanDisk", stock: 80, image: "images/products/SanDisk128GBPenDrive.jpeg", isDeal: true, dealPrice: 765, dealDiscountPercent: 15 },
    { name: "Seagate 1TB External HDD", description: "Portable external hard drive", price: 4500, category: "Storage", brand: "Seagate", stock: 26, image: "images/products/Seagate1TBExternalHDD.jpeg", isDeal: false, dealPrice: null, dealDiscountPercent: null },
    { name: "Samsung 256GB microSD Card", description: "High speed microSD memory card", price: 1600, category: "Storage", brand: "Samsung", stock: 55, image: "images/products/Samsung256GBMicroSDCard.jpeg", isDeal: true, dealPrice: 1360, dealDiscountPercent: 15 }
  ])

  await Coupon.insertMany([
    { code: "SUMMER20", discountType: "percentage", discountValue: 20, minPurchaseAmount: 1000, maxDiscountAmount: null, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), usageLimit: null, usedCount: 0, status: "active" },
    { code: "WEEKEND15", discountType: "percentage", discountValue: 15, minPurchaseAmount: 2000, maxDiscountAmount: null, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), usageLimit: null, usedCount: 0, status: "active" },
    { code: "FLASH500", discountType: "flat", discountValue: 500, minPurchaseAmount: 5000, maxDiscountAmount: null, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), usageLimit: null, usedCount: 0, status: "active" },
    { code: "NEW10", discountType: "percentage", discountValue: 10, minPurchaseAmount: 500, maxDiscountAmount: null, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), usageLimit: null, usedCount: 0, status: "active" }
  ])

  console.log("Seeding done!")
  mongoose.disconnect()
}).catch(function (err) {
  console.log("Error:", err)
})
