import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARAMS = {
  count: 300000,
  size: 0.01,
  radius: 5,
  branches: 19,
  spin:0.7,
  randomness: 1000,
  randomnessPower: 30,
  insideColor: '#5EEAD4',  // teal — matches your existing brand accent dot
  outsideColor: '#4C6FFF', // indigo — matches your existing primary/link color
};

function generateGalaxy(params) {
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius * 0.4;
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

    positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone().lerp(colorOutside, radius / params.radius);
    colors[i3]     = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function GalaxyBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true — transparent canvas, panel's own background shows through
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = generateGalaxy(PARAMS);
    const material = new THREE.PointsMaterial({
      size: PARAMS.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // glowing overlap where particles cross, like real star density
      vertexColors: true,
      transparent: true,
    });
    const galaxy = new THREE.Points(geometry, material);
    galaxy.rotation.x = 0.5; // tilt so it reads as a disc, not a flat ring
    scene.add(galaxy);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      galaxy.rotation.y = clock.getElapsedTime() * 0.05; // slow continuous spin
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="auth-particles" />;
}

export default GalaxyBackground;