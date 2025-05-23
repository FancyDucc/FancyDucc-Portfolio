window.addEventListener("load", () => {
  const pre = document.querySelector(".preloader");
  if (!pre) return;
  pre.style.transition = "opacity 0.5s ease";
  pre.style.opacity = 0;
  setTimeout(() => pre.remove(), 350);
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/navbar.html')
    .then(res => res.ok ? res.text() : Promise.reject('nav fetch failed'))
    .then(html => {
      document.getElementById('navbar-overlay').innerHTML = html;
      initNavbar();
    })
    .catch(console.error);

  fetch('/pageend.html')
    .then(res => res.ok ? res.text() : Promise.reject('footer fetch failed'))
    .then(html => {
      document.getElementById('footer').innerHTML = html;
    })
    .catch(console.error);
});

function initNavbar() {
  highlightCurrentLink();

  const topNavItems    = document.querySelectorAll('#mainNavTop .nav-item');
  const subNavContainer = document.getElementById('subNavContainer');
  let currentSubNav     = null;
  let inTransition      = false;

  topNavItems.forEach(item => {
    const submenuId = item.dataset.submenu;
    const link      = item.querySelector('.nav-link');

    link.addEventListener('click', e => {
      e.preventDefault();
      if (inTransition) return;

      if (currentSubNav === submenuId) {
        closeSubNav();
      } else {
        closeSubNav(() => openSubNav(submenuId));
      }
    });
  });

  function closeSubNav(cb) {
    if (!currentSubNav) {
      if (cb) cb();
      return;
    }

    inTransition = true;
    const oldNav   = document.getElementById(currentSubNav);
    const fullH    = subNavContainer.scrollHeight + 'px';

    subNavContainer.style.maxHeight = fullH;

    void subNavContainer.offsetHeight;
    subNavContainer.style.maxHeight = '0';

    subNavContainer.addEventListener('transitionend', function handler(e) {
      if (e.target !== subNavContainer) return;
      subNavContainer.removeEventListener('transitionend', handler);

      if (oldNav) oldNav.classList.remove('active');
      currentSubNav = null;
      inTransition  = false;
      if (cb) cb();
    });
  }

  function openSubNav(id) {
    inTransition = true;
    const newNav = document.getElementById(id);
    if (!newNav) {
      inTransition = false;
      return;
    }

    newNav.classList.add('active');
    subNavContainer.style.maxHeight = 'none';
    const fullH = subNavContainer.scrollHeight + 'px';

    subNavContainer.style.maxHeight = '0';

    void subNavContainer.offsetHeight;
    subNavContainer.style.maxHeight = fullH;

    subNavContainer.addEventListener('transitionend', function handler(e) {
      if (e.target !== subNavContainer) return;
      subNavContainer.removeEventListener('transitionend', handler);

      currentSubNav = id;
      inTransition  = false;
    });
  }
}

function highlightCurrentLink() {
  const links = document.querySelectorAll('#mainNav a.nav-link');
  links.forEach(link => {

    const pageUrl = location.href.replace(/\/$/, '');
    if (link.href.replace(/\/$/, '') === pageUrl) {
      link.classList.add('active');
    }
  });
}