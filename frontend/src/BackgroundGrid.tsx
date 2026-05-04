import React from 'react';

interface BackgroundGridProps {
  speed: number;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ speed }) => {
  const rows = 20;
  const cols = 20;
  const cells = Array.from({ length: rows * cols });

  // Map maze speed (ms) to background animation duration (s)
  // Fast: 5ms -> 2s
  // Medium: 20ms -> 6s
  // Slow: 50ms -> 12s
  const getDuration = (s: number) => {
    if (s <= 5) return '2s';
    if (s <= 20) return '6s';
    return '12s';
  };

  const duration = getDuration(speed);

  return (
    <div className="background-grid-wrapper">
      {cells.map((_, i) => (
        <div
          key={i}
          className="background-cell"
          style={{
            animationDuration: duration,
            animationDelay: `${Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundGrid;
