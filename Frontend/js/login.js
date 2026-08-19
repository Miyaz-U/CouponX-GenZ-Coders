// Grab references to the elements we need
const customerTabBtn = document.getElementById("customerTabBtn");
const adminTabBtn = document.getElementById("adminTabBtn");
const selectedRoleInput = document.getElementById("selectedRole");
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

// ----- Tab switching logic -----

customerTabBtn.addEventListener("click", function () {
  selectedRoleInput.value = "customer";

  // Highlight the Customer tab
  customerTabBtn.classList.add("bg-purple-600", "text-white");
  customerTabBtn.classList.remove("bg-white", "text-gray-600");

  // Un-highlight the Admin tab
  adminTabBtn.classList.add("bg-white", "text-gray-600");
  adminTabBtn.classList.remove("bg-purple-600", "text-white");
});

adminTabBtn.addEventListener("click", function () {
  selectedRoleInput.value = "admin";

  // Highlight the Admin tab
  adminTabBtn.classList.add("bg-purple-600", "text-white");
  adminTabBtn.classList.remove("bg-white", "text-gray-600");

  // Un-highlight the Customer tab
  customerTabBtn.classList.add("bg-white", "text-gray-600");
  customerTabBtn.classList.remove("bg-purple-600", "text-white");
});

// ----- Form submit logic -----

loginForm.addEventListener("submit", function (event) {
  // Stop the page from refreshing on form submit
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = selectedRoleInput.value;

  // Hide any old error message before trying again
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";

  // Call our basic Express backend
  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email, password: password, role: role })
  })
    .then(function (response) {
      return response.json().then(function (data) {
        return { status: response.status, body: data };
      });
    })
    .then(function (result) {
      if (result.status === 200) {
        // Save basic user info so the dashboard page can greet them
        localStorage.setItem("couponx_user", JSON.stringify(result.body.user));

        // Redirect based on role returned by the backend
        if (result.body.user.role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "customer-dashboard.html";
        }
      } else {
        // Show the error message sent back from the backend
        errorMsg.textContent = result.body.message;
        errorMsg.classList.remove("hidden");
      }
    })
    .catch(function (error) {
      errorMsg.textContent = "Could not reach the server. Is it running?";
      errorMsg.classList.remove("hidden");
      console.log("Login error:", error);
    });
});
