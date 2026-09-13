import { useRef, useMemo } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { Float, Icosahedron, Octahedron, Tetrahedron } from '@react-three/drei';
import * as THREE from 'three';

type MeshProps = ThreeElements['mesh'];

function WireframeShape({ geometry, position, scale, speed }: {
  geometry: 'ico' | 'octa' | 'tetra';
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.3;
  });

  const shapeProps: MeshProps = {
    ref,
    position,
    scale,
  };

  return (
    <mesh {...shapeProps}>
      {geometry === 'ico' && <icosahedronGeometry args={[1, 0]} />}
      {geometry === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {geometry === 'tetra' && <tetrahedronGeometry args={[1, 0]} />}
      <meshBasicMaterial color="#00b4ff" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function ParticleField({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#22d3ee" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CentralCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial color="#00b4ff" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00b4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#22d3ee" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <CentralCore />
      </Float>

      <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
        <WireframeShape geometry="ico" position={[-3, 1.5, -1]} scale={0.5} speed={0.8} />
      </Float>

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
        <WireframeShape geometry="octa" position={[3, -1, -0.5]} scale={0.6} speed={1} />
      </Float>

      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={1}>
        <WireframeShape geometry="tetra" position={[2.5, 2, -2]} scale={0.4} speed={0.6} />
      </Float>

      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={1.5}>
        <WireframeShape geometry="octa" position={[-2.5, -1.5, -1.5]} scale={0.45} speed={0.9} />
      </Float>

      <ParticleField count={60} />
    </Canvas>
  );
}
