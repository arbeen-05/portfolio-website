// Smooth scroll for nav links
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if(href.startsWith('#')) {
      const section = document.querySelector(href);
      if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href; // For multi-page navigation
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
