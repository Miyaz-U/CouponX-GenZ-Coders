async function loadCustomers() {
    try {
        const response = await fetch("/api/customers");
        const result = await response.json();
        const table = document.getElementById("customersTable");
        if (!result.success || result.data.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-12 text-gray-500">No customers found</td>
                </tr>
            `;
            return;
        }
        table.innerHTML =
            result.data.map(
                customer => `
                <tr class="border-b border-white/5 hover:bg-white/[0.02]">
                    <td class="px-6 py-4">${customer.name}</td>
                    <td class="px-6 py-4 text-gray-400">${customer.email}</td>
                    <td class="px-6 py-4 text-gray-400">${customer.phone || "Not provided"}</td>
                    <td class="px-6 py-4 text-gray-500">${new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
            `
            ).join("");
    } catch (error) {
        console.error(error);
    }
}
loadCustomers();