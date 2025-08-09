document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const formMessage = document.getElementById('formMessage');
  
  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });
    
    if (response.ok) {
      formMessage.style.color = '#4CAF50';
      formMessage.textContent = 'Thanks for contacting me! I will get back to you soon.';
      form.reset();
    } else {
      const data = await response.json();
      if (data.errors) {
        formMessage.style.color = '#f44336';
        formMessage.textContent = data.errors.map(error => error.message).join(', ');
      } else {
        formMessage.style.color = '#f44336';
        formMessage.textContent = 'Oops! There was a problem submitting your form.';
      }
    }
  } catch (error) {
    formMessage.style.color = '#f44336';
    formMessage.textContent = 'Oops! There was a problem submitting your form.';
  }
});


