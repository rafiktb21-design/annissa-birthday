import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

// Creates an expansive, organic, lush garden meadow and naturally placed cobblestones with PBR textures
export default function RomanticGardenGround() {
  const stonesMeshRef = useRef<THREE.InstancedMesh>(null!)

  // Load CC0 PBR textures for grass and cobblestones
  const [grassDiff, grassNor, grassRough] = useTexture([
    '/assets/textures/grass/diffuse.jpg',
    '/assets/textures/grass/normal.jpg',
    '/assets/textures/grass/roughness.jpg',
  ])

  const [stoneDiff, stoneNor, stoneRough] = useTexture([
    '/assets/textures/soil/diffuse.jpg',
    '/assets/textures/soil/normal.jpg',
    '/assets/textures/soil/roughness.jpg',
  ])

  useEffect(() => {
    if (grassDiff && grassNor && grassRough) {
      ;[grassDiff, grassNor, grassRough].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(18, 52)
        t.needsUpdate = true
      })
    }
  }, [grassDiff, grassNor, grassRough])

  useEffect(() => {
    if (stoneDiff && stoneNor && stoneRough) {
      ;[stoneDiff, stoneNor, stoneRough].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(2, 2)
        t.needsUpdate = true
      })
    }
  }, [stoneDiff, stoneNor, stoneRough])

  // 1. Organic Winding Cobblestone Walkway
  // Procedurally generated individual smooth stepping stones along the pathway
  const stonesData = useMemo(() => {
    const data: Array<{
      pos: [number, number, number]
      scale: [number, number, number]
      rotY: number
      color: THREE.Color
    }> = []

    const stoneColors = [
      new THREE.Color('#FFF4E8'), // Ivory
      new THREE.Color('#F5EAD8'), // Warm Champagne
      new THREE.Color('#EFE2D4'), // Blush Sand
      new THREE.Color('#E8DAD0'), // Soft Rose Granite
      new THREE.Color('#F7EDE2'), // Light Cream
    ]

    // Create stones from z = +18 (behind camera) down to z = -260 (final celebration)
    const startZ = 16
    const endZ = -260
    const step = 0.95

    for (let z = startZ; z >= endZ; z -= step) {
      // Subtle organic gentle curve along the path
      const pathCenter = Math.sin(z * 0.025) * 0.75 + Math.sin(z * 0.06) * 0.35

      // 2-3 stones across the width of the path
      const stonesInRow = 2 + Math.floor(Math.random() * 2)
      for (let s = 0; s < stonesInRow; s++) {
        const offsetRatio = (s - (stonesInRow - 1) / 2)
        const stoneX = pathCenter + offsetRatio * 1.05 + (Math.random() - 0.5) * 0.25
        const stoneZ = z + (Math.random() - 0.5) * 0.35
        const stoneY = 0.03 + (Math.random() - 0.5) * 0.01

        const width = 0.85 + Math.random() * 0.4
        const length = 0.75 + Math.random() * 0.35
        const height = 0.06 + Math.random() * 0.02
        const rotY = (Math.random() - 0.5) * 0.6
        const color = stoneColors[Math.floor(Math.random() * stoneColors.length)]

        data.push({
          pos: [stoneX, stoneY, stoneZ],
          scale: [width, height, length],
          rotY,
          color,
        })
      }
    }

    return data
  }, [])

  // Initialize stone instance matrices and colors
  const stoneGeometry = useMemo(() => {
    // Rounded flattened cylinder for natural flagstone look
    const geo = new THREE.CylinderGeometry(0.5, 0.55, 0.2, 10)
    geo.computeVertexNormals()
    return geo
  }, [])

  useMemo(() => {
    if (!stonesMeshRef.current) return
    const dummy = new THREE.Object3D()

    stonesData.forEach((stone, i) => {
      dummy.position.set(stone.pos[0], stone.pos[1], stone.pos[2])
      dummy.rotation.set(0, stone.rotY, 0)
      dummy.scale.set(stone.scale[0], stone.scale[1], stone.scale[2])
      dummy.updateMatrix()

      stonesMeshRef.current.setMatrixAt(i, dummy.matrix)
      stonesMeshRef.current.setColorAt(i, stone.color)
    })

    stonesMeshRef.current.instanceMatrix.needsUpdate = true
    if (stonesMeshRef.current.instanceColor) {
      stonesMeshRef.current.instanceColor.needsUpdate = true
    }
  }, [stonesData])

  // 2. Smooth Meadow Surface Geometry with subtle rolling undulations
  const groundGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 320, 48, 64)
    geo.rotateX(-Math.PI / 2)

    // Gentle terrain undulation away from center path
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)

      // Keep central walkway level, create gentle grassy banks on the sides
      const distFromCenter = Math.abs(x)
      if (distFromCenter > 2.5) {
        const bank = Math.min(1.8, (distFromCenter - 2.5) * 0.08)
        const wave = Math.sin(x * 0.15) * 0.15 + Math.cos(z * 0.08) * 0.18
        pos.setY(i, bank + wave)
      } else {
        pos.setY(i, (Math.random() - 0.5) * 0.02)
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group>
      {/* Expansive, seamless rolling garden meadow */}
      <mesh geometry={groundGeometry} position={[0, -0.02, -125]} receiveShadow>
        <meshStandardMaterial
          map={grassDiff}
          normalMap={grassNor}
          roughnessMap={grassRough}
          color="#A2C39A"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Flagstone / Cobblestone Walkway */}
      <instancedMesh
        ref={stonesMeshRef}
        args={[stoneGeometry, undefined, stonesData.length]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          map={stoneDiff}
          normalMap={stoneNor}
          roughnessMap={stoneRough}
          roughness={0.78}
          metalness={0.05}
        />
      </instancedMesh>
    </group>
  )
}
