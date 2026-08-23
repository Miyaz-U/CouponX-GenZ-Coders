const form =
  document.getElementById("couponForm");


form.addEventListener("submit", async (event) => {

  event.preventDefault();


  const message =
    document.getElementById("message");


  const data = {

    code:
      document
        .getElementById("code")
        .value
        .trim()
        .toUpperCase(),

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
      ) || 0,

    validFrom:
      document.getElementById(
        "validFrom"
      ).value,

    validTill:
      document.getElementById(
        "validTill"
      ).value,

    usageLimit:
      Number(
        document.getElementById(
          "usageLimit"
        ).value
      ) || 100,

    description:
      document.getElementById(
        "description"
      ).value,

    isActive:
      document.getElementById(
        "isActive"
      ).checked
  };


  console.log(
    "Sending coupon:",
    data
  );


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


    console.log(
      "Backend response:",
      result
    );


    if (!response.ok) {

      message.textContent =
        result.message ||
        "Coupon creation failed";

      message.className =
        "text-sm text-center mt-5 text-red-400";

      return;
    }


    message.textContent =
      "✅ Coupon created successfully!";

    message.className =
      "text-sm text-center mt-5 text-green-400";


    form.reset();


    document.getElementById(
      "isActive"
    ).checked = true;


    setTimeout(() => {

      window.location.href =
        "/coupons.html";

    }, 1000);


  } catch (error) {

    console.error(
      "FETCH ERROR:",
      error
    );


    message.textContent =
      "❌ Backend server connection failed";

    message.className =
      "text-sm text-center mt-5 text-red-400";

  }

});