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
