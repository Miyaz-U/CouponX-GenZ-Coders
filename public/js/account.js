// CUSTOMER LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("couponx_user");
    window.location.href = "login.html";
  });
}

// PROFILE DROPDOWN
(function () {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (!profileBtn || !profileDropdown) return;

  async function loadProfile() {
    const stored = JSON.parse(localStorage.getItem("couponx_user") || "null");
    if (!stored) return;

    document.getElementById("profileName").textContent = stored.name || "—";
    document.getElementById("profileEmail").textContent = stored.email || "—";
    document.getElementById("profileMobile").textContent = stored.mobile || "—";
    document.getElementById("profileAddress").textContent = stored.address || "—";

    try {
      const res = await fetch("/api/auth/profile?email=" + encodeURIComponent(stored.email));
      if (!res.ok) return;
      const user = await res.json();
      document.getElementById("profileName").textContent = user.name || "—";
      document.getElementById("profileEmail").textContent = user.email || "—";
      document.getElementById("profileMobile").textContent = user.mobile || "—";
      document.getElementById("profileAddress").textContent = user.address || "—";
      stored.mobile = user.mobile;
      stored.address = user.address;
      localStorage.setItem("couponx_user", JSON.stringify(stored));
    } catch (err) {
      console.log("Profile fetch error:", err);
    }
  }

  profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isHidden = profileDropdown.classList.contains("hidden");
    if (isHidden) {
      loadProfile();
      if (typeof updateWishlistBadges === "function") {
        updateWishlistBadges();
      }
      profileDropdown.classList.remove("hidden");
    } else {
      profileDropdown.classList.add("hidden");
    }
  });

  document.addEventListener("click", function (e) {
    if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.add("hidden");
    }
  });
})();
