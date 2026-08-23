const API_URL = "/api/coupons"
let allCoupons = []

// ===============================
// LOAD COUPONS
// ===============================
async function loadDashboard() {
    try {
        const response = await fetch(API_URL)
        const result = await response.json()
        if (!result.success) {
            throw new Error(result.message || "Failed to fetch coupons")
        }
        allCoupons = result.data || []
        updateStats()
        displayCoupons()
        displayTopCoupons()
        createChart()
    } catch (error) {
        console.error("Dashboard Error:", error)
        document.getElementById("couponTable").innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-red-400 py-8">
                    Failed to load coupons
                </td>
            </tr>
        `
    }
}

// ===============================
// UPDATE STATS
// ===============================
function updateStats() {
    const total = allCoupons.length
    const active = allCoupons.filter(coupon => coupon.isActive).length
    const now = new Date()
    const expired = allCoupons.filter(
        coupon => new Date(coupon.validTill) < now
    ).length
    const usage = allCoupons.reduce(
        (sum, coupon) => sum + (coupon.usageCount || 0),
        0
    )
    document.getElementById("totalCoupons").textContent = total
    document.getElementById("activeCoupons").textContent = active
    document.getElementById("expiredCoupons").textContent = expired
    document.getElementById("totalUsage").textContent = usage
}

// ===============================
// DISPLAY COUPONS
// ===============================
function displayCoupons() {
    const table = document.getElementById("couponTable")
    if (allCoupons.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-gray-500 py-10">
                    No coupons found
                </td>
            </tr>
        `
        return
    }
    const recentCoupons = allCoupons.slice(0, 10)
    table.innerHTML = recentCoupons.map(coupon => {
        const expired = new Date(coupon.validTill) < new Date()
        const status = expired? "Expired": coupon.isActive? "Active": "Inactive"
        const statusClass = status === "Active"? "bg-green-500/10 text-green-400": status === "Expired"? "bg-red-500/10 text-red-400": "bg-gray-500/10 text-gray-400"
        const discount = coupon.discountType === "percentage"? `${coupon.discountValue}%`: `₹${coupon.discountValue}`
        return `
            <tr class="hover:bg-white/[0.02]">
                <td class="px-5 py-4"><span class="font-semibold">${coupon.code}</span></td>
                <td class="px-5 py-4 text-purple-400">${discount}</td>
                <td class="px-5 py-4 text-gray-400">₹${Number(coupon.minPurchase || 0).toLocaleString("en-IN")}</td>
                <td class="px-5 py-4 text-gray-400">${formatDate(coupon.validTill)}</td>
                <td class="px-5 py-4"><span class="px-3 py-1 rounded-full text-xs ${statusClass}">${status}</span></td>
            </tr>
        `
    }).join("")
}

// ===============================
// TOP COUPONS
// ===============================
function displayTopCoupons() {
    const container = document.getElementById("topCoupons")
    const topCoupons = [...allCoupons]
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5)
    if (topCoupons.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm">No coupon data</p>`
        return
    }
    container.innerHTML = topCoupons.map((coupon, index) => `
        <div class="flex items-center justify-between bg-[#0d1120] rounded-xl p-3">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    ${index + 1}
                </div>
                <div>
                    <p class="font-semibold">${coupon.code}</p>
                    <p class="text-xs text-gray-500">
                        ${coupon.discountValue}${coupon.discountType === "percentage" ? "%" : " OFF"}
                    </p>
                </div>
            </div>
            <span class="text-sm text-gray-400">${coupon.usageCount || 0} uses</span>
        </div>
    `).join("")
}

// ===============================
// DATE FORMAT
// ===============================
function formatDate(date) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

// ===============================
// CHART
// ===============================
function createChart() {
    const canvas = document.getElementById("couponChart")
    if (!canvas) return
    // Destroy previous chart instance to avoid duplication on refresh
    if (window._couponChart) {
        window._couponChart.destroy()
    }
    const labels = allCoupons.slice(0, 7).map(coupon => coupon.code)
    const usage = allCoupons.slice(0, 7).map(coupon => coupon.usageCount || 0)
    window._couponChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Usage",
                data: usage,
                borderRadius: 8,
                backgroundColor: "rgba(147, 51, 234, 0.5)",
                borderColor: "rgba(147, 51, 234, 1)",
                borderWidth: 1 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
                y: { beginAtZero: true, ticks: { color: "#9ca3af" }, grid: { color: "#1f2937" } }
            }
        }
    })
}

// ===============================
// MOBILE MENU
// ===============================
const menuBtn = document.getElementById("menuBtn")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")
menuBtn.addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full")
    overlay.classList.remove("hidden")
})
overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full")
    overlay.classList.add("hidden")
})

// ===============================
// START
// ===============================
loadDashboard()
// Refresh every 10 seconds
setInterval(loadDashboard, 10000)