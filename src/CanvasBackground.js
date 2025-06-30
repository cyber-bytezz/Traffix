import React, { useRef, useEffect } from 'react';

const NUM_PARTICLES = 30;

function randomParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 3 + 1,
    opacity: Math.random() * 0.3 + 0.1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
  };
}

export default function CanvasBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: NUM_PARTICLES }, () => randomParticle(canvas.width, canvas.height));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particlesRef.current) {
        // Animate
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;
        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        // Draw
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(0,212,255,${p.opacity})`);
        grad.addColorStop(0.5, `rgba(255,107,107,${p.opacity * 0.7})`);
        grad.addColorStop(1, 'rgba(76,205,196,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
      style={{ display: 'block' }}
    />
  );
} 