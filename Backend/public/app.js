const API_URL = "/api";

let cart = [];


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadCategories();

    await loadFeaturedProducts();

    await loadDeals();

    await loadCart();

    setupCart();

    lucide.createIcons();

  }
);


// ===============================
// CATEGORIES
// ===============================

async function loadCategories() {

  const response =
    await fetch(
      `${API_URL}/categories`
    );

  const categories =
    await response.json();

  const grid =
    document.getElementById(
      "categoryGrid"
    );

  grid.innerHTML =
    categories
      .map(
        category => `

        <button
          onclick="filterCategory('${category.name}')"
          class="rounded-xl bg-white p-3 text-center shadow-sm hover:shadow-md"
        >

          <div
            class="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-600"
          >

            <i
              data-lucide="${category.icon}"
              class="h-5 w-5"
            ></i>

          </div>

          <p class="text-[10px] font-semibold">
            ${category.name}
          </p>

        </button>

      `
      )
      .join("");

  lucide.createIcons();

}


// ===============================
// FEATURED
// ===============================

async function loadFeaturedProducts() {

  const response =
    await fetch(
      `${API_URL}/products/featured`
    );

  const products =
    await response.json();

  renderProducts(
    "featuredGrid",
    products
  );

}


// ===============================
// DEALS
// ===============================

async function loadDeals() {

  const response =
    await fetch(
      `${API_URL}/products/deals`
    );

  const products =
    await response.json();

  renderProducts(
    "dealsGrid",
    products
  );

}


// ===============================
// PRODUCT CARDS
// ===============================

function renderProducts(
  elementId,
  products
) {

  const grid =
    document.getElementById(
      elementId
    );

  grid.innerHTML =
    products
      .map(product => {

        const discount =
          Math.round(
            (
              (
                product.originalPrice -
                product.price
              ) /
              product.originalPrice
            ) * 100
          );

        return `

          <article
            class="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg"
          >

            <div
              class="relative flex h-72 w-full items-center justify-center overflow-hidden bg-slate-50"
            >

              <span
                class="absolute left-2 top-2 z-10 rounded-full bg-violet-600 px-2 py-1 text-[8px] font-bold text-white"
              >
                ${discount}% OFF
              </span>

              <img
                src="${product.image}"
                alt="${product.name}"
                class="h-full w-full object-contain p-3"
                loading="lazy"
                onerror="this.src='https://placehold.co/500x400/f5f3ff/7c3aed?text=CouponX'"
              />

            </div>


            <div class="p-3">

              <p
                class="text-[9px] text-violet-500"
              >
                ${product.category}
              </p>

              <h3
                class="mt-1 min-h-[32px] text-xs font-semibold"
              >
                ${product.name}
              </h3>


              <div
                class="mt-3 flex items-center justify-between"
              >

                <div>

                  <p
                    class="text-sm font-bold text-violet-600"
                  >
                    ₹${product.price.toLocaleString("en-IN")}
                  </p>

                  <p
                    class="text-[9px] text-slate-400 line-through"
                  >
                    ₹${product.originalPrice.toLocaleString("en-IN")}
                  </p>

                </div>


                <button
                  onclick="addToCart('${product._id}')"
                  class="rounded-lg bg-violet-600 px-3 py-2 text-[9px] font-bold text-white hover:bg-violet-700"
                >
                  Add
                </button>

              </div>

            </div>

          </article>

        `;

      })
      .join("");

}


// ===============================
// CATEGORY FILTER
// ===============================

async function filterCategory(
  category
) {

  const response =
    await fetch(
      `${API_URL}/products/category/${category}`
    );

  const products =
    await response.json();

  renderProducts(
    "featuredGrid",
    products
  );

}


// ===============================
// ADD CART
// ===============================

async function addToCart(
  productId
) {

  await fetch(
    `${API_URL}/cart`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        productId,
        quantity: 1
      })
    }
  );

  await loadCart();

  showToast(
    "Added to cart ✓"
  );

}


// ===============================
// LOAD CART
// ===============================

async function loadCart() {

  const response =
    await fetch(
      `${API_URL}/cart`
    );

  cart =
    await response.json();

  renderCart();

}


// ===============================
// RENDER CART
// ===============================

function renderCart() {

  const cartItems =
    document.getElementById(
      "cartItems"
    );

  const cartCount =
    document.getElementById(
      "cartCount"
    );

  const cartSummary =
    document.getElementById(
      "cartSummary"
    );

  const cartTotal =
    document.getElementById(
      "cartTotal"
    );


  const totalItems =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  const totalPrice =
    cart.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );


  cartCount.textContent =
    totalItems;

  cartSummary.textContent =
    `${totalItems} items`;

  cartTotal.textContent =
    `₹${totalPrice.toLocaleString("en-IN")}`;


  if (totalItems > 0) {

    cartCount.classList.remove(
      "hidden"
    );

  } else {

    cartCount.classList.add(
      "hidden"
    );

  }


  if (!cart.length) {

    cartItems.innerHTML = `

      <div
        class="flex h-full items-center justify-center text-center"
      >

        <p
          class="text-sm text-slate-400"
        >
          Your cart is empty
        </p>

      </div>

    `;

    return;

  }


  cartItems.innerHTML =
    cart
      .map(
        item => `

        <div
          class="mb-4 flex gap-3 border-b pb-4"
        >

          <img
            src="${item.product.image}"
            class="h-16 w-16 rounded-lg object-contain"
            onerror="this.src='https://placehold.co/100x100/f5f3ff/7c3aed?text=X'"
          />


          <div class="flex-1">

            <p
              class="text-xs font-semibold"
            >
              ${item.product.name}
            </p>

            <p
              class="mt-1 text-xs font-bold text-violet-600"
            >
              ₹${item.product.price.toLocaleString("en-IN")}
            </p>


            <div
              class="mt-2 flex items-center gap-2"
            >

              <button
                onclick="updateCart('${item.productId}', ${item.quantity - 1})"
                class="h-6 w-6 rounded bg-slate-100"
              >
                −
              </button>

              <span class="text-xs">
                ${item.quantity}
              </span>

              <button
                onclick="updateCart('${item.productId}', ${item.quantity + 1})"
                class="h-6 w-6 rounded bg-slate-100"
              >
                +
              </button>

              <button
                onclick="removeFromCart('${item.productId}')"
                class="ml-auto text-[9px] text-red-500"
              >
                Remove
              </button>

            </div>

          </div>

        </div>

      `
      )
      .join("");

}


// ===============================
// UPDATE CART
// ===============================

async function updateCart(
  productId,
  quantity
) {

  await fetch(
    `${API_URL}/cart/${productId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        quantity
      })
    }
  );

  await loadCart();

}


// ===============================
// REMOVE CART
// ===============================

async function removeFromCart(
  productId
) {

  await fetch(
    `${API_URL}/cart/${productId}`,
    {
      method: "DELETE"
    }
  );

  await loadCart();

  showToast(
    "Removed from cart"
  );

}


// ===============================
// CART DRAWER
// ===============================

function setupCart() {

  document
    .getElementById("cartButton")
    .addEventListener(
      "click",
      openCart
    );

  document
    .getElementById("closeCart")
    .addEventListener(
      "click",
      closeCart
    );

  document
    .getElementById("cartBackdrop")
    .addEventListener(
      "click",
      closeCart
    );

}


function openCart() {

  document
    .getElementById("cartDrawer")
    .classList.remove(
      "translate-x-full"
    );

  document
    .getElementById("cartBackdrop")
    .classList.remove(
      "hidden"
    );

}


function closeCart() {

  document
    .getElementById("cartDrawer")
    .classList.add(
      "translate-x-full"
    );

  document
    .getElementById("cartBackdrop")
    .classList.add(
      "hidden"
    );

}


// ===============================
// TOAST
// ===============================

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    message;

  toast.classList.remove(
    "opacity-0"
  );

  setTimeout(() => {

    toast.classList.add(
      "opacity-0"
    );

  }, 2000);

}