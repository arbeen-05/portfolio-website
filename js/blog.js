// Blog post hover animation handled by CSS

// Smooth scroll nav links
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
function toggleMenu() {
  const nav = document.querySelector(".nav-links");
  const burger = document.querySelector(".hamburger");

  nav.classList.toggle("open");
  burger.classList.toggle("active");
}
