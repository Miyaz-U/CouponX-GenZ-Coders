// WISHLIST PAGE LOGIC
const wishlistGrid = document.getElementById("wishlistGrid");
const wishlistGridSection = document.getElementById("wishlistGridSection");
const emptyWishlistSection = document.getElementById("emptyWishlistSection");
const wishlistActions = document.getElementById("wishlistActions");
const wishlistSubtitle = document.getElementById("wishlistSubtitle");
const moveAllToCartBtn = document.getElementById("moveAllToCartBtn");
const clearWishlistBtn = document.getElementById("clearWishlistBtn");

function renderWishlistPage() {
  const items = getWishlist();

  if (!items || items.length === 0) {
    if (wishlistGridSection) wishlistGridSection.classList.add("hidden");
    if (emptyWishlistSection) emptyWishlistSection.classList.remove("hidden");
    if (wishlistActions) wishlistActions.classList.add("hidden");
    if (wishlistSubtitle) {
      wishlistSubtitle.textContent = "Save your favourite products and easily move them to your cart.";
    }
    return;
  }

  if (wishlistGridSection) wishlistGridSection.classList.remove("hidden");
  if (emptyWishlistSection) emptyWishlistSection.classList.add("hidden");
  if (wishlistActions) wishlistActions.classList.remove("hidden");
  if (wishlistSubtitle) {
    wishlistSubtitle.textContent = "You have " + items.length + " saved item" + (items.length === 1 ? "" : "s") + " in your wishlist.";
  }

  wishlistGrid.innerHTML = "";

  items.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded-xl p-4 flex flex-col transition-all duration-200 hover:shadow-lg hover:border-purple-300 relative group";

    const showDealPrice = product.isDeal && product.dealPrice;
    const tileStyle = typeof getCategoryTileStyle === "function"
      ? getCategoryTileStyle(product.category)
      : { bg: "bg-gray-100" };
    const ratingInfo = typeof getProductRating === "function"
      ? getProductRating(product)
      : { rating: 4.5, reviewCount: 88 };
    const starsHtml = typeof renderStars === "function"
      ? renderStars(ratingInfo.rating)
      : "?????";

    const hasImage = !!product.image;

    const imageHtml = hasImage
      ? '<div class="relative h-36 bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">' +
        '  <button type="button" class="removeWishlistCardBtn absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm flex items-center justify-center transition-all z-10" data-id="' + (product._id || product.id) + '" title="Remove from Wishlist">' +
        '    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
        '  </button>' +
        '  <img src="' + product.image + '" alt="' + product.name + '" class="wishlistImg w-full h-full object-contain" />' +
        '</div>'
      : '<div class="relative h-36 ' + tileStyle.bg + ' border-2 border-dashed border-gray-300 rounded-lg mb-3 flex items-center justify-center text-center px-2">' +
        '  <button type="button" class="removeWishlistCardBtn absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm flex items-center justify-center transition-all z-10" data-id="' + (product._id || product.id) + '" title="Remove from Wishlist">' +
        '    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
        '  </button>' +
        '  <span class="text-xs text-gray-400">Product image placeholder</span>' +
        '</div>';

    const priceHtml = showDealPrice
      ? '<div class="flex items-baseline gap-2 mb-3">' +
        '  <span class="text-lg font-bold text-gray-900 leading-tight">?' + product.dealPrice.toLocaleString("en-IN") + '</span>' +
        '  <span class="text-xs text-gray-400 line-through">?' + product.price.toLocaleString("en-IN") + '</span>' +
        '  <span class="text-[11px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Deal</span>' +
        '</div>'
      : '<div class="flex items-baseline gap-2 mb-3">' +
        '  <span class="text-lg font-bold text-gray-900 leading-tight">?' + product.price.toLocaleString("en-IN") + '</span>' +
        '</div>';

    card.innerHTML =
      imageHtml +
      '<div class="flex items-center gap-1 text-xs text-amber-500 mb-1">' +
      '  <span>' + starsHtml + '</span>' +
      '  <span class="text-gray-400">(' + ratingInfo.reviewCount + ')</span>' +
      '</div>' +
      '<h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">' + product.name + '</h3>' +
      '<p class="text-xs text-gray-500 mb-2 truncate">' + (product.category || "General") + '</p>' +
      priceHtml +
      '<div class="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-2">' +
      '  <button class="moveToCartBtn w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-sm">' +
      '    ?? Move to Cart' +
      '  </button>' +
      '  <button class="removeCardTextBtn w-full text-center text-xs text-gray-400 hover:text-red-500 py-1 transition">' +
      '    Remove' +
      '  </button>' +
      '</div>';

    if (hasImage) {
      const img = card.querySelector(".wishlistImg");
      img.addEventListener("error", function () {
        const parent = img.parentElement;
        img.remove();
        parent.classList.add(tileStyle.bg, "border-2", "border-dashed", "border-gray-300");
        const placeholder = document.createElement("span");
        placeholder.className = "text-xs text-gray-400";
        placeholder.textContent = "Product image placeholder";
        parent.appendChild(placeholder);
      });
    }

    // Move to cart action
    const moveToCartBtn = card.querySelector(".moveToCartBtn");
    moveToCartBtn.addEventListener("click", function () {
      addToCart({
        _id: product._id || product.id,
        name: product.name,
        price: product.price,
        dealPrice: product.dealPrice,
        isDeal: product.isDeal
      });
      removeFromWishlist(product._id || product.id);
      renderWishlistPage();
      showToast("Moved to cart ?");
    });

    // Remove actions
    const removeBtn = card.querySelector(".removeWishlistCardBtn");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        removeFromWishlist(product._id || product.id);
        renderWishlistPage();
      });
    }

    const removeTextBtn = card.querySelector(".removeCardTextBtn");
    if (removeTextBtn) {
      removeTextBtn.addEventListener("click", function () {
        removeFromWishlist(product._id || product.id);
        renderWishlistPage();
      });
    }

    wishlistGrid.appendChild(card);
  });
}

// Move all items to cart
if (moveAllToCartBtn) {
  moveAllToCartBtn.addEventListener("click", function () {
    const items = getWishlist();
    if (!items || items.length === 0) return;

    items.forEach(function (product) {
      addToCart({
        _id: product._id || product.id,
        name: product.name,
        price: product.price,
        dealPrice: product.dealPrice,
        isDeal: product.isDeal
      });
    });

    clearWishlist();
    renderWishlistPage();
    showToast("All items moved to cart! ??");
    if (typeof openCart === "function") {
      openCart();
    }
  });
}

// Clear all items
if (clearWishlistBtn) {
  clearWishlistBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlist();
      renderWishlistPage();
    }
  });
}

// Listen to custom update event
window.addEventListener("couponx_wishlist_updated", function () {
  renderWishlistPage();
});

// Init
updateCartCountBadge();
setupCart();
setupCartSidebarActions();
renderWishlistPage();
