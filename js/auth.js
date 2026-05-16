const LOGGED_IN_KEY = "loggedInUser";

document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem(LOGGED_IN_KEY);
  if (!userData) return;

  const user = JSON.parse(userData);
  const nav = document.querySelector("nav");
  if (!nav) return;

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

  logoutBtn.addEventListener("click", () => {
    Swal.fire({
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

      localStorage.removeItem(LOGGED_IN_KEY);

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#ff7a00"
      }).then(() => {
        window.location.href = "../index.html";
      });
    });
  });

  nav.append(userSpan, logoutBtn);
});
