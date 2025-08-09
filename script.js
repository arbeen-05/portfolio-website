// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Optional: Dark mode toggle (you can add a button later to toggle this)
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// You can add event listeners to toggle dark mode if needed later.
