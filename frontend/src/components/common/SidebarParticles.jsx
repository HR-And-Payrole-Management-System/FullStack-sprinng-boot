import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARAMS = {
  count: 7000,          // sidebar តូច និងបង្ហាញរាល់ទំព័រ — count ធំពេកនឹងធ្វើឲ្យគាំង
  size: 0.001,
  radius: 5,
  branches: 10,
  spin: 0.6,
  randomness: 0.01,       // ត្រូវតូច ដើម្បីចំណុចនៅជិត camera ឃើញច្បាស់
  randomnessPower: 10,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
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

function SidebarParticles() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ការពារ container 0×0 ពេល sidebar mount មុន layout ចប់សព្វគ្រប់
    let width = container.clientWidth;
    let height = container.clientHeight;
    if (width === 0 || height === 0) {
      const rect = container.getBoundingClientRect();
      width = rect.width || 260;
      height = rect.height || window.innerHeight;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = generateGalaxy(PARAMS);
    const material = new THREE.PointsMaterial({
      size: PARAMS.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
    });
    const galaxy = new THREE.Points(geometry, material);
    galaxy.rotation.x = 0.9; // ផ្ដេកជាងមុន — សម ក្នុងបន្ទះចង្អៀត បណ្តោយវែង
    scene.add(galaxy);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      galaxy.rotation.y = clock.getElapsedTime() * 0.05;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
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

  return <div ref={mountRef} className="ent-sidebar-particles" />;
}

export default SidebarParticles;