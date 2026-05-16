// shared.js — inject nav + footer on every page
(function () {
  const currentPath = window.location.pathname;

  function getDepth() {
    const parts = currentPath.split('/').filter(Boolean);
    return parts.length;
  }

  function root() {
    const d = getDepth();
    if (d === 0) return './';
    return '../'.repeat(d);
  }

  const r = root();

  const links = [
    { href: r + 'home/', label: 'Home' },
    { href: r + 'about/', label: 'About' },
    { href: r + 'services/web-development/', label: 'Services' },
    { href: r + 'portfolio/online-billing-software/', label: 'Portfolio' },
    { href: r + 'blog/', label: 'Blog' },
    { href: r + 'contact/', label: 'Contact' },
  ];

  const navHTML = `
  <nav class="site-nav" id="site-nav">
    <a href="${r}home/" class="nav-logo">Arbin<span>.</span></a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      ${links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
    </ul>
  </nav>`;

  const footerHTML = `
  <footer class="site-footer">
    <div class="footer-inner">
      <span class="footer-logo">Arbin<span>.</span></span>
      <p>Programmer · Creator · Designer</p>
      <div class="footer-socials">
        <a href="https://www.facebook.com/arbineyyy" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
        <a href="https://www.instagram.com/arbiinn._" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
        <a href="https://www.tiktok.com/@arbinniroula204" target="_blank" rel="noopener" aria-label="TikTok">TK</a>
        <a href="https://wa.me/9779861453873" target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
        <a href="https://www.youtube.com/@arbiinn" target="_blank" rel="noopener" aria-label="YouTube">YT</a>
      </div>
      <p class="footer-copy">&copy; 2026 Arbin Niroula. All rights reserved.</p>
    </div>
  </footer>`;

  // Inject nav
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.innerHTML = navHTML;

  // Inject footer
  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) footerEl.innerHTML = footerHTML;

  // Hamburger toggle
  document.addEventListener('click', function (e) {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
      if (e.target.closest('#nav-toggle')) {
        navLinks.classList.toggle('open');
        toggle.classList.toggle('active');
      } else if (!e.target.closest('.site-nav')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
      }
    }
  });

  // Active link highlight
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (currentPath.includes(a.getAttribute('href').replace(r, '').replace(/\/$/, ''))) {
      a.classList.add('active');
    }
  });

  // Scroll shrink nav
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.site-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });
})();
