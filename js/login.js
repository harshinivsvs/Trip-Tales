const USERS_KEY = "tripUsers";
const LOGGED_IN_KEY = "loggedInUser";

document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signinForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showSignIn = document.getElementById("showSignIn");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const forgotPassword = document.getElementById("forgotPassword");

  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#ff7a00"
    });
  };

  const showLoginForm = () => {
    registerForm.style.display = "none";
    signinForm.style.display = "block";
    formTitle.textContent = "Welcome";
    formSubtitle.textContent = "Sign in with Email";
  };

  const showRegisterForm = () => {
    signinForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Register with Email";
  };

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterForm();
  });

  showSignIn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const namePattern = /^[A-Za-z ]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !confirmPassword) {
      showAlert("warning", "Missing Fields", "Please fill all fields.");
      return;
    }

    if (!namePattern.test(name)) {
      showAlert("warning", "Invalid Name", "Name should contain only alphabets and spaces.");
      return;
    }

    if (!emailPattern.test(email)) {
      showAlert("warning", "Invalid Email", "Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      showAlert("warning", "Weak Password", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("error", "Password Mismatch", "Passwords do not match.");
      return;
    }

    const users = getUsers();
    const existingUser = users.find((user) => user.email.toLowerCase() === email);

    if (existingUser) {
      Swal.fire({
        icon: "info",
        title: "Already Registered",
        text: "This email is already registered. Please sign in.",
        confirmButtonColor: "#ff7a00"
      }).then(showLoginForm);

      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    Swal.fire({
      icon: "success",
      title: "Registration Successful",
      text: "Please sign in now.",
      confirmButtonColor: "#ff7a00"
    }).then(() => {
      registerForm.reset();
      showLoginForm();
    });
  });

  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value.trim().toLowerCase();
    const password = document.getElementById("signinPassword").value;

    if (!email || !password) {
      showAlert("warning", "Missing Details", "Please enter email and password.");
      return;
    }

    const matchedUser = getUsers().find(
      (user) => user.email.toLowerCase() === email && user.password === password
    );

    if (!matchedUser) {
      showAlert("error", "Login Failed", "Invalid email or password.");
      return;
    }

    localStorage.setItem(
      LOGGED_IN_KEY,
      JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email
      })
    );

    Swal.fire({
      icon: "success",
      title: "Sign In Successful",
      text: `Welcome ${matchedUser.name}`,
      confirmButtonColor: "#ff7a00"
    }).then(() => {
      window.location.href = "../index.html";
    });
  });

  forgotPassword.addEventListener("click", (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Forgot Password",
      input: "email",
      inputLabel: "Enter your registered email",
      inputPlaceholder: "example@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Next",
      confirmButtonColor: "#ff7a00"
    }).then((emailResult) => {
      if (!emailResult.isConfirmed) return;

      const enteredEmail = emailResult.value.trim().toLowerCase();

      if (!enteredEmail) {
        showAlert("warning", "Email Required", "Please enter your email.");
        return;
      }

      const users = getUsers();
      const user = users.find((u) => u.email.toLowerCase() === enteredEmail);

      if (!user) {
        showAlert("error", "Account Not Found", "No account found with this email.");
        return;
      }

      Swal.fire({
        title: "Reset Password",
        input: "password",
        inputLabel: "Enter your new password",
        inputPlaceholder: "New password",
        showCancelButton: true,
        confirmButtonText: "Next",
        confirmButtonColor: "#ff7a00"
      }).then((passwordResult) => {
        if (!passwordResult.isConfirmed) return;

        const newPassword = passwordResult.value;

        if (!newPassword.trim()) {
          showAlert("warning", "Password Required", "Password cannot be empty.");
          return;
        }

        if (newPassword.length < 6) {
          showAlert("warning", "Weak Password", "Password must be at least 6 characters.");
          return;
        }

        Swal.fire({
          title: "Confirm Password",
          input: "password",
          inputLabel: "Confirm your new password",
          inputPlaceholder: "Confirm password",
          showCancelButton: true,
          confirmButtonText: "Reset Password",
          confirmButtonColor: "#ff7a00"
        }).then((confirmResult) => {
          if (!confirmResult.isConfirmed) return;

          if (newPassword !== confirmResult.value) {
            showAlert("error", "Password Mismatch", "Passwords do not match.");
            return;
          }

          user.password = newPassword;
          saveUsers(users);

          showAlert(
            "success",
            "Password Reset Successful",
            "Please sign in with your new password."
          );
        });
      });
    });
  });
});
