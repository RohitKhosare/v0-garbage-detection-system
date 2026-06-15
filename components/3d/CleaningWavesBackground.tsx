'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function WavesMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(8, 6)
    return geo
  }, [])

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0a4174),
      emissive: new THREE.Color(0x7bbde8),
      emissiveIntensity: 0.3,
      wireframe: false,
      transparent: true,
      opacity: 0.15,
      shininess: 100,
    })
  }, [])

  useFrame((state) => {
    timeRef.current += 0.0005
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0002
      meshRef.current.rotation.y += 0.0003
      meshRef.current.scale.x = 1 + Math.sin(timeRef.current) * 0.1
      meshRef.current.scale.y = 1 + Math.cos(timeRef.current * 0.8) * 0.1
      meshRef.current.scale.z = 1 + Math.sin(timeRef.current * 0.6) * 0.1
    }
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 0, 0]} />
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  const orbs = useMemo(
    () => [
      { offset: 0, radius: 12, speed: 0.0005, color: '#49769F', intensity: 0.4 },
      { offset: Math.PI * 0.7, radius: 15, speed: 0.0003, color: '#4E8EA2', intensity: 0.3 },
      { offset: Math.PI * 1.4, radius: 18, speed: 0.0004, color: '#7BBDE8', intensity: 0.5 },
    ],
    [],
  )

  useFrame(() => {
    timeRef.current += 1
    if (orbsRef.current) {
      orbsRef.current.children.forEach((child, idx) => {
        const orb = orbs[idx]
        const angle = timeRef.current * orb.speed + orb.offset
        child.position.x = Math.cos(angle) * orb.radius
        child.position.y = Math.sin(angle) * orb.radius * 0.5
        child.position.z = Math.sin(angle * 0.5) * orb.radius
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, idx) => (
        <mesh key={idx} position={[orb.radius, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color={orb.color} />
        </mesh>
      ))}
    </group>
  )
}

function CleaningWavesBackgroundInner() {
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }} style={{ background: 'transparent' }}>
        <WavesMesh />
        <FloatingOrbs />
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={1} color="#7BBDE8" />
        <pointLight position={[-15, -15, -15]} intensity={0.8} color="#0A4174" />
      </Canvas>
    </div>
  )
}

export default function CleaningWavesBackground() {
  return (
    <Suspense fallback={<div className="absolute inset-0 -z-10" />}>
      <CleaningWavesBackgroundInner />
    </Suspense>
  )
}
