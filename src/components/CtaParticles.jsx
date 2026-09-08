import { useMemo, useCallback } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

async function initEngine(engine) {
  await loadSlim(engine);
}

export default function CtaParticles() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 30,
      particles: {
        number: {
          value: 600,
          density: { enable: true, area: 900 },
        },
        color: { value: ['#FFFFFF', '#C7D2FE'] },
        shape: { type: 'circle' },
        opacity: {
          value: 100,
          animation: { enable: true, speed: 0.5, sync: false, startValue: 'random' },
        },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 120,
          color: '#FFFFFF',
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.4,
          direction: 'none',
          random: true,
          outModes: { default: 'out' },
        },
      },
      interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      detectRetina: true,
    }),
    []
  );

  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="cta-particles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </ParticlesProvider>
  );
}