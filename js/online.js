const STORAGE_KEY = "tripBookingData";

const TEXT_FIELDS = [
  "name",
  "email",
  "members",
  "contact",
  "address",
  "bankname",
  "accountnumber",
  "budget",
  "payment",
  "country",
  "spot",
  "date",
  "days",
  "special"
];

function showAlert(icon, title, text) {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: "#ff7a00"
  });
}

function saveFormData() {
  const data = {};

  TEXT_FIELDS.forEach((id) => {
    const element = document.getElementById(id);
    if (element) data[id] = element.value;
  });

  data.checkboxes = [...document.querySelectorAll("input[type='checkbox']")].map((checkbox) => ({
    label: checkbox.parentElement.textContent.trim(),
    checked: checkbox.checked
  }));

  const nearbyRadio = document.querySelector("input[type='radio'][name='nearby']:checked");
  if (nearbyRadio) data.nearby = nearbyRadio.parentElement.textContent.trim();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFormData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return;

  const data = JSON.parse(savedData);

  TEXT_FIELDS.forEach((id) => {
    const element = document.getElementById(id);
    if (element && data[id] !== undefined) element.value = data[id];
  });

  if (data.checkboxes) {
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      const label = checkbox.parentElement.textContent.trim();
      const savedCheckbox = data.checkboxes.find((item) => item.label === label);

      if (savedCheckbox) checkbox.checked = savedCheckbox.checked;
    });
  }

  if (data.nearby) {
    document.querySelectorAll("input[type='radio'][name='nearby']").forEach((radio) => {
      if (radio.parentElement.textContent.trim() === data.nearby) {
        radio.checked = true;
      }
    });
  }
}

function attachAutoSave() {
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    element.addEventListener("input", saveFormData);
    element.addEventListener("change", saveFormData);
  });
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const members = document.getElementById("members").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const address = document.getElementById("address").value.trim();
  const bankname = document.getElementById("bankname").value.trim();
  const accountnumber = document.getElementById("accountnumber").value.trim();
  const budget = document.getElementById("budget").value.trim();
  const payment = document.getElementById("payment").value;
  const country = document.getElementById("country").value;
  const spot = document.getElementById("spot").value;
  const date = document.getElementById("date").value;
  const days = document.getElementById("days").value.trim();
  const special = document.getElementById("special").value.trim();

  const namePattern = /^[A-Za-z ]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;
  const accountPattern = /^[0-9]{12}$/;
  const numberPattern = /^[0-9]+$/;

  if (!name) return showAlert("warning", "Missing Name", "Please enter your full name."), false;
  if (!namePattern.test(name)) return showAlert("warning", "Invalid Name", "Full name should contain only alphabets and spaces."), false;

  if (!email) return showAlert("warning", "Missing Email", "Please enter your email."), false;
  if (!emailPattern.test(email)) return showAlert("warning", "Invalid Email", "Please enter a valid email address."), false;

  if (!members) return showAlert("warning", "Missing Members", "Please enter number of members."), false;
  if (!numberPattern.test(members) || Number(members) < 1) return showAlert("warning", "Invalid Members", "Number of members should be at least 1."), false;

  if (!contact) return showAlert("warning", "Missing Contact", "Please enter contact number."), false;
  if (!phonePattern.test(contact)) return showAlert("warning", "Invalid Contact", "Contact number must be exactly 10 digits."), false;

  if (!address) return showAlert("warning", "Missing Address", "Please enter your address."), false;

  if (!bankname) return showAlert("warning", "Missing Bank Name", "Please enter bank name."), false;
  if (!namePattern.test(bankname)) return showAlert("warning", "Invalid Bank Name", "Bank name should contain only alphabets and spaces."), false;

  if (!accountnumber) return showAlert("warning", "Missing Account Number", "Please enter account number."), false;
  if (!accountPattern.test(accountnumber)) return showAlert("warning", "Invalid Account Number", "Account number must be exactly 12 digits."), false;

  if (!budget) return showAlert("warning", "Missing Budget", "Please enter total budget."), false;
  if (!numberPattern.test(budget) || Number(budget) <= 0) return showAlert("warning", "Invalid Budget", "Budget should be a positive number."), false;

  if (!payment) return showAlert("warning", "Missing Payment Method", "Please select payment method."), false;
  if (!country) return showAlert("warning", "Missing Country", "Please select country."), false;
  if (!spot) return showAlert("warning", "Missing Tourist Spot", "Please select tourist spot."), false;
  if (!date) return showAlert("warning", "Missing Travel Date", "Please select travel date."), false;

  if (!days) return showAlert("warning", "Missing Days", "Please enter number of days."), false;
  if (!numberPattern.test(days) || Number(days) < 1) return showAlert("warning", "Invalid Days", "Number of days should be at least 1."), false;

  const accommodationChecked = document.querySelectorAll("#accommodationGroup input[type='checkbox']:checked");
  if (accommodationChecked.length === 0) {
    showAlert("warning", "Missing Accommodation", "Please select at least one accommodation option.");
    return false;
  }

  const transportChecked = document.querySelectorAll("#transportGroup input[type='checkbox']:checked");
  if (transportChecked.length === 0) {
    showAlert("warning", "Missing Transport", "Please select at least one transport option.");
    return false;
  }

  const nearbySelected = document.querySelector("input[type='radio'][name='nearby']:checked");
  if (!nearbySelected) {
    showAlert("warning", "Missing Nearby Option", "Please select whether you want to travel nearby places.");
    return false;
  }

  if (!special) {
    showAlert("warning", "Missing Special Requirements", "Please enter special requirements. If none, type No.");
    return false;
  }

  return true;
}

function handleBookingSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  saveFormData();

  const name = document.getElementById("name").value.trim();
  const country = document.getElementById("country").value;
  const email = document.getElementById("email").value.trim();

  Swal.fire({
    icon: "success",
    title: "Booking Confirmed!",
    html: `
      <b>Thank you, ${name}!</b><br>
      Your trip to <b>${country}</b> is booked.<br><br>
      Details will be sent to:<br>
      <b>${email}</b>
    `,
    confirmButtonColor: "#ff7a00"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFormData();
  attachAutoSave();

  const form = document.getElementById("bookingForm");
  if (form) form.addEventListener("submit", handleBookingSubmit);
});