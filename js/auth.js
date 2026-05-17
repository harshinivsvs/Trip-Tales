document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("loggedInUser");
  const nav = document.querySelector("nav");

  if (!nav) return;
  if (!userData) return;

  const user = JSON.parse(userData);

  /* Remove Login link from all pages */
  const loginLinks = nav.querySelectorAll(
    'a[href="login.html"], a[href="pages/login.html"]'
  );

  loginLinks.forEach((link) => {
    link.remove();
  });

  const userSpan = document.createElement("span");
  userSpan.textContent = `Welcome, ${user.name}`;
  userSpan.style.cssText = `
    margin-left: 15px;
    font-weight: 600;
    color: #ff7a00;
  `;

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.style.cssText = `
    margin-left: 10px;
    padding: 7px 13px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    background: #ff7a00;
    color: white;
    font-weight: 600;
  `;

  function confirmDialog(options) {
    if (window.Swal && typeof Swal.fire === "function") {
      return Swal.fire(options);
    }

    // Fallback to native confirm when Swal isn't available
    return Promise.resolve({
      isConfirmed: window.confirm((options.title ? options.title + "\n\n" : "") + (options.text || ""))
    });
  }

  function alertDialog(options) {
    if (window.Swal && typeof Swal.fire === "function") {
      return Swal.fire(options);
    }

    // Fallback to native alert when Swal isn't available
    window.alert((options.title ? options.title + "\n\n" : "") + (options.text || ""));
    return Promise.resolve();
  }

  logoutBtn.addEventListener("click", () => {
    confirmDialog({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff7a00",
      cancelButtonColor: "#777"
    }).then((result) => {
      if (!result.isConfirmed) return;

      localStorage.removeItem("loggedInUser");

      alertDialog({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#ff7a00"
      }).then(() => {
        const homePath = window.location.pathname.includes("/pages/")
          ? "../index.html"
          : "index.html";

        window.location.href = homePath;
      });
    });
  });

  nav.append(userSpan, logoutBtn);
});
