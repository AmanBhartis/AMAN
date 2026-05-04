// Client-side registration form handler

const API_BASE_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:10000/api' : '/api';

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const msgDiv = document.getElementById("register-msg");
  const registerBtn = document.getElementById("register-btn");

  // form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgDiv.textContent = "";
    msgDiv.classList.remove("alert-danger", "alert-success");

    const name = document.getElementById("fullname").value.trim();
    const age = document.getElementById("age").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const aadhaar = document.getElementById("aadhaar").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const photoInput = document.getElementById("photo");

    // Validate all fields
    if (!name || !age || !phone || !aadhaar || !email || !password) {
      msgDiv.textContent = "All fields are required.";
      msgDiv.classList.add("alert", "alert-danger", "d-none");
      msgDiv.classList.remove("d-none");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msgDiv.textContent = "Please enter a valid email address.";
      msgDiv.classList.add("alert", "alert-danger", "d-none");
      msgDiv.classList.remove("d-none");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      msgDiv.textContent = "Password must be at least 6 characters.";
      msgDiv.classList.add("alert", "alert-danger", "d-none");
      msgDiv.classList.remove("d-none");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      msgDiv.textContent = "Passwords do not match.";
      msgDiv.classList.add("alert", "alert-danger", "d-none");
      msgDiv.classList.remove("d-none");
      return;
    }

    // Disable button during submission
    registerBtn.disabled = true;
    registerBtn.textContent = "Registering...";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("phone", phone);
    formData.append("aadhaar", aadhaar);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (photoInput && photoInput.files && photoInput.files[0]) {
      formData.append("photo", photoInput.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Save token and user data to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Save initial farmer profile with complete registration data
      const farmerProfile = {
        fullName: name,
        farmerId: data.user.id,
        age: age,
        phone: phone,
        aadhar: aadhaar,
        email: email,
        photoUrl: data.user.photoUrl || null,
        // Extended fields initialized but empty (will be filled in profile.html)
        gender: '',
        address: '',
        landSize: null,
        farmingType: '',
        crops: '',
        livestock: '',
        bankLinked: '',
        loanDetails: '',
        fertilizers: '',
        pesticides: '',
        organicPractices: '',
        machinery: ''
      };
      localStorage.setItem('farmerProfile', JSON.stringify(farmerProfile));

      msgDiv.textContent = data.message || "Registration successful! Redirecting to dashboard...";
      msgDiv.classList.add("alert", "alert-success", "d-none");
      msgDiv.classList.remove("d-none", "alert-danger");

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } catch (err) {
      msgDiv.textContent = err.message || "Registration failed";
      msgDiv.classList.add("alert", "alert-danger", "d-none");
      msgDiv.classList.remove("d-none", "alert-success");
      registerBtn.disabled = false;
      registerBtn.textContent = "Register";
    }
  });
});

// Password visibility toggle helper
window.togglePassword = function (fieldId, btn) {
  const input = document.getElementById(fieldId);
  const icon = btn.querySelector(".eye-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
};
