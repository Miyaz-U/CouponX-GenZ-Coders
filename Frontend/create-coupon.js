const form =
    document.getElementById(
        "couponForm"
    );


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const message =
            document.getElementById(
                "message"
            );


        const data = {

            code:
                document.getElementById(
                    "code"
                ).value,

            discountType:
                document.getElementById(
                    "discountType"
                ).value,

            discountValue:
                Number(
                    document.getElementById(
                        "discountValue"
                    ).value
                ),

            minPurchase:
                Number(
                    document.getElementById(
                        "minPurchase"
                    ).value
                ),

            usageLimit:
                Number(
                    document.getElementById(
                        "usageLimit"
                    ).value
                ),

            validFrom:
                document.getElementById(
                    "validFrom"
                ).value,

            validTill:
                document.getElementById(
                    "validTill"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value,

            isActive:
                document.getElementById(
                    "isActive"
                ).checked

        };


        try {

            const response =
                await fetch(
                    "/api/coupons",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                message.textContent =
                    result.message;

                message.className =
                    "text-sm text-center mt-5 text-red-400";

                return;
            }


            message.textContent =
                "Coupon created successfully!";

            message.className =
                "text-sm text-center mt-5 text-green-400";


            form.reset();

            document.getElementById(
                "isActive"
            ).checked = true;


            setTimeout(
                () => {

                    window.location.href =
                        "/coupons.html";

                },
                1000
            );


        } catch (error) {

            message.textContent =
                "Server connection failed";

            message.className =
                "text-sm text-center mt-5 text-red-400";

        }

    }
);