
// ================= PRODUCT DATA =================
const PRODUCTS = [
    // LAPTOPS
    {
        id: "lap-1",
        title: "Dell Inspiron 15",
        category: "laptop",
        price: 48000
    },

    {
        id: "lap-2",
        title: "HP Pavilion 15",
        category: "laptop",
        price: 58000
    },

    {
        id: "lap-3",
        title: "Lenovo IdeaPad Slim 3",
        category: "laptop",
        price: 38000
    },

    {
        id: "lap-4",
        title: "ASUS Vivobook 15",
        category: "laptop",
        price: 42000
    },

    {
        id: "lap-5",
        title: "Acer Aspire 5",
        category: "laptop",
        price: 45000
    },

    {
        id: "lap-6",
        title: "Apple MacBook Air M2",
        category: "laptop",
        price: 99900
    },

    {
        id: "lap-7",
        title: "Samsung Galaxy Book",
        category: "laptop",
        price: 52000
    },

    {
        id: "lap-8",
        title: "MSI Modern 14",
        category: "laptop",
        price: 49000
    },
    // MOBILES

    {
        id: "mob-1",
        title: "Samsung Galaxy S24",
        category: "mobile",
        price: 65999
    },

    {
        id: "mob-2",
        title: "iPhone 15",
        category: "mobile",
        price: 57900
    },

    {
        id: "mob-3",
        title: "OnePlus 12",
        category: "mobile",
        price: 64999
    },

    {
        id: "mob-4",
        title: "Redmi Note 13 Pro",
        category: "mobile",
        price: 24999
    },

    {
        id: "mob-5",
        title: "Realme 12 Pro",
        category: "mobile",
        price: 23999
    },

    {
        id: "mob-6",
        title: "Vivo V30",
        category: "mobile",
        price: 33999
    },

    {
        id: "mob-7",
        title: "OPPO Reno 11",
        category: "mobile",
        price: 32999
    },

    {
        id: "mob-8",
        title: "Google Pixel 8",
        category: "mobile",
        price: 52999
    },


    // EARBUDS

    {
        id: "ear-1",
        title: "Apple AirPods Pro 2",
        category: "earbuds",
        price: 24900
    },

    {
        id: "ear-2",
        title: "Samsung Galaxy Buds 2 Pro",
        category: "earbuds",
        price: 14999
    },

    {
        id: "ear-3",
        title: "OnePlus Buds 3",
        category: "earbuds",
        price: 5999
    },

    {
        id: "ear-4",
        title: "Realme Buds Air 5",
        category: "earbuds",
        price: 3999
    },

    {
        id: "ear-5",
        title: "boAt Airdopes 141",
        category: "earbuds",
        price: 1499
    },

    {
        id: "ear-6",
        title: "JBL Wave Buds",
        category: "earbuds",
        price: 2499
    },

    {
        id: "ear-7",
        title: "Sony WF-C700N",
        category: "earbuds",
        price: 8990
    },

    {
        id: "ear-8",
        title: "Noise Buds VS104",
        category: "earbuds",
        price: 1299
    },

    // SMART WATCHES
    {
        id: "wat-1",
        title: "Apple Watch Series 9",
        category: "watch",
        price: 41900
    },

    {
        id: "wat-2",
        title: "Samsung Galaxy Watch 6",
        category: "watch",
        price: 29999
    },

    {
        id: "wat-3",
        title: "OnePlus Watch 2",
        category: "watch",
        price: 24999
    },

    {
        id: "wat-4",
        title: "Noise ColorFit Pro 5",
        category: "watch",
        price: 3499
    },

    {
        id: "wat-5",
        title: "boAt Wave Sigma",
        category: "watch",
        price: 1999
    },

    {
        id: "wat-6",
        title: "Fire-Boltt Phoenix",
        category: "watch",
        price: 1799
    },

    {
        id: "wat-7",
        title: "Amazfit GTR 4",
        category: "watch",
        price: 15999
    },

    {
        id: "wat-8",
        title: "Redmi Watch 4",
        category: "watch",
        price: 3999
    },


    // ACCESSORIES

    {
        id: "acc-1",
        title: "Logitech Wireless Mouse",
        category: "accessories",
        price: 699
    },

    {
        id: "acc-2",
        title: "HP Wireless Mouse",
        category: "accessories",
        price: 599
    },

    {
        id: "acc-3",
        title: "Dell Wireless Keyboard",
        category: "accessories",
        price: 1299
    },

    {
        id: "acc-4",
        title: "Logitech K380 Keyboard",
        category: "accessories",
        price: 2999
    },

    {
        id: "acc-5",
        title: "Razer DeathAdder Mouse",
        category: "accessories",
        price: 3499
    },

    {
        id: "acc-6",
        title: "Corsair Gaming Keyboard",
        category: "accessories",
        price: 8999
    },

    {
        id: "acc-7",
        title: "Lenovo Wireless Mouse",
        category: "accessories",
        price: 799
    },

    {
        id: "acc-8",
        title: "ASUS TUF Gaming Mouse",
        category: "accessories",
        price: 2499
    },


    // SPEAKERS

    {
        id: "spk-1",
        title: "JBL Flip 6",
        category: "speaker",
        price: 9999
    },

    {
        id: "spk-2",
        title: "Sony SRS-XB23",
        category: "speaker",
        price: 7999
    },

    {
        id: "spk-3",
        title: "boAt Stone 350",
        category: "speaker",
        price: 2499
    },

    {
        id: "spk-4",
        title: "Marshall Emberton II",
        category: "speaker",
        price: 12999
    },

    {
        id: "spk-5",
        title: "Bose SoundLink Flex",
        category: "speaker",
        price: 14900
    },

    {
        id: "spk-6",
        title: "Anker Soundcore 3",
        category: "speaker",
        price: 3999
    },

    {
        id: "spk-7",
        title: "Portronics SoundDrum",
        category: "speaker",
        price: 1999
    },

    {
        id: "spk-8",
        title: "Xiaomi Bluetooth Speaker",
        category: "speaker",
        price: 1499
    },


    // OTHER GADGETS

    {
        id: "oth-1",
        title: "Canon EOS R50",
        category: "other",
        price: 68999
    },

    {
        id: "oth-2",
        title: "Sony Alpha ZV-E10",
        category: "other",
        price: 64999
    },

    {
        id: "oth-3",
        title: "GoPro HERO12",
        category: "other",
        price: 39990
    },

    {
        id: "oth-4",
        title: "Amazon Fire TV Stick",
        category: "other",
        price: 3499
    },

    {
        id: "oth-5",
        title: "Google Chromecast",
        category: "other",
        price: 3999
    },

    {
        id: "oth-6",
        title: "Samsung T7 SSD",
        category: "other",
        price: 6999
    },

    {
        id: "oth-7",
        title: "SanDisk Portable SSD",
        category: "other",
        price: 5499
    },

    {
        id: "oth-8",
        title: "TP-Link Wi-Fi Router",
        category: "other",
        price: 1999
    }

];



// =====================================================
// CATEGORY STYLE
// =====================================================

const CATEGORY_STYLE = {

    laptop: {
        emoji: "💻",
        bg: "bg-sky-50",
        label: "Laptop"
    },

    mobile: {
        emoji: "📱",
        bg: "bg-blue-50",
        label: "Mobile"
    },

    earbuds: {
        emoji: "🎧",
        bg: "bg-pink-50",
        label: "Earbuds"
    },

    watch: {
        emoji: "⌚",
        bg: "bg-green-50",
        label: "Smart Watch"
    },

    accessories: {
        emoji: "🖱️",
        bg: "bg-orange-50",
        label: "Accessories"
    },

    speaker: {
        emoji: "🔊",
        bg: "bg-purple-50",
        label: "Speaker"
    },

    other: {
        emoji: "📷",
        bg: "bg-amber-50",
        label: "Gadget"
    }

};



// =====================================================
// DOM
// =====================================================

const dealsGrid =
    document.getElementById("dealsGrid");

const categoryFilter =
    document.getElementById("categoryFilter");

const searchInput =
    document.getElementById("searchInput");

const cartCount =
    document.getElementById("cartCount");

const statusRow =
    document.getElementById("statusRow");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");



// =====================================================
// CREATE DEALS
// =====================================================

function createDeal(product) {
    const discount =
        Math.floor(Math.random() * 16) + 50;

    const newPrice =
        Math.round(
            product.price -
            (product.price * discount / 100)
        );

    return {

        ...product,

        discount: discount,

        oldPrice: product.price,

        newPrice: newPrice,

        endTime:
            Date.now() +
            (8 * 60 * 60 * 1000)

    };
}
const deals =
    PRODUCTS.map(createDeal);



// =====================================================
// TODAY'S 9 DEALS
// =====================================================

// Exactly 9 products on first page

const TODAY_DEALS = [

    deals.find(p => p.id === "lap-1"),

    deals.find(p => p.id === "mob-1"),

    deals.find(p => p.id === "ear-1"),

    deals.find(p => p.id === "wat-1"),

    deals.find(p => p.id === "acc-1"),

    deals.find(p => p.id === "spk-1"),

    deals.find(p => p.id === "oth-1"),

    deals.find(p => p.id === "mob-4"),

    deals.find(p => p.id === "ear-5")

];



// =====================================================
// CART
// =====================================================

let cart = [];

// =====================================================
// SEARCH CATEGORY KEYWORDS
// =====================================================

const SEARCH_KEYWORDS = {

    laptop: [
        "laptop",
        "dell",
        "hp",
        "lenovo",
        "asus",
        "acer",
        "macbook",
        "msi",
        "galaxy book"
    ],

    mobile: [
        "mobile",
        "phone",
        "smartphone",
        "samsung galaxy s24",
        "iphone",
        "oneplus 12",
        "redmi",
        "realme",
        "vivo",
        "oppo",
        "pixel"
    ],

    earbuds: [
        "earbud",
        "earbuds",
        "airpods",
        "buds",
        "galaxy buds",
        "oneplus buds",
        "realme buds",
        "airdopes",
        "jbl wave",
        "sony wf",
        "noise buds"
    ],

    watch: [
        "watch",
        "smartwatch",
        "smart watch",
        "apple watch",
        "galaxy watch",
        "oneplus watch",
        "noisecolorfit",
        "boat wave",
        "fire-boltt",
        "amazfit",
        "redmi watch"
    ],

    accessories: [
        "mouse",
        "keyboard",
        "wireless mouse",
        "wireless keyboard",
        "logitech",
        "hp wireless mouse",
        "dell wireless keyboard",
        "razer",
        "corsair",
        "asus tuf gaming mouse"
    ],

    speaker: [
        "speaker",
        "speakers",
        "jbl flip",
        "sony srs",
        "boat stone",
        "marshall",
        "bose",
        "soundcore",
        "portronics sounddrum",
        "xiaomi bluetooth speaker"
    ],

    other: [
        "camera",
        "canon",
        "sony alpha",
        "gopro",
        "fire tv",
        "chromecast",
        "ssd",
        "sandisk",
        "samsung t7",
        "router",
        "tp-link"
    ]

};

// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts() {

    const selectedCategory =
        categoryFilter.value;

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    let products = [];


    // =================================================
    // NO SEARCH
    // =================================================

    if (search === "") {

        // ALL = show only today's 9 deals

        if (selectedCategory === "all") {

            products = [...TODAY_DEALS];

        }

        // CATEGORY = show all products
        // from selected category

        else {

            products =
                deals.filter(
                    product =>
                        product.category ===
                        selectedCategory
                );

        }

    }


    // =================================================
    // SEARCH ACTIVE
    // =================================================

    else {

        let detectedCategory = null;
        // ---------------------------------------------
        // CHECK WHICH CATEGORY THE SEARCH BELONGS TO
        // ---------------------------------------------

        for (
            const category in SEARCH_KEYWORDS
        ) {

            const keywords =
                SEARCH_KEYWORDS[category];


            const found =
                keywords.some(
                    keyword =>
                        search.includes(
                            keyword
                        )
                );


            if (found) {

                detectedCategory =
                    category;

                break;

            }

        }
        // ---------------------------------------------
        // CATEGORY FOUND
        // ---------------------------------------------

        if (detectedCategory !== null) {

            products =
                deals.filter(
                    product =>
                        product.category ===
                        detectedCategory
                );
        }
        // ---------------------------------------------
        // NO CATEGORY FOUND
        // ---------------------------------------------

        else {

            products =
                deals.filter(
                    product =>
                        product.title
                            .toLowerCase()
                            .includes(search)
                );

        }

    }
    // =================================================
    // IF CATEGORY FILTER + SEARCH BOTH USED
    // =================================================

    if (
        selectedCategory !== "all" &&
        search !== ""
    ) {

        products =
            products.filter(
                product =>
                    product.category ===
                    selectedCategory
            );
    }
    // =================================================
    // STATUS
    // =================================================

    if (
        selectedCategory === "all" &&
        search === ""
    ) {

        statusRow.textContent =
            "🔥 Today's Deals — 9 products";

    }

    else if (search !== "") {

        statusRow.textContent =
            `${products.length} ${getCategoryName(products, search)} product(s) found`;

    }

    else {

        statusRow.textContent =
            `${products.length} products available`;

    }
    // =================================================
    // NO RESULTS
    // =================================================

    if (products.length === 0) {

        dealsGrid.innerHTML = `

            <div
                class="col-span-full
                       text-center
                       py-16">

                <div class="text-5xl mb-3">
                    🔍
                </div>

                <h3
                    class="text-lg
                           font-semibold
                           text-gray-700">

                    No products found

                </h3>

                <p
                    class="text-sm
                           text-gray-400
                           mt-2">

                    Try another product or category.

                </p>

            </div>

        `;

        return;

    }
    // =================================================
    // DISPLAY
    // =================================================

    dealsGrid.innerHTML =
        products
            .map(productCard)
            .join("");


    updateProductTimers();

}
// =====================================================
// CATEGORY NAME
// =====================================================

function getCategoryName(products, search) {

    if (products.length === 0) {

        return "matching";

    }
    const category =
        products[0].category;


    const names = {

        laptop: "Laptop",

        mobile: "Mobile",

        earbuds: "Earbuds",

        watch: "Smart Watch",

        accessories: "Accessory",

        speaker: "Speaker",

        other: "Gadget"

    };

    return names[category] || "matching";

}
// =====================================================
// PRODUCT CARD
// =====================================================

function productCard(product) {

    const style =
        CATEGORY_STYLE[
            product.category
        ];


    return `

        <article
            class="bg-white
                   border border-gray-100
                   rounded-2xl
                   p-3
                   shadow-sm
                   hover:shadow-lg
                   hover:-translate-y-1
                   transition">


            <!-- IMAGE -->

            <div
                class="${style.bg}
                       h-36
                       rounded-xl
                       flex
                       items-center
                       justify-center
                       text-6xl
                       relative">


                <!-- DISCOUNT -->

                <span
                    class="absolute
                           top-2 left-2
                           bg-red-500
                           text-white
                           text-xs
                           font-bold
                           px-2 py-1
                           rounded-full">

                    ${product.discount}% OFF

                </span>


                ${style.emoji}

            </div>


            <!-- CATEGORY -->

            <p
                class="text-xs
                       text-gray-400
                       mt-3">

                ${style.label}

            </p>


            <!-- NAME -->

            <h3
                class="font-semibold
                       text-gray-800
                       text-sm
                       mt-1
                       min-h-[40px]">

                ${product.title}

            </h3>


            <!-- PRICE -->

            <div
                class="flex
                       items-center
                       gap-2
                       mt-3">

                <span
                    class="font-bold
                           text-gray-900">

                    ₹${product.newPrice
                        .toLocaleString("en-IN")}

                </span>


                <span
                    class="text-xs
                           text-gray-400
                           line-through">

                    ₹${product.oldPrice
                        .toLocaleString("en-IN")}

                </span>

            </div>


            <!-- ADD CART -->

            <button
                onclick="addToCart('${product.id}')"

                class="w-full
                       mt-3
                       bg-violet-600
                       hover:bg-violet-700
                       text-white
                       py-2
                       rounded-lg
                       text-sm
                       font-semibold">

                Add to Cart

            </button>


            <!-- TIMER -->

            <div
                class="text-xs
                       text-red-500
                       mt-3">

                🔥 Ends in

                <span
                    class="timer"
                    data-time="${product.endTime}">

                    00:00:00

                </span>

            </div>

        </article>

    `;

}



// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    const product =
        deals.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    // Check existing product

    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity++;

    }

    else {

        cart.push({

            ...product,

            quantity: 1

        });

    }
    updateCart();
    showNotification(
        `${product.title} added to cart 🛒`
    );

}
// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

    // Cart count

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    cartCount.textContent =
        totalQuantity;
    // Empty cart

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div
                class="text-center
                       py-16
                       text-gray-400">

                <div class="text-5xl mb-3">
                    🛒
                </div>

                <p>
                    Your cart is empty
                </p>

            </div>

        `;

        cartSubtotal.textContent =
            "₹0";

        return;

    }


    // Cart products

    cartItems.innerHTML =
        cart
            .map(cartItemHTML)
            .join("");


    // Subtotal

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (item.newPrice *
                 item.quantity),
            0
        );


    cartSubtotal.textContent =
        "₹" +
        subtotal.toLocaleString("en-IN");

}



// =====================================================
// CART ITEM
// =====================================================

function cartItemHTML(item) {

    const style =
        CATEGORY_STYLE[
            item.category
        ];


    return `

        <div
            class="flex
                   gap-3
                   border-b
                   pb-4
                   mb-4">
            <!-- ICON -->

            <div
                class="${style.bg}
                       w-16 h-16
                       rounded-lg
                       flex
                       items-center
                       justify-center
                       text-3xl
                       flex-shrink-0">

                ${style.emoji}

            </div>


            <!-- INFO -->

            <div class="flex-1">

                <h3
                    class="text-sm
                           font-semibold
                           text-gray-800">

                    ${item.title}

                </h3>


                <p
                    class="text-sm
                           font-bold
                           mt-1">

                    ₹${item.newPrice
                        .toLocaleString("en-IN")}
                </p>
                <!-- QUANTITY -->

                <div
                    class="flex
                           items-center
                           gap-3
                           mt-2">
                    <button
                        onclick="changeQuantity('${item.id}', -1)"

                        class="w-7 h-7
                               rounded
                               bg-gray-100">
                        −
                    </button>


                    <span
                        class="text-sm
                               font-semibold">

                        ${item.quantity}
                    </span>
                    <button
                        onclick="changeQuantity('${item.id}', 1)"

                        class="w-7 h-7
                               rounded
                               bg-gray-100"+
                    </button>
                    <button
                        onclick="removeFromCart('${item.id}')"

                        class="ml-auto
                               text-xs
                               text-red-500">

                        Remove

                    </button>

                </div>

            </div>

        </div>

    `;

}
// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(productId, amount) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    updateCart();

}
// =====================================================
// REMOVE CART ITEM
// =====================================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    updateCart();

}
// =====================================================
// OPEN CART
// =====================================================

function openCart() {

    cartOverlay.classList.remove(
        "hidden"
    );

}
// =====================================================
// CLOSE CART
// =====================================================

function closeCart() {

    cartOverlay.classList.add(
        "hidden"
    );

}
// =====================================================
// CLICK OUTSIDE CART
// =====================================================

cartOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            cartOverlay
        ) {

            closeCart();

        }

    }
);
// =====================================================
// SEARCH BUTTON
// =====================================================

function focusSearch() {

    searchInput.focus();

}
// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    displayProducts
);
// =====================================================
// CATEGORY FILTER
// =====================================================

categoryFilter.addEventListener(
    "change",
    function() {

        // Clear search when
        // category changes

        searchInput.value = "";

        displayProducts();

    }
);
// =====================================================
// NOTIFICATION
// =====================================================

function showNotification(message) {

    const notification =
        document.createElement("div");


    notification.className = `

        fixed
        bottom-5
        right-5
        bg-gray-900
        text-white
        px-5
        py-3
        rounded-xl
        shadow-lg
        text-sm
        z-[100]

    `;
    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => notification.remove(),
        2500
    );

}
// =====================================================
// HERO TIMER
// =====================================================

const heroEndTime =
    Date.now() +
    (8 * 60 * 60 * 1000);

function updateHeroTimer() {

    const remaining =
        Math.max(
            heroEndTime -
            Date.now(),
            0
        );


    const hours =
        Math.floor(
            remaining /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (remaining %
                (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (remaining %
                (1000 * 60)) /
            1000
        );


    document.getElementById(
        "heroH"
    ).textContent =
        String(hours)
            .padStart(2, "0");


    document.getElementById(
        "heroM"
    ).textContent =
        String(minutes)
            .padStart(2, "0");


    document.getElementById(
        "heroS"
    ).textContent =
        String(seconds)
            .padStart(2, "0");

}



// =====================================================
// PRODUCT TIMERS
// =====================================================

function updateProductTimers() {

    document
        .querySelectorAll(".timer")
        .forEach(timer => {

            const end =Number(timer.dataset.time );
            const remaining =Math.max(end -Date.now(),0);
            const hours =Math.floor(remaining /(1000 * 60 * 60));
            const minutes =Math.floor((remaining %(1000 * 60 * 60)) /(1000 * 60));
            const seconds =Math.floor((remaining %(1000 * 60)) /1000);
            timer.textContent =
                `${String(hours).padStart(2, "0")}:
                 ${String(minutes).padStart(2, "0")}:
                 ${String(seconds).padStart(2, "0")}`;

        });

}
// =====================================================
// TIMER LOOP
// =====================================================

setInterval(
    () => {

        updateHeroTimer();

        updateProductTimers();

    },
    1000
);
// =====================================================
// INITIAL LOAD
// =====================================================

displayProducts();

updateCart();

updateHeroTimer();

updateProductTimers();