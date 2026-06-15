'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function GridMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame(() => {
    timeRef.current += 0.0002
    if (groupRef.current) {
      groupRef.current.rotation.z = timeRef.current * 0.5
      groupRef.current.position.y = Math.sin(timeRef.current) * 2
    }
  })

  const gridGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    const gridSize = 40
    const gridStep = 2

    // Create grid lines
    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      positions.push(x, -gridSize, 0)
      positions.push(x, gridSize, 0)
    }

    for (let z = -gridSize; z <= gridSize; z += gridStep) {
      positions.push(-gridSize, 0, z)
      positions.push(gridSize, 0, z)
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    return geo
  }, [])

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(0x7bbde8),
      transparent: true,
      opacity: 0.2,
      linewidth: 2,
    })
  }, [])

  return (
    <group ref={groupRef}>
      <lineSegments geometry={gridGeometry} material={gridMaterial} position={[0, 0, -10]} />
    </group>
  )
}

function PulsingCubes() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame(() => {
    timeRef.current += 0.005
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const scale = 1 + Math.sin(timeRef.current + idx) * 0.3
        child.scale.set(scale, scale, scale)
        child.rotation.x += 0.01
        child.rotation.y += 0.02
      })
    }
  })

  const cubes = useMemo(
    () => [
      { pos: [-8, 5, -5], color: '#0A4174' },
      { pos: [8, 5, -5], color: '#49769F' },
      { pos: [0, -5, -5], color: '#7BBDE8' },
      { pos: [-5, 0, -5], color: '#4E8EA2' },
      { pos: [5, 0, -5], color: '#6EA2B3' },
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {cubes.map((cube, idx) => (
        <mesh key={idx} position={cube.pos as [number, number, number]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshBasicMaterial
            color={cube.color}
            transparent
            opacity={0.4}
            wireframe={true}
          />
        </mesh>
      ))}
    </group>
  )
}

function CityGridBackgroundInner() {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }} style={{ background: 'transparent' }}>
        <GridMesh />
        <PulsingCubes />
        <ambientLight intensity={0.2} />
        <pointLight position={[20, 20, 20]} intensity={0.6} color="#7BBDE8" />
      </Canvas>
    </div>
  )
}

export default function CityGridBackground() {
  return (
    <Suspense fallback={<div className="absolute inset-0 -z-10" />}>
      <CityGridBackgroundInner />
    </Suspense>
  )
}
