'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function SimpleParticles() {
  return null // Placeholder for particle rendering
}

function GarbageParticlesBackgroundInner() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-dark/20 to-blue-mid/10" style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <div className="absolute inset-0 bg-gradient-blue-light/30" />
      </Suspense>
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
