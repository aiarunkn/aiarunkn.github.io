(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* rose branch — grows down the left edge as the page scrolls.
     Disabled for now: upstream is mid-rework on a new watercolor-style
     rose render. Flip BRANCH_ENABLED once that lands. */
  var BRANCH_ENABLED = false;
  var branchEl = document.getElementById('hh-branch');
  var stemEl = document.getElementById('hh-stem');
  var twigEl = document.getElementById('hh-twigs');
  var thornEl = document.getElementById('hh-thorns');
  var bloomHost = document.getElementById('hh-blooms');
  if (BRANCH_ENABLED && branchEl && stemEl && twigEl && thornEl && bloomHost && !reduce && window.innerWidth >= 840) {
    var blooms = [
      { t: 8,  x: 92, s: 66, r: -14 },
      { t: 21, x: 26, s: 46, r: 12 },
      { t: 34, x: 98, s: 58, r: 7 },
      { t: 48, x: 22, s: 70, r: -9 },
      { t: 62, x: 96, s: 44, r: 15 },
      { t: 76, x: 28, s: 60, r: -7 },
      { t: 90, x: 94, s: 50, r: 11 }
    ];

    function roseSvg(size){
      var rings = [
        { n: 8, r: 0.44, w: 0.54, h: 0.42, rot: 0,  fill: '#FFFFFF', sw: 1.9 },
        { n: 7, r: 0.32, w: 0.46, h: 0.35, rot: 24, fill: '#FCF9F2', sw: 1.8 },
        { n: 6, r: 0.21, w: 0.37, h: 0.28, rot: 48, fill: '#F5F0E5', sw: 1.7 },
        { n: 5, r: 0.11, w: 0.27, h: 0.21, rot: 18, fill: '#EDE7DA', sw: 1.6 }
      ];
      var svgP = '';
      rings.forEach(function(ring){
        for (var i = 0; i < ring.n; i++) {
          var a = ring.rot + (i * 360) / ring.n;
          svgP += '<ellipse cx="' + (50 + ring.r * 100) + '" cy="50" rx="' + ring.w * 50 + '" ry="' + ring.h * 50 +
            '" fill="' + ring.fill + '" stroke="#8B8272" stroke-width="' + ring.sw + '" transform="rotate(' + a + ' 50 50)"/>';
        }
      });
      svgP += '<path d="M50 62 C 40 62 36 52 42 46 C 49 39 61 43 61 51 C 61 58 54 60 50 55" fill="none" stroke="#8B8272" stroke-width="2.1" stroke-linecap="round"/>';
      return '<svg viewBox="-52 -52 204 204" width="' + size + '" height="' + size +
        '" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(44,42,38,.16))">' + svgP + '</svg>';
    }

    var bloomEls = blooms.map(function(b){
      var w = document.createElement('div');
      w.style.cssText = 'position:absolute;left:' + b.x + 'px;top:' + b.t + '%;width:' + b.s + 'px;height:' + b.s +
        'px;margin:' + (-b.s / 2) + 'px 0 0 ' + (-b.s / 2) + 'px;opacity:0;transform:scale(.3) rotate(' + (b.r - 30) + 'deg);' +
        'transition:opacity 1s ease,transform 1.15s cubic-bezier(.18,.86,.22,1)';
      w.innerHTML = roseSvg(b.s);
      bloomHost.appendChild(w);
      return w;
    });

    var NS = 'http://www.w3.org/2000/svg';
    var L = stemEl.getTotalLength();
    function at(y){
      var lo = 0, hi = L;
      for (var i = 0; i < 26; i++) { var m = (lo + hi) / 2; if (stemEl.getPointAtLength(m).y < y) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    function mk(host, d, atPct){
      var pth = document.createElementNS(NS, 'path');
      pth.setAttribute('d', d);
      pth.dataset.at = atPct;
      host.appendChild(pth);
    }

    blooms.forEach(function(b){
      var y = b.t * 10, l = at(y), p = stemEl.getPointAtLength(l);
      var q = stemEl.getPointAtLength(Math.min(L, l + 8));
      var dx = q.x - p.x, dy = q.y - p.y, m = Math.hypot(dx, dy) || 1;
      var out = b.x > p.x ? 1 : -1;
      var c1x = p.x + (dx / m) * 30, c1y = p.y + (dy / m) * 30;
      var c2x = b.x - out * 26, c2y = y + 30;
      mk(twigEl, 'M' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' +
        c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + y.toFixed(1), b.t);
    });

    (function(){
      var step = 34, n = 0;
      for (var l = 30; l < L - 26; l += step, n++) {
        var p = stemEl.getPointAtLength(l), q = stemEl.getPointAtLength(l + 6);
        var dx = q.x - p.x, dy = q.y - p.y, m = Math.hypot(dx, dy) || 1;
        var side = n % 2 ? 1 : -1;
        var nx = (-dy / m) * side, ny = (dx / m) * side;
        var tip = { x: p.x + nx * 8 - (dx / m) * 5, y: p.y + ny * 8 - (dy / m) * 5 };
        mk(thornEl, 'M' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' Q ' + (p.x + nx * 6).toFixed(1) + ' ' +
          (p.y + ny * 6 + 1).toFixed(1) + ' ' + tip.x.toFixed(1) + ' ' + tip.y.toFixed(1), (p.y / 10).toFixed(2));
      }
    })();

    var twigs = [].slice.call(twigEl.querySelectorAll('path')).map(function(el){
      var l = el.getTotalLength();
      el.style.strokeDasharray = l;
      el.style.strokeDashoffset = l;
      return { el: el, len: l, at: parseFloat(el.dataset.at || 0) };
    });
    var thorns = [].slice.call(thornEl.querySelectorAll('path')).map(function(el){
      el.style.transition = 'opacity .5s ease';
      el.style.opacity = '0';
      return { el: el, at: parseFloat(el.dataset.at || 0) };
    });

    stemEl.style.strokeDasharray = L;
    stemEl.style.strokeDashoffset = L;

    var svgRoot = stemEl.ownerSVGElement;
    function fit(){
      var pad = Math.min(80, Math.max(28, window.innerWidth * 0.06));
      var band = Math.max(74, pad + 52);
      var k = Math.max(0.6, Math.min(1, band / 132));
      branchEl.style.width = (132 * k).toFixed(1) + 'px';
      if (svgRoot) { svgRoot.style.transformOrigin = 'left top'; svgRoot.style.transform = 'scaleX(' + k.toFixed(3) + ')'; }
      bloomEls.forEach(function(el, i){
        var b = blooms[i], s = b.s * (0.72 + 0.28 * k);
        var left = Math.min(Math.max(b.x * k, s * 0.5 + 4), band - s * 0.34);
        el.style.left = left.toFixed(1) + 'px';
        el.style.width = el.style.height = s.toFixed(1) + 'px';
        el.style.margin = (-s / 2).toFixed(1) + 'px 0 0 ' + (-s / 2).toFixed(1) + 'px';
        var svgEl = el.firstElementChild;
        if (svgEl) { svgEl.setAttribute('width', s.toFixed(1)); svgEl.setAttribute('height', s.toFixed(1)); }
      });
    }
    fit();
    branchEl.style.opacity = '1';

    function paintBranch(){
      branchEl.style.opacity = '1';
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      var grow = 0.05 + 0.95 * Math.min(1, p / 0.88);
      stemEl.style.strokeDashoffset = (L * (1 - grow)).toFixed(1);
      var pct = grow * 100;
      twigs.forEach(function(t){
        var local = Math.max(0, Math.min(1, (pct - t.at) / 4.5));
        t.el.style.strokeDashoffset = (t.len * (1 - local)).toFixed(1);
      });
      thorns.forEach(function(t){ t.el.style.opacity = pct > t.at + 0.8 ? '1' : '0'; });
      bloomEls.forEach(function(el, i){
        var open = pct > blooms[i].t + 4;
        el.style.opacity = open ? '1' : '0';
        var r = blooms[i].r;
        el.style.transform = open ? 'scale(1) rotate(' + r + 'deg)' : 'scale(.3) rotate(' + (r - 30) + 'deg)';
      });
    }

    window.addEventListener('scroll', paintBranch, { passive: true });
    window.addEventListener('resize', function(){ fit(); paintBranch(); }, { passive: true });
    var lastY = -1, lastW = -1;
    (function tick(){
      requestAnimationFrame(tick);
      if (window.innerWidth !== lastW) { lastW = window.innerWidth; fit(); }
      if (window.scrollY !== lastY) { lastY = window.scrollY; paintBranch(); }
    })();
    paintBranch();
  }
})();
