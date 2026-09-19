import { useMemo, useCallback } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

async function initEngine(engine) {
  await loadSlim(engine);
}

function ParticlesBackground() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } }, // let .auth-brand-panel's own gradient be the "deep space"
      fpsLimit: 60,
      detectRetina: true,

      particles: {
        number: {
          value: 130, // was 160 — fewer since they're now a bit bigger
          density: { enable: true, area: 900 },
        },
        color: {
          value: ["#FFFFFF", "#93C5FD", "#60A5FA", "#818CF8", "#C084FC"],
        },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.35, max: 0.95 }, // was { min: 0.15, max: 0.9 } — raised the floor so dim stars still show color
          animation: { enable: true, speed: 0.5, sync: false, startValue: "random" },
        },
        size: {
          value: { min: 1, max: 3 }, // was { min: 0.5, max: 2.2 } — big enough for the hue to register
          animation: { enable: true, speed: 1.2, sync: false },
        },
        links: { enable: false },
        move: {
          enable: true,
          speed: { min: 0.05, max: 0.3 },
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
      },

      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
          resize: { enable: true },
        },
        modes: {
          bubble: { distance: 120, size: 4, opacity: 1, duration: 2 },
        },
      },

      // Two shooting stars from different corners, on different timers, for variety
      emitters: [
        {
          position: { x: 0, y: 15 },
          rate: { quantity: 1, delay: 7 },
          particles: {
            move: { direction: "bottom-right", speed: 16, straight: true, outModes: { default: "destroy" } },
            size: { value: 2 },
            life: { duration: { sync: true, value: 1 } },
            opacity: { value: 1 },
            color: { value: "#FFFFFF" },
            shape: { type: "circle" },
            trail: { enable: true, length: 22, fill: { color: "transparent" } }, // was the opaque #030712 — that painted a dark smear
          },
        },
        {
          position: { x: 90, y: 60 },
          rate: { quantity: 1, delay: 11 },
          particles: {
            move: { direction: "bottom-left", speed: 12, straight: true, outModes: { default: "destroy" } },
            size: { value: 1.6 },
            life: { duration: { sync: true, value: 1 } },
            opacity: { value: 1 },
            color: { value: "#C084FC" },
            shape: { type: "circle" },
            trail: { enable: true, length: 18, fill: { color: "transparent" } },
          },
        },
      ],
    }),
    []
  );

  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="enterprise-galaxy"
        className="auth-particles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </ParticlesProvider>
  );
}

export default ParticlesBackground;