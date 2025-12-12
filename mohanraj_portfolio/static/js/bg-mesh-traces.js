// static/js/bg-mesh-traces.js
(() => {
    // Two canvases: mesh (nodes + connecting lines) and traces (thin circuit lines)
    const meshCanvas = document.getElementById("bg-mesh");
    const traceCanvas = document.getElementById("bg-traces");
    if (!meshCanvas || !traceCanvas) return;

    const meshCtx = meshCanvas.getContext("2d");
    const traceCtx = traceCanvas.getContext("2d");

    let w = innerWidth;
    let h = innerHeight;
    let dpr = devicePixelRatio || 1;

    function resize() {
        w = innerWidth;
        h = innerHeight;
        dpr = devicePixelRatio || 1;

        [meshCanvas, traceCanvas].forEach((c) => {
            c.width = w * dpr;
            c.height = h * dpr;
            c.style.width = w + "px";
            c.style.height = h + "px";
            const ctx = c.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        });
    }

    // ------------- MESH (nodes + lines) -------------
    const NODE_COUNT_BASE = Math.max(18, Math.floor((w * h) / (1400 * 800) * 60)); // density scales with screen
    let nodes = [];
    let nodeCount = NODE_COUNT_BASE;
    const MAX_LINE_DIST = Math.min(200, Math.max(90, Math.min(w, h) / 6)); // threshold distance for connecting lines

    function initNodes() {
        nodes = [];
        nodeCount = Math.max(18, Math.floor((w * h) / 40000)); // roughly scales with area
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25, // slow drift
                vy: (Math.random() - 0.5) * 0.25,
                r: 1 + Math.random() * 2.6,
                pulse: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawMesh(dt, t) {
        meshCtx.clearRect(0, 0, w, h);

        // subtle vignette overlay behind mesh (makes the center slightly brighter)
        // not necessary but nice: we keep it very faint
        // meshCtx.fillStyle = "rgba(0,0,0,0.02)";
        // meshCtx.fillRect(0, 0, w, h);

        // update nodes
        for (let n of nodes) {
            n.x += n.vx * (0.6 + Math.sin(t * 0.0002 + n.pulse) * 0.6);
            n.y += n.vy * (0.6 + Math.cos(t * 0.00015 + n.pulse) * 0.6);

            // wrap edges softly
            if (n.x < -20) n.x = w + 20;
            if (n.x > w + 20) n.x = -20;
            if (n.y < -20) n.y = h + 20;
            if (n.y > h + 20) n.y = -20;
        }

        // draw connecting lines (only for close nodes)
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_LINE_DIST) {
                    // line alpha stronger when closer to cursor? we can keep constant low alpha
                    const alpha = 0.18 * (1 - dist / MAX_LINE_DIST);
                    // gradient color between cyan and purple
                    const t = Math.random();
                    const color = t < 0.5 ? "rgba(0,255,200," + alpha.toFixed(3) + ")" : "rgba(127,92,255," + (alpha * 0.9).toFixed(3) + ")";
                    meshCtx.beginPath();
                    meshCtx.strokeStyle = color;
                    meshCtx.lineWidth = 0.9;
                    meshCtx.moveTo(a.x, a.y);
                    meshCtx.lineTo(b.x, b.y);
                    meshCtx.stroke();
                }
            }
        }

        // draw nodes (soft glow)
        for (let n of nodes) {
            const pulse = 0.6 + 0.4 * Math.sin((t * 0.002) + n.pulse);
            const radius = n.r * (0.9 + pulse * 0.8);

            // create radial gradient for each node (subtle)
            const g = meshCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6);
            g.addColorStop(0, "rgba(255,255,255,0.9)");
            g.addColorStop(0.06, "rgba(0,255,200,0.25)");
            g.addColorStop(0.2, "rgba(127,92,255,0.12)");
            g.addColorStop(1, "rgba(0,0,0,0)");

            meshCtx.fillStyle = g;
            meshCtx.beginPath();
            meshCtx.arc(n.x, n.y, radius * 2.8, 0, Math.PI * 2);
            meshCtx.fill();
        }
    }

    // ------------- TRACES (subtle circuit lines) -------------
    // We'll draw a set of diagonal "traces" (sparse), each is a path that slowly translates diagonally.
    let traces = [];
    const TRACE_COUNT_BASE = 16;

    function initTraces() {
        traces = [];
        const count = Math.max(10, Math.floor((w * h) / 200000));
        for (let i = 0; i < count; i++) {
            const startX = Math.random() * w * 1.2 - w * 0.1;
            const startY = Math.random() * h * 1.2 - h * 0.1;
            const len = 180 + Math.random() * 420;
            const thickness = 0.6 + Math.random() * 1.2;
            const huePick = Math.random();
            traces.push({
                x: startX,
                y: startY,
                len,
                thickness,
                speed: 0.02 + Math.random() * 0.06,
                phase: Math.random() * Math.PI * 2,
                huePick,
                segments: 2 + Math.floor(Math.random() * 4),
            });
        }
    }

    function drawTraces(dt, t) {
        traceCtx.clearRect(0, 0, w, h);

        // create a faint grid of circuit-ish lines (very subtle)
        const spacing = Math.max(90, Math.min(180, Math.round(Math.min(w, h) / 12)));
        traceCtx.lineWidth = 0.5;
        traceCtx.strokeStyle = "rgba(255,255,255,0.02)";
        for (let x = 0; x < w; x += spacing) {
            traceCtx.beginPath();
            traceCtx.moveTo(x + (t * 0.0002 % spacing), 0);
            traceCtx.lineTo(x + (t * 0.0002 % spacing) + 0.5, h);
            traceCtx.stroke();
        }

        // draw each trace path
        for (let tr of traces) {
            // move diagonally
            tr.x += (Math.cos(tr.phase + t * 0.00012) * tr.speed * 40);
            tr.y += (Math.sin(tr.phase + t * 0.0001) * tr.speed * 40);

            // wrap around bounds
            if (tr.x < -tr.len) tr.x = w + tr.len;
            if (tr.x > w + tr.len) tr.x = -tr.len;
            if (tr.y < -tr.len) tr.y = h + tr.len;
            if (tr.y > h + tr.len) tr.y = -tr.len;

            // choose color subtle: mostly cyan/purple very low alpha
            const c = tr.huePick < 0.5 ? "rgba(0,255,200,0.06)" : "rgba(127,92,255,0.06)";

            traceCtx.strokeStyle = c;
            traceCtx.lineWidth = tr.thickness;

            // draw segmented polyline (like a circuit trace)
            traceCtx.beginPath();
            let sx = tr.x;
            let sy = tr.y;
            traceCtx.moveTo(sx, sy);
            const segs = tr.segments;
            for (let s = 0; s < segs; s++) {
                const nx = sx + (Math.cos((s + tr.phase) * 1.2) * (tr.len / segs));
                const ny = sy + (Math.sin((s + tr.phase) * 0.9) * (tr.len / (segs * 2)));
                traceCtx.lineTo(nx, ny);
                sx = nx;
                sy = ny;
            }
            // slight glow stroke (draw twice: thin bright then faint wide)
            traceCtx.stroke();

            // faint outer glow
            traceCtx.globalAlpha = 0.18;
            traceCtx.lineWidth = tr.thickness * 3.2;
            traceCtx.stroke();
            traceCtx.globalAlpha = 1;
            traceCtx.lineWidth = tr.thickness;
        }
    }

    // ------------- animation loop -------------
    let last = performance.now();
    function frame(now) {
        const dt = now - last;
        last = now;

        drawTraces(dt, now);
        drawMesh(dt, now);

        requestAnimationFrame(frame);
    }

    // init / resize
    function resetAll() {
        resize();
        initNodes();
        initTraces();
    }

    window.addEventListener("resize", () => {
        // debounce-like
        clearTimeout(window._bgResizeTimeout);
        window._bgResizeTimeout = setTimeout(() => {
            resetAll();
        }, 120);
    });

    // optionally pause animation on low-power devices
    let canAnimate = true;
    try {
        const nav = navigator;
        if (nav && (nav.connection && nav.connection.saveData)) {
            canAnimate = false;
        }
    } catch (e) {}

    resetAll();
    if (canAnimate) {
        requestAnimationFrame((t) => {
            last = t;
            requestAnimationFrame(frame);
        });
    }
})();