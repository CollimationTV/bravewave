import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleDissolveProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ParticleDissolve = ({ trigger, onComplete }: ParticleDissolveProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsAnimating(true);
    
    // Create particles from center
    const newParticles: Particle[] = [];
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      
      newParticles.push({
        id: i,
        x: 50,
        y: 50,
        size: 2 + Math.random() * 4,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 1,
        color: `hsl(var(--primary))`,
      });
    }
    
    setParticles(newParticles);

    // Animate particles
    const animationDuration = 800;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          opacity: 1 - progress,
          speedY: p.speedY + 0.1, // Add gravity
        }))
      );
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setParticles([]);
        onComplete?.();
      }
    };
    
    requestAnimationFrame(animate);
  }, [trigger, onComplete]);

  if (!isAnimating && particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            transition: 'none',
          }}
        />
      ))}
      
      {/* Radial glow effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 70%)`,
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
        }}
      />
    </div>
  );
};
