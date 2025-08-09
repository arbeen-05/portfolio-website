
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formMessage.style.color = '#f4b400'; // yellow
      formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
      form.reset();
    } else {
      const data = await response.json();
      if (data.errors) {
        formMessage.style.color = 'red';
        formMessage.textContent = data.errors.map(error => error.message).join(', ');
      } else {
        formMessage.style.color = 'red';
        formMessage.textContent = 'Oops! There was a problem submitting your form.';
      }
    }
  } catch (error) {
    formMessage.style.color = 'red';
    formMessage.textContent = 'Oops! There was a problem submitting your form.';
  }
});
