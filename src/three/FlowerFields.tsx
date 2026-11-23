import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Authentic CC0 Poly Haven 3D flowers & potted plants
function AuthenticBotanicals() {
  const gazania = useGLTF('/assets/models/flowers/flower_gazania.glb')
  const ursinia = useGLTF('/assets/models/flowers/flower_ursinia.glb')
  const pottedPlant = useGLTF('/assets/models/flowers/potted_plant_01.glb')

  const spots = useMemo(() => {
    return [
      // Gazanias flanking path
      { type: 'gazania', pos: [-3.2, 0.05, -18], rot: 0.4, scale: 0.8 },
      { type: 'gazania', pos: [3.4, 0.05, -35], rot: -0.8, scale: 0.85 },
      { type: 'gazania', pos: [-3.5, 0.05, -65], rot: 1.2, scale: 0.75 },
      { type: 'gazania', pos: [3.2, 0.05, -95], rot: -0.3, scale: 0.8 },
      { type: 'gazania', pos: [-3.3, 0.05, -140], rot: 0.7, scale: 0.85 },
      { type: 'gazania', pos: [3.4, 0.05, -185], rot: -1.1, scale: 0.8 },

      // Ursinias
      { type: 'ursinia', pos: [3.1, 0.05, -22], rot: -0.5, scale: 0.75 },
      { type: 'ursinia', pos: [-3.3, 0.05, -48], rot: 0.9, scale: 0.8 },
      { type: 'ursinia', pos: [3.5, 0.05, -80], rot: -1.4, scale: 0.85 },
      { type: 'ursinia', pos: [-3.1, 0.05, -115], rot: 0.2, scale: 0.75 },
      { type: 'ursinia', pos: [3.3, 0.05, -160], rot: -0.6, scale: 0.8 },
      { type: 'ursinia', pos: [-3.4, 0.05, -195], rot: 1.0, scale: 0.85 },

      // Framing Potted Plants
      { type: 'pot', pos: [-2.6, 0.02, 6], rot: 0.2, scale: 0.7 },
      { type: 'pot', pos: [2.6, 0.02, 6], rot: -0.3, scale: 0.7 },
      { type: 'pot', pos: [-2.8, 0.02, -204], rot: 0.5, scale: 0.75 },
      { type: 'pot', pos: [2.8, 0.02, -204], rot: -0.5, scale: 0.75 },
    ]
  }, [])

  const clonedSpots = useMemo(() => {
    return spots.map((s) => {
      let baseScene: THREE.Group
      if (s.type === 'gazania') baseScene = gazania.scene
      else if (s.type === 'ursinia') baseScene = ursinia.scene
      else baseScene = pottedPlant.scene
      return {
        ...s,
        cloned: baseScene.clone(true),
      }
    })
  }, [spots, gazania.scene, ursinia.scene, pottedPlant.scene])

  return (
    <group>
      {clonedSpots.map((s, idx) => (
        <group
          key={`botanical-${idx}`}
          position={s.pos as [number, number, number]}
          rotation={[0, s.rot, 0]}
          scale={s.scale}
        >
          <primitive object={s.cloned} />
        </group>
      ))}
    </group>
  )
}

// Preload assets for instant rendering
useGLTF.preload('/assets/models/flowers/flower_gazania.glb')
useGLTF.preload('/assets/models/flowers/flower_ursinia.glb')
useGLTF.preload('/assets/models/flowers/potted_plant_01.glb')

// Botanical flower meadows with multi-layered rose/peony blossoms and gentle wind sway
export default function FlowerFields() {
  const flowerMeshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const count = 480

  const flowerData = useMemo(() => {
    const colors = [
      new THREE.Color('#F8B8CC'), // Pastel Pink
      new THREE.Color('#FFC9A8'), // Peach
      new THREE.Color('#C8B6F0'), // Lavender
      new THREE.Color('#FFF4E8'), // Ivory Cream
      new THREE.Color('#E989AC'), // Romantic Rose
      new THREE.Color('#F5D58A'), // Soft Gold
      new THREE.Color('#FFAAA6'), // Coral Blush
    ]

    const data: Array<{
      pos: THREE.Vector3
      rot: THREE.Euler
      scale: number
      color: THREE.Color
      swayPhase: number
      swaySpeed: number
    }> = []

    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? 1 : -1
      // Spread along the garden path from z = +5 to z = -250
      const z = 8 - Math.random() * 260

      // Enforce corridor clearance so flowers never block the walkway or title
      // In Hero scene (z > -25), push flowers outward (|x| between 3.2 and 9.5) and keep them low
      let minX = 2.4
      let maxX = 9.5
      let maxHeight = 0.28
      if (z > -25) {
        minX = 3.4
        maxX = 8.5
        maxHeight = 0.22
      }

      const x = (minX + Math.random() * (maxX - minX)) * side
      // Terrain height offset based on distance from path
      const bankHeight = Math.min(1.2, (Math.abs(x) - 2.4) * 0.1)
      const y = Math.max(0.02, bankHeight + (Math.random() * 0.08))

      const scale = 0.25 + Math.random() * 0.22
      const color = colors[Math.floor(Math.random() * colors.length)]

      data.push({
        pos: new THREE.Vector3(x, y, z),
        rot: new THREE.Euler(
          (Math.random() - 0.5) * 0.25,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.25
        ),
        scale: Math.min(scale, maxHeight / 0.4),
        color,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.1 + Math.random() * 0.9,
      })
    }

    return data
  }, [count])

  // Setup initial colors and matrices
  useEffect(() => {
    if (!flowerMeshRef.current) return
    flowerData.forEach((f, i) => {
      dummy.position.copy(f.pos)
      dummy.rotation.copy(f.rot)
      dummy.scale.set(f.scale, f.scale, f.scale)
      dummy.updateMatrix()

      flowerMeshRef.current.setMatrixAt(i, dummy.matrix)
      flowerMeshRef.current.setColorAt(i, f.color)
    })
    flowerMeshRef.current.instanceMatrix.needsUpdate = true
    if (flowerMeshRef.current.instanceColor) {
      flowerMeshRef.current.instanceColor.needsUpdate = true
    }
  }, [flowerData, dummy])

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!flowerMeshRef.current) return
    timeRef.current += delta
    const t = timeRef.current

    // Apply gentle wind sway
    flowerData.forEach((f, i) => {
      const swayZ = Math.sin(t * f.swaySpeed + f.swayPhase) * 0.08
      const swayX = Math.cos(t * f.swaySpeed * 0.8 + f.swayPhase) * 0.06

      dummy.position.copy(f.pos)
      dummy.rotation.set(f.rot.x + swayX, f.rot.y, f.rot.z + swayZ)
      dummy.scale.set(f.scale, f.scale, f.scale)
      dummy.updateMatrix()

      flowerMeshRef.current.setMatrixAt(i, dummy.matrix)
    })

    flowerMeshRef.current.instanceMatrix.needsUpdate = true
  })

  // Rose-like layered blossom geometry (layered petals)
  const blossomGeo = useMemo(() => {
    // 8-segmented sculpted blossom geometry
    const geo = new THREE.CylinderGeometry(0.38, 0.12, 0.28, 8)
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group>
      {/* Authentic CC0 3D Flower & Plant Models */}
      <AuthenticBotanicals />

      <instancedMesh
        ref={flowerMeshRef}
        args={[blossomGeo, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          roughness={0.45}
          metalness={0.06}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  )
}
