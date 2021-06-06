// classList - shows/gets all classes
// contains - checks classList for specific class
// add - add class
// remove - remove class
// toggle - toggles class
const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

if (navToggle && links) {
  navToggle.addEventListener("click", function () {
    links.classList.toggle("show-links");

    if (links.classList.contains("show-links")) {
      navToggle.classList.add("nav-toggle--active")
    } else {
      navToggle.classList.remove("nav-toggle--active")
    }
  });
};