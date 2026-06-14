(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page enter + contour draw */
  requestAnimationFrame(function(){
    document.body.classList.add('loaded');
    var topo = document.querySelector('.topo');
    if (topo) topo.classList.add('drawn');
  });

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
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    revs.forEach(function(el){ io.observe(el); });
  } else {
    revs.forEach(function(el){ el.classList.add('in'); });
  }

  var nav = document.getElementById('nav');
  var topoSvg = document.querySelector('.topo svg');
  var elev = document.getElementById('elevVal');

  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY || window.pageYOffset;
      var doc = document.documentElement;
      var max = (doc.scrollHeight - window.innerHeight) || 1;
      var p = Math.min(1, Math.max(0, y / max));

      if (nav) nav.classList.toggle('stuck', y > 8);

      /* parallax drift on the contour map */
      if (topoSvg && !reduce){
        topoSvg.style.transform = 'translateY(' + (y * 0.06).toFixed(1) + 'px)';
      }

      /* elevation readout: climbing toward 4200 m */
      if (elev){
        var m = Math.round(p * 4200);
        elev.textContent = String(m).padStart(4,'0') + ' m';
      }
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
