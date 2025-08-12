'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    const objects: THREE.Mesh[] = [];

    const initThreeJS = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 20;

      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.ConeGeometry(0.8, 1.5, 32),
        new THREE.TorusGeometry(0.7, 0.2, 16, 100),
        new THREE.DodecahedronGeometry(1),
        new THREE.OctahedronGeometry(1),
      ];

      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1, // primary color
        metalness: 0.3,
        roughness: 0.6,
      });

      for (let i = 0; i < 50; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const object = new THREE.Mesh(geometry, material);

        object.position.x = (Math.random() - 0.5) * 50;
        object.position.y = (Math.random() - 0.5) * 50;
        object.position.z = (Math.random() - 0.5) * 50;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        const scale = Math.random() * 0.5 + 0.5;
        object.scale.set(scale, scale, scale);

        scene.add(object);
        objects.push(object);
      }

      window.addEventListener('resize', onWindowResize, false);
      animate();
    };

    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if(renderer && scene && camera) {
        const elapsedTime = clock.getElapsedTime();

        // Animate objects
        for (const object of objects) {
            object.rotation.x += 0.005;
            object.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
      }
    };
    
    initThreeJS();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onWindowResize);
        if (renderer) {
            renderer.dispose();
        }
        if (scene) {
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                      object.material.dispose();
                    }
                }
            });
        }
    }
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" className="w-full h-full" />;
}
