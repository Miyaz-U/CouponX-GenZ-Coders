async function loadOrders() {
    const table = document.getElementById("ordersTable")
    try {
        const response = await fetch("/api/orders")
        const result = await response.json()
        if (!result.success) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12 text-red-400">Failed to load orders: ${result.message || "Unknown error"}</td>
                </tr>
            `
            return
        }
        if (result.data.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12 text-gray-500">No orders found</td>
                </tr>
            `
            return
        }
        table.innerHTML = result.data.map(order => `
            <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                <td class="px-6 py-4">${order.orderNumber || "-"}</td>
                <td class="px-6 py-4"><p>${order.customer?.name || "Guest"}</p><p class="text-xs text-gray-500">${order.customer?.email || ""}</p></td>
                <td class="px-6 py-4 text-purple-400">${order.couponCode || "No Coupon"}</td>
                <td class="px-6 py-4">₹${Number(order.finalAmount).toLocaleString("en-IN")}</td>
                <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400">${order.status || "completed"}</span></td>
                <td class="px-6 py-4 text-gray-500">${order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</td>
            </tr>
        `).join("")
    } catch (error) {
        console.error(error)
        table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-12 text-red-400">Could not reach the server</td>
            </tr>
        `
    }
}
loadOrders()
