//  Reuses the same localStorage key set by the existing login flow (public/js/login.js
(function adminAuthGuard() {
    const raw = localStorage.getItem("couponx_user")

    if (!raw) {
        window.location.href = "/login.html"
        return
    }

    try {
        const user = JSON.parse(raw)
        if (!user || user.role !== "admin") {
            window.location.href = "/login.html"
        }
    } catch (e) {
        localStorage.removeItem("couponx_user")
        window.location.href = "/login.html"
    }
})()

// Attaches logout behaviour to any element with id="logoutBtn" on the page
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("couponx_user")
            window.location.href = "/login.html"
        })
    }
})
