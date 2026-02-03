"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Floating geometric shape that reacts to mouse position
 */
function FloatingShape({
    position,
    geometry,
    color,
    speed = 1,
    distort = 0.3,
}: {
    position: [number, number, number];
    geometry: "sphere" | "torus" | "icosahedron" | "octahedron";
    color: string;
    speed?: number;
    distort?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { pointer } = useThree();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Subtle rotation
        meshRef.current.rotation.x += delta * 0.1 * speed;
        meshRef.current.rotation.y += delta * 0.15 * speed;

        // Mouse influence on position
        const mouseInfluence = 0.3;
        meshRef.current.position.x = position[0] + pointer.x * mouseInfluence;
        meshRef.current.position.y = position[1] + pointer.y * mouseInfluence;
    });

    const getGeometry = () => {
        switch (geometry) {
            case "sphere":
                return <sphereGeometry args={[1, 32, 32]} />;
            case "torus":
                return <torusGeometry args={[1, 0.4, 16, 32]} />;
            case "icosahedron":
                return <icosahedronGeometry args={[1, 0]} />;
            case "octahedron":
                return <octahedronGeometry args={[1, 0]} />;
            default:
                return <sphereGeometry args={[1, 32, 32]} />;
        }
    };

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={0.8}>
                {getGeometry()}
                <MeshDistortMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.8}
                    distort={distort}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

/**
 * Animated particle field with mouse interaction
 */
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);
    const { pointer } = useThree();

    const particleCount = 150; // Reduced for performance

    // Create particles geometry
    const particlesGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geometry;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const positionAttribute = pointsRef.current.geometry.getAttribute("position");
        if (!positionAttribute) return;

        const positions = positionAttribute.array as Float32Array;
        const time = state.clock.elapsedTime;
        const len = positions.length;

        for (let i3 = 0; i3 < len; i3 += 3) {
            const idx = i3 / 3;

            // Gentle wave motion - direct update with known valid indices
            const waveX = Math.sin(time * 0.5 + idx * 0.1) * 0.001;
            const waveY = Math.cos(time * 0.5 + idx * 0.1) * 0.001;

            const posX = positions[i3]!;
            const posY = positions[i3 + 1]!;

            let newX = posX + waveX;
            let newY = posY + waveY;

            // Mouse repulsion effect
            const dx = posX - pointer.x * 5;
            const dy = posY - pointer.y * 5;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 2 && dist > 0.01) {
                const force = (2 - dist) * 0.008;
                newX += (dx / dist) * force;
                newY += (dy / dist) * force;
            }

            positions[i3] = newX;
            positions[i3 + 1] = newY;
        }

        positionAttribute.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={particlesGeometry}>
            <pointsMaterial
                size={0.04}
                color="#71717a"
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
}

/**
 * Main 3D Scene
 */
function Scene() {
    return (
        <>
            {/* Ambient lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />

            {/* Floating shapes */}
            <FloatingShape
                position={[-3, 2, -2]}
                geometry="sphere"
                color="#09090b"
                speed={0.8}
            />
            <FloatingShape
                position={[3, -1, -3]}
                geometry="torus"
                color="#18181b"
                speed={1.2}
            />
            <FloatingShape
                position={[0, 3, -4]}
                geometry="icosahedron"
                color="#27272a"
                speed={0.6}
            />
            <FloatingShape
                position={[-4, -2, -2]}
                geometry="octahedron"
                color="#3f3f46"
                speed={1}
            />
            <FloatingShape
                position={[4, 2, -5]}
                geometry="sphere"
                color="#52525b"
                speed={0.9}
                distort={0.5}
            />

            {/* Particle field */}
            <ParticleField />

            {/* Sparkle effect - reduced for performance */}
            <Sparkles
                count={30}
                scale={12}
                size={1}
                speed={0.1}
                opacity={0.3}
                color="#a1a1aa"
            />
        </>
    );
}

/**
 * InteractiveBackground3D: Full-screen 3D canvas background
 * Features floating shapes, particles, and mouse interaction
 */
export default function InteractiveBackground3D() {
    return (
        <div className="interactive-3d-bg" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.2]} // Lower DPR for performance
                gl={{
                    antialias: false, // Disable antialias for performance
                    alpha: true,
                    powerPreference: "high-performance",
                }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
