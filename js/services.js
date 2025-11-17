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
