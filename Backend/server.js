const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// ===============================
// IMAGE URLS
// ===============================

const images = {
  laptop:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",

  laptop2:
    "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800",

  phone:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",

  phone2:
    "https://images.unsplash.com/photo-1592286927505-2fdc9d6c7d7e?w=800",

  headphone:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",

  headphone2:
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",

  mouse:
    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",

  keyboard:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",

  monitor:
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",

  gaming:
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",

  watch:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
};


// ===============================
// 28 PRODUCTS
// ===============================

const products = [

  {
    _id: "1",
    name: "Apple MacBook Air M3",
    category: "Laptops",
    price: 89999,
    originalPrice: 109999,
    image: "/images/1-macbook-air.jpg"
  },

  {
    _id: "2",
    name: "Dell Inspiron 15",
    category: "Laptops",
    price: 59999,
    originalPrice: 69999,
    image: "/images/2-dell-inspiron.jpg"
  },

  {
    _id: "3",
    name: "HP Pavilion Laptop",
    category: "Laptops",
    price: 64999,
    originalPrice: 74999,
    image: "/images/3-hp-pavilion.jpg"
  },

  {
    _id: "4",
    name: "ASUS Vivobook 15",
    category: "Laptops",
    price: 54999,
    originalPrice: 64999,
    image: "/images/4-asus-vivobook.jpg"
  },


  {
    _id: "5",
    name: "Samsung Galaxy",
    category: "Phones",
    price: 74999,
    originalPrice: 79999,
    image: "/images/5-samsung-galaxy.jpg"
  },

  {
    _id: "6",
    name: "iPhone 16",
    category: "Phones",
    price: 69999,
    originalPrice: 79999,
    image: "/images/6-iphone-16.jpg"
  },

  {
    _id: "7",
    name: "Google Pixel",
    category: "Phones",
    price: 64999,
    originalPrice: 74999,
    image: "/images/7-google-pixel.jpg"
  },

  {
    _id: "8",
    name: "OnePlus Smartphone",
    category: "Phones",
    price: 59999,
    originalPrice: 69999,
    image: "/images/8-oneplus.jpg"
  },


  {
    _id: "9",
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 24999,
    originalPrice: 29999,
    image: "/images/9-sony-wh-1000xm5.jpg"
  },

  {
    _id: "10",
    name: "Apple AirPods Pro",
    category: "Audio",
    price: 18999,
    originalPrice: 24999,
    image: "/images/10-apple-airpods-pro.jpg"
  },

  {
    _id: "11",
    name: "JBL Headphones",
    category: "Audio",
    price: 7999,
    originalPrice: 9999,
    image: "/images/11-jbl-headphones.jpg"
  },

  {
    _id: "12",
    name: "Bose Headphones",
    category: "Audio",
    price: 22999,
    originalPrice: 27999,
    image: "/images/12-bose-headphones.jpg"
  },


  {
    _id: "13",
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 6999,
    originalPrice: 8999,
    image: "/images/13-logitech-mx-master-3s.jpg"
  },

  {
    _id: "14",
    name: "Wireless Keyboard",
    category: "Accessories",
    price: 2999,
    originalPrice: 3999,
    image: "/images/14-wireless-keyboard.jpg"
  },

  {
    _id: "15",
    name: "USB-C Hub",
    category: "Accessories",
    price: 2499,
    originalPrice: 3499,
    image: "/images/15-usb-c-hub.jpg"
  },

  {
    _id: "16",
    name: "Apple Magic Mouse",
    category: "Accessories",
    price: 6999,
    originalPrice: 7999,
    image: "/images/16-apple-magic-mouse.jpg"
  },


  {
    _id: "17",
    name: "ASUS Gaming Monitor",
    category: "Monitors",
    price: 21999,
    originalPrice: 25999,
    image: "/images/17-asus-gaming-monitor.jpg"
  },

  {
    _id: "18",
    name: "LG UltraGear Monitor",
    category: "Monitors",
    price: 16999,
    originalPrice: 19999,
    image: "/images/18-lg-ultragear-monitor.jpg"
  },

  {
    _id: "19",
    name: "Samsung Odyssey",
    category: "Monitors",
    price: 24999,
    originalPrice: 29999,
    image: "/images/19-samsung-odyssey.jpg"
  },

  {
    _id: "20",
    name: "Acer Gaming Monitor",
    category: "Monitors",
    price: 18999,
    originalPrice: 22999,
    image: "/images/20-acer-gaming-monitor.jpg"
  },


  {
    _id: "21",
    name: "Mechanical Gaming Keyboard",
    category: "Gaming",
    price: 4999,
    originalPrice: 6999,
    image: "/images/21-mechanical-gaming-keyboard.jpg"
  },

  {
    _id: "22",
    name: "Razer Gaming Mouse",
    category: "Gaming",
    price: 5999,
    originalPrice: 7999,
    image: "/images/22-razer-gaming-mouse.jpg"
  },

  {
    _id: "23",
    name: "Gaming Headset",
    category: "Gaming",
    price: 7999,
    originalPrice: 9999,
    image: "/images/23-razer-gaming-headset.jpg"
  },

  {
    _id: "24",
    name: "PlayStation Controller",
    category: "Gaming",
    price: 5999,
    originalPrice: 6999,
    image: "/images/24-playstation-controller.jpg"
  },


  {
    _id: "25",
    name: "External SSD",
    category: "Accessories",
    price: 7499,
    originalPrice: 8999,
    image: "/images/25-external-ssd.jpg"
  },

  {
    _id: "26",
    name: "Portable Storage",
    category: "Accessories",
    price: 6999,
    originalPrice: 8499,
    image: "/images/26-portable-storage.jpg"
  },

  {
    _id: "27",
    name: "Smart Speaker",
    category: "Audio",
    price: 4499,
    originalPrice: 5499,
    image: "/images/27-smart-speaker.jpg"
  },

  {
    _id: "28",
    name: "Apple Smart Watch",
    category: "Accessories",
    price: 42999,
    originalPrice: 49999,
    image: "/images/28-apple-smart-watch.jpg"
  }

];


// ===============================
// CATEGORIES
// ===============================

const categories = [
  {
    name: "Laptops",
    icon: "laptop"
  },
  {
    name: "Phones",
    icon: "smartphone"
  },
  {
    name: "Audio",
    icon: "headphones"
  },
  {
    name: "Accessories",
    icon: "mouse"
  },
  {
    name: "Gaming",
    icon: "gamepad-2"
  },
  {
    name: "Monitors",
    icon: "monitor"
  }
];


// ===============================
// CART
// ===============================

let cart = [];


// ===============================
// API
// ===============================

app.get("/api/categories", (req, res) => {
  res.json(categories);
});


app.get("/api/products", (req, res) => {
  res.json(products);
});


app.get("/api/products/featured", (req, res) => {
  res.json(products.slice(0, 8));
});


app.get("/api/products/deals", (req, res) => {
  res.json(products.slice(8, 28));
});


app.get(
  "/api/products/category/:category",
  (req, res) => {

    const category =
      req.params.category.toLowerCase();

    const result =
      products.filter(
        product =>
          product.category.toLowerCase() ===
          category
      );

    res.json(result);
  }
);


// ===============================
// CART
// ===============================

app.get("/api/cart", (req, res) => {

  const result = cart.map(item => {

    const product =
      products.find(
        p => p._id === item.productId
      );

    return {
      productId: item.productId,
      quantity: item.quantity,
      product
    };

  });

  res.json(result);
});


app.post("/api/cart", (req, res) => {

  const {
    productId,
    quantity = 1
  } = req.body;

  const product =
    products.find(
      p => p._id === productId
    );

  if (!product) {

    return res.status(404).json({
      message: "Product not found"
    });

  }

  const existing =
    cart.find(
      item =>
        item.productId === productId
    );

  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      productId,
      quantity
    });

  }

  res.json({
    message: "Added to cart",
    cart
  });

});


app.put(
  "/api/cart/:productId",
  (req, res) => {

    const {
      productId
    } = req.params;

    const {
      quantity
    } = req.body;

    const item =
      cart.find(
        item =>
          item.productId === productId
      );

    if (!item) {

      return res.status(404).json({
        message: "Cart item not found"
      });

    }

    if (quantity <= 0) {

      cart =
        cart.filter(
          item =>
            item.productId !== productId
        );

    } else {

      item.quantity = quantity;

    }

    res.json({
      message: "Cart updated"
    });

  }
);


app.delete(
  "/api/cart/:productId",
  (req, res) => {

    const {
      productId
    } = req.params;

    cart =
      cart.filter(
        item =>
          item.productId !== productId
      );

    res.json({
      message: "Removed from cart"
    });

  }
);


// ===============================
// FRONTEND
// ===============================

app.use((req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );

});


// ===============================
// START
// ===============================

app.listen(PORT, () => {

  console.log(
    `CouponX running at http://localhost:${PORT}`
  );

});