import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DottedSurface({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Pulizia per Vite HMR
        containerRef.current.innerHTML = '';

        const SEPARATION = 100;
        const AMOUNTX = 70; // Aumentato per coprire più orizzonte
        const AMOUNTY = 70;

        // 1. Setup Scena
        const scene = new THREE.Scene();
        
        // Colore sfondo scuro profondo
        const bgColor = 0x020205;
        scene.fog = new THREE.Fog(bgColor, 1000, 3000); // Nebbia per dare profondità all'orizzonte

        const camera = new THREE.PerspectiveCamera(
            65, // Campo visivo leggermente più largo
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        
        // POSIZIONE CAMERA: Abbassata e allontanata per vedere l'onda in prospettiva (effetto mare)
        camera.position.set(0, 650, 1500); 
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(bgColor, 1);

        containerRef.current.appendChild(renderer.domElement);

        // 2. Creazione Particelle
        const numParticles = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(numParticles * 3);
        const colors = new Float32Array(numParticles * 3);

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Posizionamento sulla griglia XZ (orizzontale)
                positions[i * 3] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                positions[i * 3 + 1] = 0; // Altezza Y (iniziale)
                positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                // Colori Cyber
                if (Math.random() > 0.5) {
                    colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0; // Ciano
                } else {
                    colors[i * 3] = 0.44; colors[i * 3 + 1] = 0.0; colors[i * 3 + 2] = 1.0; // Viola
                }
                i++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 5, // Pallini leggermente più grandi per l'effetto wow
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let count = 0;
        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const posAttr = geometry.attributes.position;
            const posArray = posAttr.array as Float32Array;

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    // MATEMATICA ONDA DINAMICA
                    // La Y cambia in base a ix e iy nel tempo (count)
                    posArray[i * 3 + 1] =
                        Math.sin((ix + count) * 0.3) * 50 +
                        Math.sin((iy + count) * 0.5) * 50;
                    i++;
                }
            }

            posAttr.needsUpdate = true;
            
            // Rotazione lenta della telecamera per dare dinamismo
            points.rotation.y = Math.sin(count * 0.1) * 0.05;

            renderer.render(scene, camera);
            count += 0.05;
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            // Z-INDEX A -1 per stare dietro al testo
            className={`pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[#020205] ${className || ''}`}
        />
    );
}
