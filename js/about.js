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
