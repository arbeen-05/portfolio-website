// Animate skill bars when the about page loads
document.addEventListener('DOMContentLoaded', () => {
  const progresses = document.querySelectorAll('.progress');
  progresses.forEach(progress => {
    progress.style.width = progress.style.width; // trigger CSS transition
  });
});

// Nav link smooth scroll & multi-page nav
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
