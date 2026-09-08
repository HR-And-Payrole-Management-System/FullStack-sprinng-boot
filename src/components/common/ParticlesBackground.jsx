import { useMemo, useCallback } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Module-level so the reference is stable across renders/remounts —
// ParticlesProvider requires the init callback to stay identical.
async function initEngine(engine) {
  await loadSlim(engine);
}

function ParticlesBackground() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 10000,
      particles: {
        number: {
          value: 600,
          density: { enable: true, area: 900 },
        },
        color: { value: ['#5B7BFF', '#4ADE80', '#E2E8F0'] },
        opacity: {
          value: 0.75,
          animation: { enable: true, speed: 0.5, sync: false, startValue: 'random' },
        },
        size: { value: { min: 1.5, max: 3.5 } },
        links: {
          enable: true,
          distance: 140,
          color: '#64748B',
          opacity: 0.35,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          outModes: { default: 'bounce' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.6 } },
          push: { quantity: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="hrms-auth-particles"
        className="auth-particles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </ParticlesProvider>
  );
}

export default ParticlesBackground;