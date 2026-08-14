(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page enter */
  requestAnimationFrame(function(){
    document.body.classList.add('loaded');
  });

  /* page transition — quick horizontal motion blur between internal pages */
  var body = document.body;
  if (!reduce) {
    body.classList.add('page-enter');
    body.addEventListener('animationend', function onEnterEnd(e){
      if (e.target === body && e.animationName === 'page-enter-anim') {
        body.classList.remove('page-enter');
        body.removeEventListener('animationend', onEnterEnd);
      }
    });

    document.querySelectorAll('a[href^="/"]').forEach(function(a){
      a.addEventListener('click', function(ev){
        if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || a.target === '_blank') return;
        var dest = a.getAttribute('href');
        ev.preventDefault();
        body.classList.remove('page-enter');
        body.classList.add('page-exit');
        setTimeout(function(){ window.location.href = dest; }, 200);
      });
    });
  }

  /* year stamps */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function(el){
    el.textContent = new Date().getFullYear();
  });

  /* reveal on scroll */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.1, rootMargin:'0px 0px -6% 0px'});
    revs.forEach(function(el){ io.observe(el); });
  } else {
    revs.forEach(function(el){ el.classList.add('in'); });
  }

  /* nav sticky border */
  var nav = document.getElementById('nav');
  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('stuck', y > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* placeholder links: don't jump to top while unset */
  document.querySelectorAll('a[href="#"]').forEach(function(a){
    a.addEventListener('click', function(ev){ ev.preventDefault(); });
  });
})();
