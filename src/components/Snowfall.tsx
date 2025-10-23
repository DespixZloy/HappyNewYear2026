import { useMemo } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
  delay: number;
  drift: number;
}

export function Snowfall() {
  const snowflakes = useMemo<Snowflake[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 15 + Math.random() * 15,
      opacity: 0.4 + Math.random() * 0.5,
      size: 3 + Math.random() * 4,
      delay: Math.random() * -30,
      drift: (Math.random() - 0.5) * 30,
    }))
  , []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute will-change-transform"
            style={{
              left: `${flake.left}%`,
              top: '-10px',
              animation: `snowfall-${flake.id} ${flake.animationDuration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
            }}
          >
            <div
              className="rounded-full bg-white"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        ${snowflakes.map((flake) => `
          @keyframes snowfall-${flake.id} {
            0% {
              transform: translate3d(0, -10px, 0);
            }
            100% {
              transform: translate3d(${flake.drift}px, 110vh, 0);
            }
          }
        `).join('')}
      `}</style>
    </>
  );
}
