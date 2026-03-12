import React, { useEffect, useRef } from 'react';

const Particles = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, pts = [], raf;
    
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener("resize", resize);
    
    for (let i = 0; i < 90; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - .5) * .1, // much slower
        vy: (Math.random() - .5) * .1,
        r: Math.random() * 2 + 0.5, // slightly larger dots
        colorType: i % 3 // 0 cyan, 1 purple, 2 radium
      });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around instead of bouncing for a more continuous flow
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        let colorStr = "rgba(0,212,255,1)"; // Blue neon default
        if (p.colorType === 1) colorStr = "rgba(155,109,255,0.8)"; // Purple
        else if (p.colorType === 2) colorStr = "rgba(255,7,58,0.7)"; // Red neon

        ctx.fillStyle = colorStr;
        ctx.shadowBlur = p.r * 8; // Glowing effect
        ctx.shadowColor = colorStr;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      });
      
      raf = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  
  return <canvas id="bg" ref={ref} style={{ opacity: .4, position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

export default Particles;
