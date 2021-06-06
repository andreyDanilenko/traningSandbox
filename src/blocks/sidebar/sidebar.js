// sidebar
const sidebarToggle = document.querySelector(".sidebar__toggle");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.add("sidebar__show");
    sidebarToggle.style.display = "none";
  });
};

if (closeBtn && sidebar) {
  closeBtn.addEventListener("click", function () {
    if (sidebar.classList.contains("sidebar__show")) {
      sidebar.classList.remove("sidebar__show");
      sidebarToggle.style.display = "block";
    }
  });
};