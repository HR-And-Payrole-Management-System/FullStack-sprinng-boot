import { useMemo, useCallback } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Module-level so the init reference stays stable across renders
async function initEngine(engine) {
  await loadSlim(engine);
}

function SidebarParticles() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 30,
      particles: {
        number: {
          value: 1000, // Count: 70
          density: { enable: true, area: 800 },
        },
        color: { value: ['#8b5cf6', '#c084fc', '#60a5fa', '#f0abfc'] }, // matrix green
        shape: { type: 'circle' },
        opacity: {
          value: 0.01,
          animation: { enable: true, speed: 0.6, sync: false, startValue: 'random' },
        },
        size: { value: { min: 1, max: 4.5 } }, // Size: 4.5
        links: {
          enable: true,
          distance: 40,
          color: '#8b5cf6',
          opacity: 1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5, // Speed: 1
          direction: 'bottom', // falling "digital rain" motion
          straight: true,
          random: false,
          outModes: { default: 'out', bottom: 'out', top: 'none' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' }, // Hover: ON
          onClick: { enable: true, mode: 'push' }, // Click: ON
          resize: true,
        },
        modes: {
          grab: { distance: 120, links: { opacity: 0.5 } }, // Hover strength: 120
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
        id="sidebar-particles"
        className="ent-sidebar-particles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </ParticlesProvider>
  );
}

export default SidebarParticles;