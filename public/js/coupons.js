// This script manages the coupons table on the admin/coupons page:
let allCoupons = []
async function loadCoupons() {
    try {
        const response = await fetch("/api/coupons")
        const result = await response.json()
        if (!result.success || result.data.length === 0) {
            renderTable([])
            return
        }
        allCoupons = result.data
        renderTable(allCoupons)
    } catch (err) {
        console.error("Failed to load coupons:", err)
        renderTable([])
    }
}

function renderTable(coupons) {
    const table = document.getElementById("couponTable")
    if (coupons.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-12 text-gray-500">
                    No coupons found
                </td>
            </tr>
        `
        return
    }
    const now = new Date()
    table.innerHTML = coupons.map(coupon => {
        const expired = new Date(coupon.validTill) < now
        const status = expired? "Expired" : coupon.isActive? "Active": "Inactive"
        const statusClass = status === "Active"? "bg-green-500/10 text-green-400": status === "Expired"? "bg-red-500/10 text-red-400": "bg-gray-500/10 text-gray-400"
        const discount = coupon.discountType === "percentage"? `${coupon.discountValue}%`: `₹${coupon.discountValue}`
        const validTill = coupon.validTill? new Date(coupon.validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }): "-"
        return `
            <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                <td class="px-6 py-4 font-semibold">${coupon.code}</td>
                <td class="px-6 py-4 text-purple-400">${discount}</td>
                <td class="px-6 py-4 text-gray-400">₹${Number(coupon.minPurchase || 0).toLocaleString("en-IN")}</td>
                <td class="px-6 py-4 text-gray-400">${validTill}</td>
                <td class="px-6 py-4 text-gray-400">${coupon.usageCount || 0} / ${coupon.usageLimit || "∞"}</td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs ${statusClass}">${status}</span></td>
                <td class="px-6 py-4"><button onclick="deleteCoupon('${coupon._id}')" class="text-red-400 hover:text-red-300 text-sm">Delete</button></td>
            </tr>
        `
    }).join("")
}

async function deleteCoupon(id) {
    if (!confirm("Are you sure you want to delete this coupon?")) return
    try {
        const response = await fetch(`/api/coupons/${id}`, { method: "DELETE" })
        const result = await response.json()
        if (result.success) {
            loadCoupons()
        } else {
            alert(result.message || "Failed to delete coupon")
        }
    } catch (err) {
        alert("Server connection failed")
    }
}

// Search filter
document.getElementById("searchCoupon").addEventListener("input", function () {
    const query = this.value.trim().toLowerCase()
    const filtered = allCoupons.filter(c => c.code.toLowerCase().includes(query))
    renderTable(filtered)
})

// Sidebar toggle (matches coupons.html IDs)
document.getElementById("openSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("-translate-x-full")
    document.getElementById("sidebarOverlay").classList.remove("hidden")
})

document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("-translate-x-full")
    document.getElementById("sidebarOverlay").classList.add("hidden")
})

document.getElementById("sidebarOverlay").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("-translate-x-full")
    document.getElementById("sidebarOverlay").classList.add("hidden")
})

loadCoupons()