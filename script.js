document.querySelectorAll('[data-year]').forEach(function (element) {
  element.textContent = new Date().getFullYear();
});

const header = document.querySelector('.site-header');
const toggle = header?.querySelector('.nav-toggle');
const navigation = header?.querySelector('#main-navigation');
if (header && toggle && navigation) {
  toggle.hidden = false;
  header.classList.add('nav-ready');
  const closeNavigation = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeNavigation();
  });
}
