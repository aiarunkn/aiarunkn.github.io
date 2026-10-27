document.querySelectorAll('[data-year]').forEach(function (element) {
  element.textContent = new Date().getFullYear();
});
