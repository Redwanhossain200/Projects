// Smooth scroll for navigation
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Book a table button popup
document.getElementById("bookTableBtn").addEventListener("click", () => {
  alert("Table booking system coming soon!");
});
