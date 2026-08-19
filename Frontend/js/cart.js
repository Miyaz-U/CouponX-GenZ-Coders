// ===============================
// CART PRODUCTS
// ===============================

let cart = JSON.parse(localStorage.getItem("couponXCart")) || [
    {
        id: 1,
        name: "Dell Inspiron 15 Laptop",
        price: 50000,
        quantity: 1
    },
    {
        id: 2,
        name: "Logitech Wireless Mouse",
        price: 2000,
        quantity: 1
    }
];
// ===============================
// COUPONS
// ===============================

const coupons = [
    {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minPurchase: 500,
        maxDiscount: 200,
        expiry: "2026-12-31",
        usageLimit: 100,
        used: 20,
        active: true
    },

    {
        code: "SAVE500",
        type: "flat",
        value: 500,
        minPurchase: 2000,
        maxDiscount: 500,
        expiry: "2026-12-31",
        usageLimit: 50,
        used: 10,
        active: true
    }
];


// Currently applied discount
let appliedDiscount = 0;


// ===============================
// CHANGE QUANTITY
// ===============================

function changeQuantity(id, change) {

    const product = cart.find(item => item.id === id);

    if (!product) {
        return;
    }

    product.quantity += change;

    // Minimum quantity = 1
    if (product.quantity < 1) {
        product.quantity = 1;
    }

    updateCart();
}


// ===============================
// REMOVE PRODUCT
// ===============================

function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();
}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(product => {

        const productTotal =
            product.price * product.quantity;

        subtotal += productTotal;

        totalItems += product.quantity;


        // Update quantity
        const quantityElement =
            document.getElementById(`quantity-${product.id}`);

        if (quantityElement) {
            quantityElement.textContent =
                product.quantity;
        }


        // Update product total
        const totalElement =
            document.getElementById(`total-${product.id}`);

        if (totalElement) {
            totalElement.textContent =
                formatCurrency(productTotal);
        }

    });


    // Update subtotal
    document.getElementById("subtotal").textContent =
        formatCurrency(subtotal);


    // Update cart count
    document.getElementById("cartCount").textContent =
        `(${totalItems})`;


    // Recalculate final total
    calculateFinalTotal(subtotal);
    
    localStorage.setItem(
    "couponXCart",
    JSON.stringify(cart)
);
}


// ===============================
// CALCULATE FINAL TOTAL
// ===============================

function calculateFinalTotal(subtotal) {

    // Discount cannot be greater than subtotal
    if (appliedDiscount > subtotal) {
        appliedDiscount = subtotal;
    }

    const finalAmount =
        subtotal - appliedDiscount;


    document.getElementById("discount").textContent =
        formatCurrency(appliedDiscount);

    document.getElementById("finalTotal").textContent =
        formatCurrency(finalAmount);
}


// ===============================
// APPLY COUPON
// ===============================

function applyCoupon() {

    const input =
        document.getElementById("couponCode");

    const message =
        document.getElementById("couponMessage");

    const code =
        input.value.trim().toUpperCase();


    // Empty coupon
    if (code === "") {

        message.textContent =
            "Please enter a coupon code.";

        message.className = "error";

        return;
    }


    // Find coupon
    const coupon =
        coupons.find(item => item.code === code);


    // Coupon does not exist
    if (!coupon) {

        message.textContent =
            "Invalid coupon code.";

        message.className = "error";

        appliedDiscount = 0;

        updateCart();

        return;
    }


    // Check active status
    if (!coupon.active) {

        message.textContent =
            "This coupon is currently inactive.";

        message.className = "error";

        return;
    }


    // Check expiry
    const today =
        new Date();

    const expiryDate =
        new Date(coupon.expiry);


    if (today > expiryDate) {

        message.textContent =
            "This coupon has expired.";

        message.className = "error";

        return;
    }


    // Check usage limit
    if (coupon.used >= coupon.usageLimit) {

        message.textContent =
            "Coupon usage limit reached.";

        message.className = "error";

        return;
    }


    // Calculate subtotal
    let subtotal = 0;

    cart.forEach(product => {

        subtotal +=
            product.price * product.quantity;

    });


    // Minimum purchase validation
    if (subtotal < coupon.minPurchase) {

        message.textContent =
            `Minimum purchase should be ₹${coupon.minPurchase}.`;

        message.className = "error";

        return;
    }


    // ===========================
    // CALCULATE DISCOUNT
    // ===========================

    let discount = 0;


    if (coupon.type === "percentage") {

        discount =
            subtotal * coupon.value / 100;

        // Maximum discount
        if (discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }

    }

    else if (coupon.type === "flat") {

        discount = coupon.value;

    }


    appliedDiscount = discount;


    // Increment usage only after successful application
    coupon.used++;


    message.textContent =
        `Coupon ${coupon.code} applied successfully!`;

    message.className = "success";


    updateCart();
}


// ===============================
// CHECKOUT
// ===============================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    const finalTotal =
        document.getElementById("finalTotal").textContent;


    alert(
        `Proceeding to checkout.\nTotal Amount: ${finalTotal}`
    );
}


// ===============================
// FORMAT CURRENCY
// ===============================

function formatCurrency(amount) {

    return "₹" +
        amount.toLocaleString("en-IN");
}


// ===============================
// INITIAL LOAD
// ===============================

updateCart();