// Social button URLs
const socialLinks = {
  instagram: "https://www.instagram.com/arbineyyy", // replace with your actual URL
  facebook: "https://www.facebook.com/yourprofile",
  linkedin: "https://www.linkedin.com/in/arbin-niroula",
  github: "https://github.com/arbineyyy",
  twitter: "https://twitter.com/arbineyyy"
};

// Open social links in new tabs
document.querySelectorAll('.social-btn').forEach(button => {
  button.addEventListener('click', () => {
    const classes = button.classList;
    for (const cls of classes) {
      if (socialLinks[cls]) {
        window.open(socialLinks[cls], '_blank');
        return;
      }
    }
  });
});

// Basic form validation and alert (no real backend)
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const message = e.target.message.value.trim();

  if (!name || !email || !message) {
    alert('Please fill all the fields before submitting.');
    return;
  }

  alert(`Thanks for contacting me, ${name}! I'll get back to you soon.`);

  e.target.reset();
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
