// ===============================
// DEAL PRODUCTS
// ===============================

const deals = [

    {
        id: 1,
        name: "Dell Inspiron 15 Laptop",
        category: "Electronics",
        originalPrice: 60000,
        dealPrice: 50000,
        discount: 17,
        coupon: "WELCOME10",
        image: "💻"
    },

    {
        id: 2,
        name: "Logitech Wireless Mouse",
        category: "Accessories",
        originalPrice: 2500,
        dealPrice: 2000,
        discount: 20,
        coupon: "SAVE500",
        image: "🖱️"
    },

    {
        id: 3,
        name: "HP Wireless Keyboard",
        category: "Accessories",
        originalPrice: 3000,
        dealPrice: 2200,
        discount: 27,
        coupon: "SAVE500",
        image: "⌨️"
    },

    {
        id: 4,
        name: "Samsung 24-inch Monitor",
        category: "Electronics",
        originalPrice: 18000,
        dealPrice: 14999,
        discount: 17,
        coupon: "WELCOME10",
        image: "🖥️"
    }

];


// ===============================
// DISPLAY DEALS
// ===============================

function displayDeals(productList) {

    const container =
        document.getElementById("dealsContainer");

    container.innerHTML = "";


    if (productList.length === 0) {

        container.innerHTML =
            "<p>No deals found.</p>";

        return;
    }


    productList.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "deal-card";


        card.innerHTML = `

            <div class="deal-image">

                <span class="discount-badge">
                    ${product.discount}% OFF
                </span>

                <div class="product-emoji">
                    ${product.image}
                </div>

            </div>


            <div class="deal-content">

                <p class="deal-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.name}
                </h3>


                <div class="deal-price">

                    <span class="new-price">
                        ₹${product.dealPrice.toLocaleString("en-IN")}
                    </span>

                    <span class="old-price">
                        ₹${product.originalPrice.toLocaleString("en-IN")}
                    </span>

                </div>


                <p class="coupon-text">
                    Use Coupon:
                    <strong>${product.coupon}</strong>
                </p>


                <button
                    class="add-cart-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// ===============================
// FILTER DEALS
// ===============================

function filterDeals(category) {

    const filtered =
        deals.filter(
            product =>
                product.category === category
        );

    displayDeals(filtered);
}


// ===============================
// SHOW ALL DEALS
// ===============================

function showAllDeals() {

    displayDeals(deals);
}


// ===============================
// SEARCH DEALS
// ===============================

function searchDeals() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filtered =
        deals.filter(product =>

            product.name
                .toLowerCase()
                .includes(search)

            ||

            product.category
                .toLowerCase()
                .includes(search)

        );


    displayDeals(filtered);
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {

    const product =
        deals.find(item => item.id === id);


    if (!product) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("couponXCart")
        ) || [];


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity++;

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.dealPrice,

            quantity: 1

        });

    }


    localStorage.setItem(
        "couponXCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        `${product.name} added to cart!`
    );
}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("couponXCart")
        ) || [];


    let count = 0;


    cart.forEach(item => {

        count += item.quantity;

    });


    document.getElementById(
        "cartCount"
    ).textContent = `(${count})`;
}


// ===============================
// INITIAL LOAD
// ===============================

displayDeals(deals);

updateCartCount();