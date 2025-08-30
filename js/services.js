// Simple hover scale effect added by CSS, no JS needed for that

// Smooth scroll and multi-page nav
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(href);
      if(section) section.scrollIntoView({behavior: 'smooth'});
    }
  });
});
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");
const navLinks = document.querySelectorAll("nav ul li a");

// Toggle menu
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

// Auto-close when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});
