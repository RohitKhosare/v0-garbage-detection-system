'use client'

import { useState } from 'react'
import GarbageParticlesBackground from '@/components/3d/GarbageParticlesBackground'
import CleaningWavesBackground from '@/components/3d/CleaningWavesBackground'
import CityGridBackground from '@/components/3d/CityGridBackground'

export default function Demo3D() {
  const [currentBackground, setCurrentBackground] = useState<'garbage' | 'waves' | 'grid'>('garbage')

  return (
    <div className="min-h-screen bg-gradient-blue-light relative overflow-hidden">
      {currentBackground === 'garbage' &&<GarbageParticlesBackground />}
      {currentBackground === 'waves' && <CleaningWavesBackground />}
      {currentBackground === 'grid' && <CityGridBackground />}

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-blue-lg max-w-2xl">
          <h1 className="text-4xl font-bold text-blue-dark mb-6 text-center">3D Animated Backgrounds</h1>
          <p className="text-blue-soft text-lg mb-8 text-center">
            Each dashboard features a unique 3D animated background connected to the garbage detection theme
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentBackground('garbage')}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                currentBackground === 'garbage'
                  ? 'bg-gradient-blue text-white shadow-blue-lg'
                  : 'bg-gray-100 text-blue-dark hover:bg-gray-200'
              }`}
            >
              🎯 Citizen Dashboard - Garbage Particles
              <span className="block text-sm mt-1">150 animated particles in blue gradient colors</span>
            </button>

            <button
              onClick={() => setCurrentBackground('waves')}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                currentBackground === 'waves'
                  ? 'bg-gradient-blue text-white shadow-blue-lg'
                  : 'bg-gray-100 text-blue-dark hover:bg-gray-200'
              }`}
            >
              🌊 Collector Dashboard - Cleaning Waves
              <span className="block text-sm mt-1">Pulsing geometric shapes with floating orbs</span>
            </button>

            <button
              onClick={() => setCurrentBackground('grid')}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                currentBackground === 'grid'
                  ? 'bg-gradient-blue text-white shadow-blue-lg'
                  : 'bg-gray-100 text-blue-dark hover:bg-gray-200'
              }`}
            >
              🏙️ Municipal Dashboard - City Grid
              <span className="block text-sm mt-1">Rotating grid with pulsing wireframe cubes</span>
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-sky/30">
            <h2 className="text-2xl font-bold text-blue-dark mb-4">Features</h2>
            <ul className="space-y-2 text-blue-soft">
              <li className="flex items-start">
                <span className="text-blue-mid mr-3">✓</span>
                <span>Real-time 3D animations using React Three Fiber</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-mid mr-3">✓</span>
                <span>Blue gradient color palette matching your theme</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-mid mr-3">✓</span>
                <span>Smooth performance with WebGL rendering</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-mid mr-3">✓</span>
                <span>Theme-connected visuals for garbage detection system</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
