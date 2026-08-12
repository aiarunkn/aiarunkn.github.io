(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* live clock — "3:45 PM local" */
  var clockEl = document.getElementById('hh-clock');
  function paintClock(){
    if (!clockEl) return;
    clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' local';
  }
  if (clockEl) { paintClock(); setInterval(paintClock, 30000); }

  /* time-of-day light wash */
  var washEl = document.getElementById('hh-wash');
  function washFor(h){
    if (h < 6 || h >= 21) return 'radial-gradient(120% 80% at 78% 8%, rgba(120,132,150,.30) 0%, rgba(44,42,38,.34) 60%, rgba(22,22,22,.42) 100%)';
    if (h < 10) return 'radial-gradient(110% 78% at 12% 6%, rgba(255,214,150,.34) 0%, rgba(228,214,190,.10) 52%, rgba(120,110,96,.16) 100%)';
    if (h < 16) return 'radial-gradient(130% 90% at 50% -10%, rgba(255,250,236,.30) 0%, rgba(214,208,192,.06) 55%, rgba(110,106,96,.12) 100%)';
    return 'radial-gradient(110% 78% at 88% 12%, rgba(255,176,112,.32) 0%, rgba(196,150,118,.12) 48%, rgba(60,52,46,.26) 100%)';
  }
  function paintWash(){
    if (!washEl) return;
    washEl.style.background = washFor(new Date().getHours());
  }
  if (washEl) { paintWash(); setInterval(paintWash, 30000); }

  /* typing effect */
  var typedEl = document.getElementById('hh-typed');
  if (typedEl) {
    var lines = [
      "I build small tools that remember the things I don't.",
      "Functional is the floor. Beautiful is the point.",
      "Currently turning my voice notes into a contact database.",
      "If it works but it's ugly, I won't use it. So I rebuild it."
    ];
    var i = 0, typed = '', mode = 'type', t;
    var sentenceMs = 5000;

    function schedule(ms){ clearTimeout(t); t = setTimeout(advance, ms); }
    function paint(){ typedEl.textContent = typed; }

    function advance(){
      var full = lines[i % lines.length];
      if (mode === 'type') {
        if (typed.length < full.length) {
          var ch = full[typed.length];
          typed = full.slice(0, typed.length + 1);
          paint();
          schedule(/[.,—]/.test(ch) ? 260 : 28 + Math.random() * 46);
        } else {
          mode = 'hold';
          schedule(sentenceMs);
        }
      } else if (mode === 'hold') {
        mode = 'erase';
        schedule(240);
      } else if (typed.length > 0) {
        typed = typed.slice(0, -1);
        paint();
        schedule(34);
      } else {
        i = (i + 1) % lines.length;
        mode = 'type';
        schedule(420);
      }
    }
    schedule(700);
  }

  /* cursor-follow lamp glow */
  var lampEl = document.getElementById('hh-lamp');
  if (lampEl && !reduce && window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var p = { x: window.innerWidth * 0.4, y: window.innerHeight * 0.45 };
    var target = { x: p.x, y: p.y };
    var raf = 0, running = false;

    function loop(){
      var dx = target.x - p.x, dy = target.y - p.y;
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) { raf = 0; running = false; return; }
      p.x += dx * 0.085; p.y += dy * 0.085;
      lampEl.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0)';
      raf = requestAnimationFrame(loop);
    }
    function kick(){ if (!running) { running = true; loop(); } }

    lampEl.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0)';
    window.addEventListener('pointermove', function(e){
      target.x = e.clientX; target.y = e.clientY;
      lampEl.classList.add('on');
      kick();
    }, { passive: true });
  }
})();
