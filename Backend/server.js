const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


// ===============================
// FRONTEND
// ===============================

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);


// ===============================
// API ROUTES
// ===============================

const couponRoutes =
  require("./routes/couponRoutes");

app.use(
  "/api/coupons",
  couponRoutes
);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../frontend/dashboard.html"
    )
  );

});


// ===============================
// MONGODB
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB Connected Successfully"
    );

    app.listen(
      process.env.PORT || 5000,
      () => {

        console.log(
          `Server running on http://localhost:${process.env.PORT || 5000}`
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB Connection Error:",
      error.message
    );

  });