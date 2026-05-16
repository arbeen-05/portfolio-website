// contact.js
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMessage');
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btnText.textContent = 'Sending…';
      msg.className = 'form-message';
      msg.textContent = '';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          msg.className = 'form-message success';
          msg.textContent = '✓ Message sent! I'll get back to you soon.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        msg.className = 'form-message error';
        msg.textContent = '✗ Something went wrong. Please try WhatsApp or email directly.';
      } finally {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
      }
    });
  }
})();
