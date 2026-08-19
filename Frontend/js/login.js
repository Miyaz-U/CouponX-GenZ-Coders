const customerTabBtn = document.getElementById("customerTabBtn")
const adminTabBtn = document.getElementById("adminTabBtn")
const selectedRoleInput = document.getElementById("selectedRole")
const loginForm = document.getElementById("loginForm")
const errorMsg = document.getElementById("errorMsg")
const passwordInput = document.getElementById("password")
const togglePasswordBtn = document.getElementById("togglePasswordBtn")

// Show/Hide password logic
togglePasswordBtn.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    togglePasswordBtn.textContent = "Hide"
  } else {
    passwordInput.type = "password"
    togglePasswordBtn.textContent = "Show"
  }
});

// Tab switching logic
customerTabBtn.addEventListener("click", function () {
  selectedRoleInput.value = "customer"

  // Highlight the Customer tab
  customerTabBtn.classList.add("bg-purple-600", "text-white")
  customerTabBtn.classList.remove("bg-white", "text-gray-600")
  // Un-highlight the Admin tab
  adminTabBtn.classList.add("bg-white", "text-gray-600")
  adminTabBtn.classList.remove("bg-purple-600", "text-white")
});

adminTabBtn.addEventListener("click", function () {
  selectedRoleInput.value = "admin"
  // Highlight the Admin tab
  adminTabBtn.classList.add("bg-purple-600", "text-white")
  adminTabBtn.classList.remove("bg-white", "text-gray-600")
  // Un-highlight the Customer tab
  customerTabBtn.classList.add("bg-white", "text-gray-600")
  customerTabBtn.classList.remove("bg-purple-600", "text-white")
});

// Form submit logic
loginForm.addEventListener("submit", function (event) {
  event.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const role = selectedRoleInput.value

  errorMsg.classList.add("hidden")
  errorMsg.textContent = ""
  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email, password: password, role: role })
  })
    .then(function (response) {
      return response.json().then(function (data) {
        return { status: response.status, body: data }
      });
    })
    .then(function (result) {
      if (result.status === 200) {
        localStorage.setItem("couponx_user", JSON.stringify(result.body.user))
        if (result.body.user.role === "admin") {
          window.location.href = "admin-dashboard-placeholder.html"
        } else {
          window.location.href = "customer-dashboard-placeholder.html"
        }
      } else {
        errorMsg.textContent = result.body.message
        errorMsg.classList.remove("hidden")
      }
    })
    .catch(function (error) {
      errorMsg.textContent = "Could not reach the server. Is it running?"
      errorMsg.classList.remove("hidden")
      console.log("Login error:", error)
    })
});

// Show/Hide password logic - Signup form (Password + Confirm Password)
const signupPasswordInput = document.getElementById("signupPassword")
const toggleSignupPasswordBtn = document.getElementById("toggleSignupPasswordBtn")
const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword")
const toggleSignupConfirmPasswordBtn = document.getElementById("toggleSignupConfirmPasswordBtn")

toggleSignupPasswordBtn.addEventListener("click", function () {
  if (signupPasswordInput.type === "password") {
    signupPasswordInput.type = "text"
    toggleSignupPasswordBtn.textContent = "Hide"
  } else {
    signupPasswordInput.type = "password"
    toggleSignupPasswordBtn.textContent = "Show"
  }
});

toggleSignupConfirmPasswordBtn.addEventListener("click", function () {
  if (signupConfirmPasswordInput.type === "password") {
    signupConfirmPasswordInput.type = "text"
    toggleSignupConfirmPasswordBtn.textContent = "Hide"
  } else {
    signupConfirmPasswordInput.type = "password"
    toggleSignupConfirmPasswordBtn.textContent = "Show"
  }
});

// SIGNUP
const roleTabs = document.querySelector(".flex.mb-6")
const signupForm = document.getElementById("signupForm")
const showSignupBtn = document.getElementById("showSignupBtn")
const showLoginBtn = document.getElementById("showLoginBtn")

showSignupBtn.addEventListener("click", function () {
  loginForm.classList.add("hidden")
  roleTabs.classList.add("hidden")
  signupForm.classList.remove("hidden")
});

showLoginBtn.addEventListener("click", function () {
  signupForm.classList.add("hidden")
  roleTabs.classList.remove("hidden")
  loginForm.classList.remove("hidden")
});

// SIGNUP
const signupErrorMsg = document.getElementById("signupErrorMsg")
const signupSuccessMsg = document.getElementById("signupSuccessMsg")

signupForm.addEventListener("submit", function (event) {
  event.preventDefault()

  const name = document.getElementById("signupName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("signupConfirmPassword").value

  signupErrorMsg.classList.add("hidden")
  signupSuccessMsg.classList.add("hidden")

  if (!name || !email || !password) {
    signupErrorMsg.textContent = "Please fill in all fields."
    signupErrorMsg.classList.remove("hidden")
    return;
  }

  if (password !== confirmPassword) {
    signupErrorMsg.textContent = "Passwords do not match."
    signupErrorMsg.classList.remove("hidden")
    return
  }

  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: name, email: email, password: password, role: "customer" })
  })
    .then(function (response) {
      return response.json().then(function (data) {
        return { status: response.status, body: data }
      })
    })
    .then(function (result) {
      if (result.status === 201) {
        signupSuccessMsg.textContent = "Account created! You can log in now."
        signupSuccessMsg.classList.remove("hidden")
        signupForm.reset()
        setTimeout(function () {
          signupForm.classList.add("hidden")
          roleTabs.classList.remove("hidden")
          loginForm.classList.remove("hidden")
        }, 1200)
      } else {
        signupErrorMsg.textContent = result.body.message
        signupErrorMsg.classList.remove("hidden")
      }
    })
    .catch(function (error) {
      signupErrorMsg.textContent = "Could not reach the server. Is it running?"
      signupErrorMsg.classList.remove("hidden")
      console.log("Signup error:", error)
    })
})