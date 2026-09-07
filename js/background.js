// Gentle drifting-orb background. Kept cheap on purpose:
//  - a small fixed number of orbs
//  - frame rate capped at 30 fps
//  - paused when the tab is hidden
//  - disabled entirely when the user prefers reduced motion
(function () {
    'use strict';

    var canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) { return; }

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) { return; }

    var ctx = canvas.getContext('2d');
    var ORB_COUNT = 24;
    var FRAME_INTERVAL = 1000 / 30;
    var dpr = 1;
    var width = 0;
    var height = 0;
    var orbs = [];
    var lastFrame = 0;
    var rafId = null;

    function resize() {
        // Cap the pixel ratio so high-DPI screens don't quadruple the fill cost.
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeOrb() {
        var radius = 40 + Math.random() * 90;
        var speed = 0.15 + Math.random() * 0.25;
        var angle = Math.random() * Math.PI * 2;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            r: radius,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 0.12 + Math.random() * 0.18
        };
    }

    function init() {
        resize();
        orbs = [];
        for (var i = 0; i < ORB_COUNT; i++) { orbs.push(makeOrb()); }
    }

    function step(orb) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        // Wrap around the edges so orbs never pile up or disappear.
        if (orb.x < -orb.r) { orb.x = width + orb.r; }
        if (orb.x > width + orb.r) { orb.x = -orb.r; }
        if (orb.y < -orb.r) { orb.y = height + orb.r; }
        if (orb.y > height + orb.r) { orb.y = -orb.r; }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < orbs.length; i++) {
            var orb = orbs[i];
            step(orb);
            var g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
            g.addColorStop(0, 'rgba(205, 237, 246, ' + orb.alpha + ')');
            g.addColorStop(1, 'rgba(205, 237, 246, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function frame(now) {
        rafId = window.requestAnimationFrame(frame);
        if (now - lastFrame < FRAME_INTERVAL) { return; }
        lastFrame = now;
        draw();
    }

    function start() {
        if (rafId === null) { rafId = window.requestAnimationFrame(frame); }
    }

    function stop() {
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stop(); } else { start(); }
    });

    init();
    draw();
    start();
})();
