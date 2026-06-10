(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Boot Sequence ── */
  const boot = document.getElementById("bootSequence");
  const bootBar = document.getElementById("bootProgress");
  const bootSync = document.getElementById("bootSync");
  const bootCanvas = document.getElementById("bootCanvas");

  const syncMessages = [
    "Establishing neural handshake...",
    "Synchronizing signal relays...",
    "Calibrating data streams...",
    "Mapping topology nodes...",
    "Verifying AI coherence...",
    "All channels nominal."
  ];

  function initBootParticles() {
    if (!bootCanvas) return null;
    const ctx = bootCanvas.getContext("2d");
    let particles = [];
    let animId;

    function resize() {
      bootCanvas.width = window.innerWidth;
      bootCanvas.height = window.innerHeight;
      const count = Math.floor((bootCanvas.width * bootCanvas.height) / 12000);
      particles = Array.from({ length: Math.min(count, 80) }, () => ({
        x: Math.random() * bootCanvas.width,
        y: Math.random() * bootCanvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, bootCanvas.width, bootCanvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > bootCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > bootCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    if (!prefersReducedMotion) draw();

    return { resize, stop: () => cancelAnimationFrame(animId) };
  }

  function runBootSequence() {
    if (!boot || prefersReducedMotion) {
      document.body.classList.remove("boot-active");
      if (boot) boot.classList.add("complete");
      return;
    }

    const bootAnim = initBootParticles();
    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 8 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        bootSync.textContent = syncMessages[syncMessages.length - 1];
        setTimeout(() => {
          boot.classList.add("complete");
          document.body.classList.remove("boot-active");
          if (bootAnim) bootAnim.stop();
        }, 600);
      } else {
        bootBar.style.width = progress + "%";
        const newIndex = Math.floor((progress / 100) * (syncMessages.length - 1));
        if (newIndex !== msgIndex) {
          msgIndex = newIndex;
          bootSync.textContent = syncMessages[msgIndex];
        }
      }
    }, 180);

    window.addEventListener("resize", () => bootAnim && bootAnim.resize());
  }

  runBootSequence();

  /* ── Signal Orb Navigation ── */
  const orbTrigger = document.getElementById("orbTrigger");
  const radialMenu = document.getElementById("radialMenu");
  const menuLinks = radialMenu ? radialMenu.querySelectorAll("a") : [];

  const menuPositions = [
    { x: 0, y: -90 },
    { x: 78, y: -45 },
    { x: 78, y: 45 },
    { x: 0, y: 90 },
    { x: -78, y: 45 },
    { x: -78, y: -45 }
  ];

  menuLinks.forEach((link, i) => {
    if (menuPositions[i]) {
      link.style.left = `calc(50% + ${menuPositions[i].x}px)`;
      link.style.top = `calc(50% + ${menuPositions[i].y}px)`;
      link.style.transitionDelay = radialMenu.classList.contains("open") ? `${i * 0.04}s` : "0s";
    }
  });

  function toggleMenu(open) {
    if (!orbTrigger || !radialMenu) return;
    const isOpen = open ?? orbTrigger.getAttribute("aria-expanded") !== "true";
    orbTrigger.setAttribute("aria-expanded", isOpen);
    radialMenu.classList.toggle("open", isOpen);
    menuLinks.forEach((link, i) => {
      link.style.transitionDelay = isOpen ? `${i * 0.04}s` : "0s";
    });
  }

  if (orbTrigger) {
    orbTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (radialMenu && !e.target.closest(".signal-orb-nav")) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  /* ── Signal Grid Expansion Waves ── */
  document.querySelectorAll(".signal-node").forEach((node) => {
    node.addEventListener("mouseenter", (e) => {
      if (prefersReducedMotion) return;
      const rect = node.getBoundingClientRect();
      const wave = document.createElement("span");
      wave.className = "expansion-wave";
      wave.style.left = (e.clientX - rect.left) + "px";
      wave.style.top = (e.clientY - rect.top) + "px";
      node.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove());
    });

    node.addEventListener("mousemove", (e) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
      node.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
    });
  });

  /* ── Module Stack Accordion ── */
  document.querySelectorAll(".module-layer").forEach((layer) => {
    const header = layer.querySelector(".module-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isExpanded = layer.classList.contains("expanded");
      document.querySelectorAll(".module-layer.expanded").forEach((l) => {
        if (l !== layer) {
          l.classList.remove("expanded");
          l.querySelector(".module-header")?.setAttribute("aria-expanded", "false");
        }
      });
      layer.classList.toggle("expanded", !isExpanded);
      header.setAttribute("aria-expanded", !isExpanded);
    });
  });

  /* ── Network Topology Canvas ── */
  const topoCanvas = document.getElementById("topologyCanvas");
  const zoneTags = document.querySelectorAll(".zone-tag");

  if (topoCanvas) {
    const tCtx = topoCanvas.getContext("2d");
    let topoNodes = [];
    let topoAnimId;
    let highlightZone = null;

    const zones = {
      processing: { color: "#00E5FF", indices: [0, 1, 2] },
      routing: { color: "#A78BFA", indices: [3, 4, 5] },
      analysis: { color: "#34d399", indices: [6, 7] },
      storage: { color: "#fbbf24", indices: [8, 9] },
      prediction: { color: "#f472b6", indices: [10, 11] }
    };

    function initTopology() {
      const w = topoCanvas.offsetWidth;
      const h = topoCanvas.offsetHeight;
      topoCanvas.width = w * devicePixelRatio;
      topoCanvas.height = h * devicePixelRatio;
      tCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.35;

      topoNodes = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const ring = i < 4 ? 0.6 : i < 8 ? 0.85 : 1.1;
        return {
          x: cx + Math.cos(angle) * r * ring,
          y: cy + Math.sin(angle) * r * ring,
          r: 5 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          zone: Object.entries(zones).find(([, z]) => z.indices.includes(i))?.[0] || "processing"
        };
      });
    }

    function drawTopology(time) {
      const w = topoCanvas.offsetWidth;
      const h = topoCanvas.offsetHeight;
      tCtx.clearRect(0, 0, w, h);

      const connections = [];
      for (let i = 0; i < topoNodes.length; i++) {
        for (let j = i + 1; j < topoNodes.length; j++) {
          const dx = topoNodes[i].x - topoNodes[j].x;
          const dy = topoNodes[i].y - topoNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < w * 0.45) connections.push([i, j, dist]);
        }
      }

      connections.forEach(([i, j, dist]) => {
        const n1 = topoNodes[i];
        const n2 = topoNodes[j];
        const highlighted = highlightZone && (n1.zone === highlightZone || n2.zone === highlightZone);
        const alpha = highlighted ? 0.5 : 0.12;
        const maxDist = w * 0.45;

        tCtx.beginPath();
        tCtx.moveTo(n1.x, n1.y);
        tCtx.lineTo(n2.x, n2.y);
        tCtx.strokeStyle = highlighted
          ? zones[highlightZone]?.color || "rgba(0,229,255,0.5)"
          : `rgba(0, 229, 255, ${alpha * (1 - dist / maxDist)})`;
        tCtx.lineWidth = highlighted ? 1.5 : 0.5;
        tCtx.stroke();

        if (!prefersReducedMotion) {
          const pulsePos = ((time * 0.001) % 1);
          const px = n1.x + (n2.x - n1.x) * pulsePos;
          const py = n1.y + (n2.y - n1.y) * pulsePos;
          if (highlighted || Math.random() > 0.7) {
            tCtx.beginPath();
            tCtx.arc(px, py, 2, 0, Math.PI * 2);
            tCtx.fillStyle = zones[n1.zone]?.color || "#00E5FF";
            tCtx.fill();
          }
        }
      });

      topoNodes.forEach((n) => {
        n.pulse += 0.03;
        const glow = Math.sin(n.pulse) * 0.3 + 0.7;
        const zoneColor = zones[n.zone]?.color || "#00E5FF";
        const active = !highlightZone || n.zone === highlightZone;

        tCtx.beginPath();
        tCtx.arc(n.x, n.y, n.r * (active ? glow : 0.7), 0, Math.PI * 2);
        tCtx.fillStyle = active ? zoneColor : "rgba(230,247,255,0.2)";
        tCtx.fill();

        if (active) {
          tCtx.beginPath();
          tCtx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
          tCtx.strokeStyle = `rgba(0, 229, 255, ${glow * 0.3})`;
          tCtx.lineWidth = 1;
          tCtx.stroke();
        }
      });

      topoAnimId = requestAnimationFrame(drawTopology);
    }

    zoneTags.forEach((tag) => {
      tag.addEventListener("mouseenter", () => {
        highlightZone = tag.dataset.zone;
        tag.classList.add("active");
      });
      tag.addEventListener("mouseleave", () => {
        highlightZone = null;
        tag.classList.remove("active");
      });
    });

    initTopology();
    if (!prefersReducedMotion) drawTopology(0);

    window.addEventListener("resize", () => {
      cancelAnimationFrame(topoAnimId);
      initTopology();
      if (!prefersReducedMotion) drawTopology(0);
    });
  }

  /* ── Synthetic Field Visualizer ── */
  const fieldCanvas = document.getElementById("fieldCanvas");
  const fieldLayer = document.getElementById("fieldLayer");

  if (fieldCanvas && fieldLayer) {
    const fCtx = fieldCanvas.getContext("2d");
    let fieldAnimId;
    let scrollFactor = 0;

    function resizeField() {
      fieldCanvas.width = fieldLayer.offsetWidth * devicePixelRatio;
      fieldCanvas.height = fieldLayer.offsetHeight * devicePixelRatio;
      fCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function drawField(time) {
      const w = fieldLayer.offsetWidth;
      const h = fieldLayer.offsetHeight;
      fCtx.clearRect(0, 0, w, h);

      const gridSize = 40;
      const offset = scrollFactor * 100;

      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const wave = Math.sin((x + y) * 0.02 + time * 0.001 + scrollFactor * 5) * 0.5 + 0.5;
          const alpha = wave * 0.08;
          fCtx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
          fCtx.fillRect(x, y + offset % gridSize, gridSize - 1, gridSize - 1);
        }
      }

      const midY = h / 2;
      fCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = midY +
          Math.sin(x * 0.015 + time * 0.002 + scrollFactor * 3) * 40 +
          Math.sin(x * 0.03 + time * 0.001) * 20;
        if (x === 0) fCtx.moveTo(x, y);
        else fCtx.lineTo(x, y);
      }
      fCtx.strokeStyle = `rgba(167, 139, 250, ${0.4 + scrollFactor * 0.2})`;
      fCtx.lineWidth = 1.5;
      fCtx.stroke();

      fCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = midY +
          Math.cos(x * 0.02 + time * 0.0015) * 30 +
          scrollFactor * 20;
        if (x === 0) fCtx.moveTo(x, y);
        else fCtx.lineTo(x, y);
      }
      fCtx.strokeStyle = `rgba(0, 229, 255, ${0.3 + scrollFactor * 0.15})`;
      fCtx.lineWidth = 1;
      fCtx.stroke();

      for (let i = 0; i < 5; i++) {
        const px = (w / 6) * (i + 1);
        const py = midY + Math.sin(time * 0.002 + i + scrollFactor * 4) * 60;
        const pr = 3 + Math.sin(time * 0.003 + i) * 2;
        fCtx.beginPath();
        fCtx.arc(px, py, pr, 0, Math.PI * 2);
        fCtx.fillStyle = `rgba(0, 229, 255, ${0.5 + scrollFactor * 0.3})`;
        fCtx.fill();
      }

      fieldAnimId = requestAnimationFrame(drawField);
    }

    resizeField();
    if (!prefersReducedMotion) drawField(0);

    window.addEventListener("resize", resizeField);

    const fieldObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          scrollFactor = entry.intersectionRatio;
        });
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    fieldObserver.observe(fieldLayer);

    window.addEventListener("scroll", () => {
      const rect = fieldLayer.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = 1 - Math.max(0, Math.min(1, rect.top / viewH));
      scrollFactor = Math.max(scrollFactor, progress * 0.5);
    });
  }

  /* ── Relay Button ── */
  const relayBtn = document.getElementById("relayBtn");
  const signalCore = document.querySelector(".signal-core-wrap");

  if (relayBtn) {
    relayBtn.addEventListener("mouseenter", () => {
      relayBtn.classList.add("intense");
      signalCore?.classList.add("glitch-active");
    });
    relayBtn.addEventListener("mouseleave", () => {
      relayBtn.classList.remove("intense");
    });
    relayBtn.addEventListener("click", () => {
      if (!prefersReducedMotion) {
        signalCore?.classList.add("glitch-active");
        setTimeout(() => signalCore?.classList.remove("glitch-active"), 150);
      }
      relayBtn.textContent = "RELAY ACTIVE";
      setTimeout(() => {
        relayBtn.textContent = "ACTIVATE RELAY";
      }, 2000);
    });
  }

  /* ── Duplicate stream packets for infinite loop ── */
  const streamTrack = document.getElementById("streamTrack");
  if (streamTrack) {
    const packets = streamTrack.innerHTML;
    streamTrack.innerHTML = packets + packets;
  }

  /* ── Live status flicker values ── */
  const uptimeEl = document.getElementById("statusUptime");
  if (uptimeEl && !prefersReducedMotion) {
    setInterval(() => {
      uptimeEl.classList.toggle("status-flicker");
    }, 4000);
  }
})();
