const storedUser = localStorage.getItem("couponx_user")
if (storedUser) {
    const user = JSON.parse(storedUser)
    document.getElementById("welcomeMsg").textContent = "Hi, " + user.name
} else {
    window.location.href = "login.html"
}
document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("couponx_user")
    window.location.href = "login.html"
})