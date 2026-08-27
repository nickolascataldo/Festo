document.addEventListener("DOMContentLoaded", () => {
  /* ===================================================
     1. Ambient Canvas Particle & Sparkle Effect
  =================================================== */
  const canvas = document.getElementById("atmosphere-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();

  const particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    alpha: Math.random(),
    speedY: -Math.random() * 0.4 - 0.1,
    color: Math.random() > 0.5 ? "#c042ff" : "#00ff66"
  }));

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      if (p.y < 0) p.y = canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  const countdown = document.getElementById("halloween-countdown");

  function updateCountdown() {
    const now = new Date();
    let halloween = new Date(now.getFullYear(), 9, 31);
    if (now >= halloween) halloween = new Date(now.getFullYear() + 1, 9, 31);
    const remaining = halloween.getTime() - now.getTime();
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});