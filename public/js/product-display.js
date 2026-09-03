// CATEGORY TILE COLORS
const categoryTileStyles = {
  "Laptops": { bg: "bg-purple-100" },
  "Accessories": { bg: "bg-blue-100" },
  "Mobiles": { bg: "bg-slate-100" },
  "Audio": { bg: "bg-pink-100" },
  "Wearables": { bg: "bg-green-100" },
  "Gaming": { bg: "bg-orange-100" }
};
const defaultTileStyle = { bg: "bg-gray-100" };

function getCategoryTileStyle(category) {
  return categoryTileStyles[category] || defaultTileStyle;
}

// RATING HELPERS — generates a deterministic pseudo rating and review count per product (not real user data)
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return Math.abs(hash);
}

function getProductRating(product) {
  const hash = hashString(product._id || product.name);
  const rating = 3.5 + (hash % 15) / 10;
  const reviewCount = 20 + (hash % 300);
  return { rating: Math.round(rating * 2) / 2, reviewCount: reviewCount };
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  let starsHtml = "";
  for (let i = 0; i < fullStars; i++) starsHtml += "★";
  if (hasHalfStar) starsHtml += "½";
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) starsHtml += "☆";
  return starsHtml;
}

// PRODUCT CARD
// Builds one product card element. `options` carries the small, genuine
// per-page differences that existed before this was shared:
//   - showDealBadge: whether to render the "DEAL" badge on sale items (deals.js only)
//   - priceLocale: locale string passed to toLocaleString() for prices (home.js uses "en-IN")
//   - noImagePlaceholderHtml: inner HTML of the no-image placeholder tile
//     (home.js used a single line "Product image"; shop.js/deals.js used
//     "Product image<br/>placeholder" — defaults to the shop.js/deals.js text)
function buildProductCard(product, options) {
  options = options || {};
  const showDealBadge = !!options.showDealBadge;
  const priceLocale = options.priceLocale;
  const noImagePlaceholderHtml = options.noImagePlaceholderHtml || "Product image<br/>placeholder";

  const card = document.createElement("div");
  card.className = "bg-white border border-gray-200 rounded-lg p-4 flex flex-col transition duration-200 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1";

  const showDealPrice = product.isDeal && product.dealPrice;
  const tileStyle = getCategoryTileStyle(product.category);
  const { rating, reviewCount } = getProductRating(product);
  const wishlisted = typeof isInWishlist === "function" ? isInWishlist(product._id) : false;
  const heartSvg = typeof getHeartSvg === "function"
    ? getHeartSvg(wishlisted)
    : (wishlisted ? "❤️" : "🤍");

  const wishlistBtnHtml =
    '<button type="button" class="wishlistBtn group absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow flex items-center justify-center transition-all duration-200 z-10 focus:outline-none" ' +
    'data-id="' + product._id + '" ' +
    'title="' + (wishlisted ? "Remove from Wishlist" : "Add to Wishlist") + '" ' +
    'aria-label="' + (wishlisted ? "Remove from Wishlist" : "Add to Wishlist") + '">' +
    heartSvg +
    '</button>';

  const imageTileHtml = hasImage
    ? '<div class="relative h-28 bg-gray-50 rounded-md mb-3 overflow-hidden flex items-center justify-center">' +
      wishlistBtnHtml +
      '  <img src="' + product.image + '" alt="' + product.name + '" class="productImg w-full h-full object-contain" />' +
      '</div>'
    : '<div class="relative h-28 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-md mb-3 flex items-center justify-center text-center px-2">' +
      wishlistBtnHtml +
      '  <span class="text-xs text-gray-400">' + noImagePlaceholderHtml + '</span>' +
      '</div>';

  const priceHtml = priceLocale
    ? (showDealPrice
        ? '<span class="font-bold text-gray-800 leading-tight">₹' + product.dealPrice.toLocaleString(priceLocale) + '</span>' +
          '<span class="text-xs text-gray-400 line-through leading-tight">₹' + product.price.toLocaleString(priceLocale) + '</span>'
        : '<span class="font-bold text-gray-800 leading-tight">₹' + product.price.toLocaleString(priceLocale) + '</span>')
    : (showDealPrice
        ? '<span class="font-bold text-gray-800 leading-tight">₹' + product.dealPrice.toLocaleString() + '</span>' +
          '<span class="text-xs text-gray-400 line-through leading-tight">₹' + product.price.toLocaleString() + '</span>'
        : '<span class="font-bold text-gray-800 leading-tight">₹' + product.price.toLocaleString() + '</span>');

  card.innerHTML =
    imageTileHtml +
    (showDealBadge && showDealPrice
      ? '<div class="mb-1"><span class="inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">DEAL</span></div>'
      : '') +
    '<div class="flex items-center gap-1 text-xs text-amber-500 mb-1">' +
    '  <span>' + renderStars(rating) + '</span>' +
    '  <span class="text-gray-400">(' + reviewCount + ')</span>' +
    '</div>' +
    '<h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">' + product.name + '</h3>' +
    '<p class="text-xs text-gray-500 mb-2 truncate">' + product.category + '</p>' +
    '<div class="mt-auto flex items-center justify-between gap-2">' +
    '  <div class="min-h-[2.5rem] flex flex-col justify-center">' +
    priceHtml +
    '  </div>' +
    '  <button class="addToCartBtn w-7 h-7 flex items-center justify-center shrink-0 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700" aria-label="Add to cart">' +
    '    +' +
    '  </button>' +
    '</div>';

  if (hasImage) {
    const imgEl = card.querySelector(".productImg");
    imgEl.addEventListener("error", function () {
      const tile = imgEl.parentElement;
      tile.innerHTML = wishlistBtnHtml + '<span class="text-xs text-gray-400 text-center px-2">Image not found</span>';
      tile.classList.remove("bg-gray-50");
      tile.classList.add(tileStyle.bg, "border-2", "border-dashed", "border-gray-300");
      const refoundBtn = tile.querySelector(".wishlistBtn");
      if (refoundBtn) {
        refoundBtn.addEventListener("click", handleWishlistClick);
      }
    });
  }

  function handleWishlistClick(e) {
    e.stopPropagation();
    if (typeof toggleWishlist === "function") {
      const isNowWishlisted = toggleWishlist(product);
      const btn = card.querySelector(".wishlistBtn");
      if (btn) {
        btn.innerHTML = typeof getHeartSvg === "function" ? getHeartSvg(isNowWishlisted) : (isNowWishlisted ? "❤️" : "🤍");
        btn.setAttribute("title", isNowWishlisted ? "Remove from Wishlist" : "Add to Wishlist");
      }
    }
  }

  const wishlistBtn = card.querySelector(".wishlistBtn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", handleWishlistClick);
  }

  const addBtn = card.querySelector(".addToCartBtn");
  addBtn.addEventListener("click", function () {
    addToCart(product);
    addBtn.textContent = "✓";
    setTimeout(function () {
      addBtn.textContent = "+";
    }, 1000);
  });

  return card;
}
