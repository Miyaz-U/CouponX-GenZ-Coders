const loginForm = document.getElementById("loginForm")
const errorMsg = document.getElementById("errorMsg")
const passwordInput = document.getElementById("password")
const togglePasswordBtn = document.getElementById("togglePasswordBtn")

// email format validation (shared)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function isValidEmail(value) {
  return emailPattern.test(value)
}

// Wires up a single show/hide password toggle button for one input field.
function setupPasswordToggle(inputEl, btnEl) {
  btnEl.addEventListener("click", function () {
    if (inputEl.type === "password") {
      inputEl.type = "text"
      btnEl.textContent = "Hide"
    } else {
      inputEl.type = "password"
      btnEl.textContent = "Show"
    }
  })
}

// Sends a JSON POST request and resolves to { status, body }.
function postJSON(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(function (response) {
    return response.json().then(function (data) {
      return { status: response.status, body: data }
    })
  })
}

// PASSWORD TOGGLES — one call per input/button pair
setupPasswordToggle(passwordInput, togglePasswordBtn)

const signupPasswordInput = document.getElementById("signupPassword")
const toggleSignupPasswordBtn = document.getElementById("toggleSignupPasswordBtn")
const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword")
const toggleSignupConfirmPasswordBtn = document.getElementById("toggleSignupConfirmPasswordBtn")

setupPasswordToggle(signupPasswordInput, toggleSignupPasswordBtn)
setupPasswordToggle(signupConfirmPasswordInput, toggleSignupConfirmPasswordBtn)

const forgotNewPasswordInput = document.getElementById("forgotNewPassword")
const toggleForgotNewPasswordBtn = document.getElementById("toggleForgotNewPasswordBtn")
const forgotConfirmPasswordInput = document.getElementById("forgotConfirmPassword")
const toggleForgotConfirmPasswordBtn = document.getElementById("toggleForgotConfirmPasswordBtn")

setupPasswordToggle(forgotNewPasswordInput, toggleForgotNewPasswordBtn)
setupPasswordToggle(forgotConfirmPasswordInput, toggleForgotConfirmPasswordBtn)

// LOGIN
loginForm.addEventListener("submit", function (event) {
  event.preventDefault()
  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value

  errorMsg.classList.add("hidden")
  errorMsg.textContent = ""

  // Client-side validation
  if (!email && !password) {
    errorMsg.textContent = "Please enter your email and password."
    errorMsg.classList.remove("hidden")
    return
  }
  if (!email) {
    errorMsg.textContent = "Please enter your email address."
    errorMsg.classList.remove("hidden")
    return
  }
  if (!isValidEmail(email)) {
    errorMsg.textContent = "Please enter a valid email address."
    errorMsg.classList.remove("hidden")
    return
  }
  if (!password) {
    errorMsg.textContent = "Please enter your password."
    errorMsg.classList.remove("hidden")
    return
  }

  postJSON("/api/auth/login", { email: email, password: password })
    .then(function (result) {
      if (result.status === 200) {
        localStorage.setItem("couponx_user", JSON.stringify(result.body.user))
        if (result.body.user.role === "admin") {
          window.location.href = "admin-dashboard-placeholder.html"
        } else {
          window.location.href = "home.html"
        }
      } else if (result.status === 404) {
        errorMsg.textContent = result.body.message || "No account found with that email address."
        errorMsg.classList.remove("hidden")
      } else if (result.status === 401) {
        errorMsg.textContent = result.body.message || "Incorrect password. Please try again."
        errorMsg.classList.remove("hidden")
      } else if (result.status === 400) {
        errorMsg.textContent = result.body.message || "Please fill in all required fields."
        errorMsg.classList.remove("hidden")
      } else {
        errorMsg.textContent = result.body.message || "Something went wrong on our end. Please try again later."
        errorMsg.classList.remove("hidden")
      }
    })
    .catch(function (error) {
      errorMsg.textContent = "Could not reach the server. Is it running?"
      errorMsg.classList.remove("hidden")
      console.log("Login error:", error)
    })
});

// LOGIN/SIGNUP VIEW TOGGLE
const signupForm = document.getElementById("signupForm")
const showSignupBtn = document.getElementById("showSignupBtn")
const showLoginBtn = document.getElementById("showLoginBtn")

showSignupBtn.addEventListener("click", function () {
  loginForm.classList.add("hidden")
  signupForm.classList.remove("hidden")
  signupErrorMsg.classList.add("hidden")
  signupSuccessMsg.classList.add("hidden")
});

showLoginBtn.addEventListener("click", function () {
  signupForm.classList.add("hidden")
  loginForm.classList.remove("hidden")
  errorMsg.classList.add("hidden")
});

// SIGNUP
const signupErrorMsg = document.getElementById("signupErrorMsg")
const signupSuccessMsg = document.getElementById("signupSuccessMsg")

signupForm.addEventListener("submit", function (event) {
  event.preventDefault()

  const name = document.getElementById("signupName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const mobile = document.getElementById("signupMobile").value.trim()
  const address = document.getElementById("signupAddress").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("signupConfirmPassword").value

  signupErrorMsg.classList.add("hidden")
  signupSuccessMsg.classList.add("hidden")

  // Client-side validation
  if (!name) {
    signupErrorMsg.textContent = "Please enter your full name."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!email) {
    signupErrorMsg.textContent = "Please enter your email address."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!isValidEmail(email)) {
    signupErrorMsg.textContent = "Please enter a valid email address."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!mobile) {
    signupErrorMsg.textContent = "Please enter your mobile number."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    signupErrorMsg.textContent = "Please enter a valid 10-digit mobile number."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!address) {
    signupErrorMsg.textContent = "Please enter your address."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (!password) {
    signupErrorMsg.textContent = "Please enter a password."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (password.length < 6) {
    signupErrorMsg.textContent = "Password must be at least 6 characters long."
    signupErrorMsg.classList.remove("hidden")
    return
  }
  if (password !== confirmPassword) {
    signupErrorMsg.textContent = "Passwords do not match."
    signupErrorMsg.classList.remove("hidden")
    return
  }

  postJSON("/api/auth/register", { name: name, email: email, mobile: mobile, address: address, password: password, role: "customer" })
    .then(function (result) {
      if (result.status === 201) {
        signupSuccessMsg.textContent = "Account created! You can log in now."
        signupSuccessMsg.classList.remove("hidden")
        signupForm.reset()
        setTimeout(function () {
          signupForm.classList.add("hidden")
          loginForm.classList.remove("hidden")
        }, 1200)
      } else if (result.status === 409) {
        signupErrorMsg.textContent = result.body.message || "An account with that email already exists."
        signupErrorMsg.classList.remove("hidden")
      } else if (result.status === 400) {
        signupErrorMsg.textContent = result.body.message || "Please check the details you entered."
        signupErrorMsg.classList.remove("hidden")
      } else {
        signupErrorMsg.textContent = result.body.message || "Something went wrong on our end. Please try again later."
        signupErrorMsg.classList.remove("hidden")
      }
    })
    .catch(function (error) {
      signupErrorMsg.textContent = "Could not reach the server. Is it running?"
      signupErrorMsg.classList.remove("hidden")
      console.log("Signup error:", error)
    })
})

// FORGOT PASSWORD
const forgotForm = document.getElementById("forgotForm")
const showForgotBtn = document.getElementById("showForgotBtn")
const backToLoginFromForgotBtn = document.getElementById("backToLoginFromForgotBtn")
const forgotErrorMsg = document.getElementById("forgotErrorMsg")
const forgotSuccessMsg = document.getElementById("forgotSuccessMsg")

showForgotBtn.addEventListener("click", function (event) {
  event.preventDefault()
  loginForm.classList.add("hidden")
  forgotForm.classList.remove("hidden")
  forgotErrorMsg.classList.add("hidden")
  forgotSuccessMsg.classList.add("hidden")
});

backToLoginFromForgotBtn.addEventListener("click", function () {
  forgotForm.classList.add("hidden")
  loginForm.classList.remove("hidden")
  errorMsg.classList.add("hidden")
});

forgotForm.addEventListener("submit", function (event) {
  event.preventDefault()

  const email = document.getElementById("forgotEmail").value.trim()
  const newPassword = forgotNewPasswordInput.value
  const confirmNewPassword = forgotConfirmPasswordInput.value

  forgotErrorMsg.classList.add("hidden")
  forgotSuccessMsg.classList.add("hidden")

  // Client-side validation
  if (!email) {
    forgotErrorMsg.textContent = "Please enter your email address."
    forgotErrorMsg.classList.remove("hidden")
    return
  }
  if (!isValidEmail(email)) {
    forgotErrorMsg.textContent = "Please enter a valid email address."
    forgotErrorMsg.classList.remove("hidden")
    return
  }
  if (!newPassword || !confirmNewPassword) {
    forgotErrorMsg.textContent = "Please enter and confirm your new password."
    forgotErrorMsg.classList.remove("hidden")
    return
  }
  if (newPassword.length < 6) {
    forgotErrorMsg.textContent = "Password must be at least 6 characters long."
    forgotErrorMsg.classList.remove("hidden")
    return
  }
  if (newPassword !== confirmNewPassword) {
    forgotErrorMsg.textContent = "Passwords do not match."
    forgotErrorMsg.classList.remove("hidden")
    return
  }

  postJSON("/api/auth/reset-password", { email: email, newPassword: newPassword })
    .then(function (result) {
      if (result.status === 200) {
        forgotSuccessMsg.textContent = "Password updated! You can log in now."
        forgotSuccessMsg.classList.remove("hidden")
        forgotForm.reset()
        setTimeout(function () {
          forgotForm.classList.add("hidden")
          loginForm.classList.remove("hidden")
        }, 1200)
      } else if (result.status === 404) {
        forgotErrorMsg.textContent = result.body.message || "No account found with that email address."
        forgotErrorMsg.classList.remove("hidden")
      } else if (result.status === 400) {
        forgotErrorMsg.textContent = result.body.message || "Please check the details you entered."
        forgotErrorMsg.classList.remove("hidden")
      } else {
        forgotErrorMsg.textContent = result.body.message || "Something went wrong on our end. Please try again later."
        forgotErrorMsg.classList.remove("hidden")
      }
    })
    .catch(function (error) {
      forgotErrorMsg.textContent = "Could not reach the server. Is it running?"
      forgotErrorMsg.classList.remove("hidden")
      console.log("Reset password error:", error)
    })
})
