import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Multicolored burst
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
  });
};

export const triggerLevelUpFireworks = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 },
      colors: ['#ffd700', '#ff8000', '#a855f7', '#00f0ff']
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 },
      colors: ['#3b82f6', '#10b981', '#ec4899', '#f43f5e']
    });
  }, 250);
};

export const triggerCoinShower = () => {
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#f59e0b', '#fbbf24', '#fef08a', '#d97706'],
    shapes: ['circle'],
    scalar: 1.2
  });
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#f59e0b', '#fbbf24', '#fef08a', '#d97706'],
    shapes: ['circle'],
    scalar: 1.2
  });
};

export const triggerComboBurst = () => {
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#ff4500', '#ff8c00', '#ffd700', '#ff1493'],
    scalar: 1.1
  });
};
