// Portfolio item click animation and smooth scroll for nav links
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'scale(1.07)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'scale(1)';
  });
});

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
