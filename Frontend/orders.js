async function loadOrders() {

    try {

        const response =
            await fetch(
                "/api/orders"
            );

        const result =
            await response.json();


        const table =
            document.getElementById(
                "ordersTable"
            );


        if (
            !result.success ||
            result.data.length === 0
        ) {

            table.innerHTML = `
                <tr>

                    <td colspan="6"
                        class="text-center
                               py-12
                               text-gray-500">

                        No orders found

                    </td>

                </tr>
            `;

            return;
        }


        table.innerHTML =
            result.data.map(
                order => `

                <tr
                    class="border-b
                           border-white/5">

                    <td class="px-6 py-4">

                        ${order.orderNumber}

                    </td>


                    <td class="px-6 py-4">

                        <p>
                            ${
                                order.customer?.name ||
                                "Unknown"
                            }
                        </p>

                        <p class="text-xs text-gray-500">

                            ${
                                order.customer?.email ||
                                ""
                            }

                        </p>

                    </td>


                    <td
                        class="px-6 py-4
                               text-purple-400">

                        ${
                            order.couponCode ||
                            "No Coupon"
                        }

                    </td>


                    <td class="px-6 py-4">

                        ₹${order.finalAmount}

                    </td>


                    <td class="px-6 py-4">

                        <span
                            class="px-3 py-1
                                   rounded-full
                                   text-xs
                                   bg-green-500/10
                                   text-green-400">

                            ${order.status}

                        </span>

                    </td>


                    <td
                        class="px-6 py-4
                               text-gray-500">

                        ${
                            new Date(
                                order.createdAt
                            ).toLocaleDateString()
                        }

                    </td>

                </tr>

            `
            ).join("");


    } catch (error) {

        console.error(error);

    }
}


loadOrders();