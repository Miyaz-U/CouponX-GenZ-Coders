//  This script wires up the admin profile icon (id="profileBtn") that appears on the Dashboard, Coupons, Orders, and Customers pages.
//  It reuses:
//    - the "couponx_user" localStorage entry already set by public/js/login.js and checked by public/js/adminAuth.js
//    - the existing POST /api/auth/profile endpoint (see controllers/authController.js)
//      which is the same endpoint used by the customer-facing profile dropdown in public/js/account.js
//  The dropdown markup is built once here, eliminating the need to duplicate it across the four HTML files.

document.addEventListener("DOMContentLoaded", function () {
    const profileBtn = document.getElementById("profileBtn")
    if (!profileBtn) return

    const wrapper = profileBtn.parentElement

    const dropdown = document.createElement("div")
    dropdown.id = "profileDropdown"
    dropdown.className =
        "hidden fixed inset-x-4 top-16 z-50 " +
        "sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-72 " +
        "bg-[#12121d] border border-white/10 rounded-xl shadow-lg p-4"

    dropdown.innerHTML =
        '<p class="text-xs font-semibold text-gray-500 uppercase mb-3">Admin Account</p>' +
        '<div class="space-y-2 text-sm text-gray-300">' +
        '<div><span class="font-medium text-gray-500">Name:</span> <span id="profileName">—</span></div>' +
        '<div><span class="font-medium text-gray-500">Email:</span> <span id="profileEmail">—</span></div>' +
        '<div><span class="font-medium text-gray-500">Mobile:</span> <span id="profileMobile">—</span></div>' +
        '<div><span class="font-medium text-gray-500">Address:</span> <span id="profileAddress">—</span></div>' +
        "</div>"

    wrapper.appendChild(dropdown)

    const nameEl = dropdown.querySelector("#profileName")
    const emailEl = dropdown.querySelector("#profileEmail")
    const mobileEl = dropdown.querySelector("#profileMobile")
    const addressEl = dropdown.querySelector("#profileAddress")

    // Same load pattern as the customer-facing dropdown in public/js/account.js:
    // show whatever is cached in localStorage immediately, then refresh from
    // the backend using the logged-in admin's own email.
    function loadProfile() {
        const stored = JSON.parse(localStorage.getItem("couponx_user") || "null")
        if (!stored) return

        nameEl.textContent = stored.name || "—"
        emailEl.textContent = stored.email || "—"
        mobileEl.textContent = stored.mobile || "—"
        addressEl.textContent = stored.address || "—"

        fetch("/api/auth/profile?email=" + encodeURIComponent(stored.email), { method: "POST" })
            .then(function (res) {
                if (!res.ok) return null
                return res.json()
            })
            .then(function (user) {
                if (!user) return
                nameEl.textContent = user.name || "—"
                emailEl.textContent = user.email || "—"
                mobileEl.textContent = user.mobile || "—"
                addressEl.textContent = user.address || "—"
                
                stored.mobile = user.mobile
                stored.address = user.address
                localStorage.setItem("couponx_user", JSON.stringify(stored))
            })
            .catch(function (err) {
                console.log("Profile fetch error:", err)
            })
    }

    profileBtn.addEventListener("click", function (e) {
        e.stopPropagation()
        const isHidden = dropdown.classList.contains("hidden")
        if (isHidden) {
            loadProfile()
            dropdown.classList.remove("hidden")
        } else {
            dropdown.classList.add("hidden")
        }
    })

    document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target) && e.target !== profileBtn) {
            dropdown.classList.add("hidden")
        }
    })
})
