// blog.js
(function () {
  // Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Search + Filter
  const searchInput = document.getElementById('blog-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');
  const featuredPost = document.querySelector('.featured-post');
  const noResults = document.getElementById('no-results');

  let currentCat = 'all';
  let currentSearch = '';

  function filterPosts() {
    let visibleCount = 0;

    // Handle featured post
    if (featuredPost) {
      const cat = featuredPost.dataset.cat || '';
      const title = featuredPost.querySelector('h2')?.textContent.toLowerCase() || '';
      const excerpt = featuredPost.querySelector('.featured-excerpt')?.textContent.toLowerCase() || '';
      const catMatch = currentCat === 'all' || cat === currentCat;
      const searchMatch = !currentSearch || title.includes(currentSearch) || excerpt.includes(currentSearch);
      if (catMatch && searchMatch) {
        featuredPost.classList.remove('hidden');
        visibleCount++;
      } else {
        featuredPost.classList.add('hidden');
      }
    }

    postCards.forEach(card => {
      const cat = card.dataset.cat || '';
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('p')?.textContent.toLowerCase() || '';
      const catMatch = currentCat === 'all' || cat === currentCat;
      const searchMatch = !currentSearch || title.includes(currentSearch) || excerpt.includes(currentSearch);

      if (catMatch && searchMatch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      filterPosts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim().toLowerCase();
      filterPosts();
    });
  }
})();
