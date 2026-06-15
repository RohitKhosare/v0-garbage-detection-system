'use client'

import dynamic from 'next/dynamic'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

interface Particle {
  position: [number, number, number]
  velocity: [number, number, number]
  angle: number
  rotationSpeed: number
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<Particle[]>([])

  const particleCount = 150

  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    // Blue color palette matching theme
    const blueColors = [
      [0, 0.23, 0.22], // #001D39
      [0.04, 0.23, 0.35], // #0A3A5C
      [0.04, 0.25, 0.45], // #0A4174
      [0.29, 0.46, 0.62], // #49769F
      [0.31, 0.56, 0.64], // #4E8EA2
      [0.43, 0.63, 0.70], // #6EA2B3
      [0.48, 0.74, 0.91], // #7BBDE8
    ]

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 40
      const y = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 40

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const color = blueColors[Math.floor(Math.random() * blueColors.length)]
      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]

      particlesRef.current.push({
        position: [x, y, z],
        velocity: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ],
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      })
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    return { geometry: geom, material: mat }
  }, [])

  useFrame(() => {
    if (!meshRef.current || !meshRef.current.geometry) return

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i]

      // Update position
      particle.position[0] += particle.velocity[0]
      particle.position[1] += particle.velocity[1]
      particle.position[2] += particle.velocity[2]

      // Wrap around
      if (particle.position[0] > 20) particle.position[0] = -20
      if (particle.position[0] < -20) particle.position[0] = 20
      if (particle.position[1] > 20) particle.position[1] = -20
      if (particle.position[1] < -20) particle.position[1] = 20
      if (particle.position[2] > 20) particle.position[2] = -20
      if (particle.position[2] < -20) particle.position[2] = 20

      positions[i * 3] = particle.position[0]
      positions[i * 3 + 1] = particle.position[1]
      positions[i * 3 + 2] = particle.position[2]
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}

function GarbageParticlesBackgroundInner() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }} style={{ background: 'transparent' }}>
        <ParticleField />
        <ambientLight intensity={0.4} />
        <pointLight position={[20, 20, 20]} intensity={0.8} color="#7BBDE8" />
        <pointLight position={[-20, -20, -20]} intensity={0.6} color="#0A4174" />
      </Canvas>
    </div>
  )
}

export default function GarbageParticlesBackground() {
  return (
    <Suspense fallback={<div className="absolute inset-0 -z-10" />}>
      <GarbageParticlesBackgroundInner />
    </Suspense>
  )
}
