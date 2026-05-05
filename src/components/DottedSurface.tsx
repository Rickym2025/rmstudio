import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DottedSurface() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        // PALLINI PIÙ FITTI (60 invece di 100) E PIÙ NUMEROSI (150x150)
        const SEPARATION = 60;
        const AMOUNTX = 150;
        const AMOUNTY = 150;

        const scene = new THREE.Scene();
        const bgColor = 0x020205;
        scene.fog = new THREE.Fog(bgColor, 800, 3000); // Nebbia per un bell'orizzonte sfumato

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );

        // LA SOLUZIONE EFFETTO DRONE: 
        // Telecamera molto alta (Y=800) e spinta indietro (Z=1500)
        camera.position.set(0, 800, 1500);
        // Guarda esattamente verso il centro del pavimento
        camera.lookAt(0, 0, 0); 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(bgColor, 1);
        containerRef.current.appendChild(renderer.domElement);

        const numParticles = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(numParticles * 3);
        const colors = new Float32Array(numParticles * 3);

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Griglia sul pavimento
                positions[i * 3] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                positions[i * 3 + 1] = 0; 
                positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                if (Math.random() > 0.5) {
                    colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0; 
                } else {
                    colors[i * 3] = 0.44; colors[i * 3 + 1] = 0.0; colors[i * 3 + 2] = 1.0; 
                }
                i++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 3, // Pallini leggermente più piccoli per maggiore eleganza
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const points = new THREE.Points(geometry, material);
        
        // Lo spostiamo leggermente in basso rispetto al testo
        points.position.y = -200;
        
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
                    // Onde fluide ed eleganti
                    posArray[i * 3 + 1] =
                        Math.sin((ix + count) * 0.3) * 50 +
                        Math.sin((iy + count) * 0.5) * 50;
                    i++;
                }
            }

            posAttr.needsUpdate = true;
            renderer.render(scene, camera);
            count += 0.03; 
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
            className="fixed inset-0 z-[-1] bg-[#020205] overflow-hidden pointer-events-none"
        />
    );
}
