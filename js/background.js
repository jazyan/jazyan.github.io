// Pulsing network-graph background. Kept cheap on purpose:
//  - a small fixed number of nodes, edges computed once at init
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
    var RED = '200, 16, 46';
    var NODE_COUNT = 60;
    var NEIGHBORS = 3;          // edges per node to its nearest neighbours
    var DRIFT = 18;             // how far a node wanders from its home, in px
    var FRAME_INTERVAL = 1000 / 30;
    var dpr = 1;
    var width = 0;
    var height = 0;
    var nodes = [];
    var edges = [];
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

    function buildGraph() {
        nodes = [];
        edges = [];
        for (var i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                hx: Math.random() * width,
                hy: Math.random() * height,
                x: 0,
                y: 0,
                phase: Math.random() * Math.PI * 2,
                speed: 0.6 + Math.random() * 0.8,     // pulse rate, radians/s
                driftPhase: Math.random() * Math.PI * 2,
                driftSpeed: 0.1 + Math.random() * 0.15
            });
        }
        // Connect each node to its nearest neighbours. Done once, so the
        // per-frame cost is linear in the number of edges.
        var seen = {};
        for (var a = 0; a < NODE_COUNT; a++) {
            var dists = [];
            for (var b = 0; b < NODE_COUNT; b++) {
                if (a === b) { continue; }
                var dx = nodes[a].hx - nodes[b].hx;
                var dy = nodes[a].hy - nodes[b].hy;
                dists.push({ i: b, d: dx * dx + dy * dy });
            }
            dists.sort(function (p, q) { return p.d - q.d; });
            for (var k = 0; k < NEIGHBORS && k < dists.length; k++) {
                var b2 = dists[k].i;
                var key = a < b2 ? a + '-' + b2 : b2 + '-' + a;
                if (seen[key]) { continue; }
                seen[key] = true;
                edges.push({
                    a: a,
                    b: b2,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.3 + Math.random() * 0.4   // pulse travel rate, cycles/s
                });
            }
        }
    }

    function init() {
        resize();
        buildGraph();
    }

    function draw(t) {
        var s = t / 1000;
        ctx.clearRect(0, 0, width, height);

        // Move nodes gently around their home positions.
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var ang = n.driftPhase + s * n.driftSpeed;
            n.x = n.hx + Math.cos(ang) * DRIFT;
            n.y = n.hy + Math.sin(ang * 1.3) * DRIFT;
            n.pulse = 0.5 + 0.5 * Math.sin(n.phase + s * n.speed);
        }

        // Edges: a faint line, plus a bright pulse sliding from a to b.
        ctx.lineWidth = 1;
        for (var e = 0; e < edges.length; e++) {
            var ed = edges[e];
            var a = nodes[ed.a];
            var b = nodes[ed.b];
            var glow = 0.15 + 0.2 * (a.pulse + b.pulse) / 2;
            ctx.strokeStyle = 'rgba(' + RED + ',' + glow + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            var p = (ed.phase / (Math.PI * 2) + s * ed.speed) % 1;
            var px = a.x + (b.x - a.x) * p;
            var py = a.y + (b.y - a.y) * p;
            ctx.fillStyle = 'rgba(' + RED + ',0.7)';
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nodes: a solid dot with a pulsing halo ring.
        for (var j = 0; j < nodes.length; j++) {
            var nd = nodes[j];
            var r = 2 + nd.pulse * 2;
            ctx.fillStyle = 'rgba(' + RED + ',' + (0.4 + nd.pulse * 0.5) + ')';
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(' + RED + ',' + (0.25 * (1 - nd.pulse)) + ')';
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, r + 4 + nd.pulse * 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function frame(now) {
        rafId = window.requestAnimationFrame(frame);
        if (now - lastFrame < FRAME_INTERVAL) { return; }
        lastFrame = now;
        draw(now);
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
        resizeTimer = setTimeout(init, 150);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stop(); } else { start(); }
    });

    init();
    draw(0);
    start();
})();
