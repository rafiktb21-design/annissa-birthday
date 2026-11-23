import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { DRACOLoader } from 'three-stdlib'
import { KTX2Loader } from 'three-stdlib'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'
import Butterflies from './Butterflies'
import SakuraPetals from './SakuraPetals'

// Model & Texture Caches
let cachedTreeScene: THREE.Group | null = null
let cachedBenchScene: THREE.Group | null = null
let cachedLanternScene: THREE.Group | null = null
let cachedGazaniaScene: THREE.Group | null = null
let cachedUrsiniaScene: THREE.Group | null = null

function getDracoLoader() {
  const draco = new DRACOLoader()
  draco.setDecoderPath('/draco/')
  return draco
}

function loadModel(path: string, draco = true): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    if (draco) {
      loader.setDRACOLoader(getDracoLoader())
    }
    loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject)
  })
}

function loadCherryTree(gl: THREE.WebGLRenderer): Promise<THREE.Group> {
  if (cachedTreeScene) return Promise.resolve(cachedTreeScene)
  return new Promise((resolve, reject) => {
    const ktx2 = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl)
    const loader = new GLTFLoader()
    loader.setKTX2Loader(ktx2)
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      '/assets/models/trees/cherry-blossom-tree-light.glb',
      (gltf) => {
        cachedTreeScene = gltf.scene
        resolve(gltf.scene)
      },
      undefined,
      reject
    )
  })
}

// -------------------------------------------------------------
// 1. AUTHENTIC JAPANESE STONE PATHWAY (PBR Natural Flagstones)
// -------------------------------------------------------------
function JapaneseStonePathway() {
  const [textures, setTextures] = useState<{
    stoneDiff: THREE.Texture
    stoneNor: THREE.Texture
    stoneRough: THREE.Texture
    cobbleDiff: THREE.Texture
    cobbleNor: THREE.Texture
    cobbleRough: THREE.Texture
    grassDiff: THREE.Texture
    grassNor: THREE.Texture
    grassRough: THREE.Texture
  } | null>(null)

  useEffect(() => {
    let active = true
    const loader = new THREE.TextureLoader()

    Promise.all([
      loader.loadAsync('/assets/textures/stone/diffuse.jpg'),
      loader.loadAsync('/assets/textures/stone/normal.jpg'),
      loader.loadAsync('/assets/textures/stone/roughness.jpg'),
      loader.loadAsync('/assets/textures/cobblestone/diffuse.jpg'),
      loader.loadAsync('/assets/textures/cobblestone/normal.jpg'),
      loader.loadAsync('/assets/textures/cobblestone/roughness.jpg'),
      loader.loadAsync('/assets/textures/grass/diffuse.jpg'),
      loader.loadAsync('/assets/textures/grass/normal.jpg'),
      loader.loadAsync('/assets/textures/grass/roughness.jpg'),
    ]).then(([sd, sn, sr, cd, cn, cr, gd, gn, gr]) => {
      if (!active) return

      ;[sd, sn, sr].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(1.5, 1.5)
      })
      sd.colorSpace = THREE.SRGBColorSpace

      ;[cd, cn, cr].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(4, 18)
      })
      cd.colorSpace = THREE.SRGBColorSpace

      ;[gd, gn, gr].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(16, 16)
      })
      gd.colorSpace = THREE.SRGBColorSpace

      setTextures({
        stoneDiff: sd,
        stoneNor: sn,
        stoneRough: sr,
        cobbleDiff: cd,
        cobbleNor: cn,
        cobbleRough: cr,
        grassDiff: gd,
        grassNor: gn,
        grassRough: gr,
      })
    }).catch((err) => console.error('Pathway texture load error:', err))

    return () => {
      active = false
    }
  }, [])

  // Natural paver stones along a graceful Japanese S-curve path
  const stones = useMemo(() => {
    const list: Array<{
      pos: [number, number, number]
      scale: [number, number, number]
      rotY: number
      radius: number
    }> = []

    // Steps from z = 4.4 down to z = -5.4
    for (let z = 4.4; z >= -5.2; z -= 0.38) {
      // Elegant, gentle Japanese S-curve
      const curveX = Math.sin((z + 1.2) * 0.42) * 0.48

      // Main stepping stone (human footstep scale: ~38cm x ~44cm)
      const wobbleX = Math.sin(z * 7) * 0.04
      const wobbleZ = Math.cos(z * 5) * 0.03
      const scaleX = 0.36 + Math.abs(Math.sin(z * 3)) * 0.08
      const scaleZ = 0.32 + Math.abs(Math.cos(z * 4)) * 0.08
      const rotY = Math.sin(z * 2) * 0.25

      list.push({
        pos: [curveX + wobbleX, 0.02, z + wobbleZ],
        scale: [scaleX, 0.025, scaleZ],
        rotY,
        radius: 0.5,
      })

      // Flanking accent paver slightly offset (nobedan stone arrangement)
      const side = Math.sin(z * 4.3) > 0 ? 1 : -1
      const sideX = curveX + side * 0.38 + wobbleX * 0.5
      const sideZ = z + 0.15
      list.push({
        pos: [sideX, 0.018, sideZ],
        scale: [scaleX * 0.75, 0.022, scaleZ * 0.75],
        rotY: -rotY * 0.8,
        radius: 0.45,
      })
    }

    return list
  }, [])

  // Fallen cherry blossom petals on stones and path borders
  const fallenPetals = useMemo(() => {
    const list: Array<{
      pos: [number, number, number]
      rot: [number, number, number]
      scale: number
      color: string
    }> = []

    for (let i = 0; i < 70; i++) {
      const z = 4.2 - i * 0.13
      const curveX = Math.sin((z + 1.2) * 0.42) * 0.48
      const px = curveX + (Math.sin(i * 3.7) * 0.7)
      const pz = z + Math.cos(i * 2.1) * 0.2
      list.push({
        pos: [px, 0.032, pz],
        rot: [-Math.PI / 2, 0, Math.sin(i * 4) * Math.PI],
        scale: 0.09 + (i % 3) * 0.025,
        color: i % 3 === 0 ? '#F4D9DE' : i % 3 === 1 ? '#FFF0F3' : '#E8B6C1',
      })
    }
    return list
  }, [])

  // Curved gravel/cobblestone bed ribbon underneath the stone pavers
  const pathBedGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.sin((4.6 + 1.2) * 0.42) * 0.48, 0.005, 4.6),
      new THREE.Vector3(Math.sin((2.5 + 1.2) * 0.42) * 0.48, 0.005, 2.5),
      new THREE.Vector3(Math.sin((0.0 + 1.2) * 0.42) * 0.48, 0.005, 0.0),
      new THREE.Vector3(Math.sin((-2.5 + 1.2) * 0.42) * 0.48, 0.005, -2.5),
      new THREE.Vector3(Math.sin((-5.4 + 1.2) * 0.42) * 0.48, 0.005, -5.4),
    ])

    const points = curve.getPoints(40)
    const geom = new THREE.BufferGeometry()
    const vertices: number[] = []
    const uvs: number[] = []
    const width = 1.1

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const dir = (i < points.length - 1 ? points[i + 1].clone().sub(p) : p.clone().sub(points[i - 1])).normalize()
      const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize()

      const left = p.clone().add(normal.clone().multiplyScalar(-width / 2))
      const right = p.clone().add(normal.clone().multiplyScalar(width / 2))

      vertices.push(left.x, left.y, left.z, right.x, right.y, right.z)
      const v = i / (points.length - 1)
      uvs.push(0, v * 12, 1, v * 12)
    }

    const indices: number[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2
      const b = i * 2 + 1
      const c = (i + 1) * 2
      const d = (i + 1) * 2 + 1
      indices.push(a, b, c, b, d, c)
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [])

  return (
    <group>
      {/* 1. Underlying Grassy Cobblestone / Compacted Gravel Bed Ribbon */}
      <mesh geometry={pathBedGeometry} receiveShadow>
        {textures ? (
          <meshStandardMaterial
            map={textures.cobbleDiff}
            normalMap={textures.cobbleNor}
            roughnessMap={textures.cobbleRough}
            roughness={0.85}
            color="#C6B5A0"
          />
        ) : (
          <meshStandardMaterial color="#BCA995" roughness={0.88} />
        )}
      </mesh>

      {/* 2. Realistic Natural Stone Pavers (Poly Haven rock_ground_02 PBR) */}
      {stones.map((st, i) => (
        <mesh key={i} position={st.pos} rotation={[0, st.rotY, 0]} scale={st.scale} receiveShadow>
          <cylinderGeometry args={[st.radius, st.radius * 1.05, 1, 14]} />
          {textures ? (
            <meshStandardMaterial
              map={textures.stoneDiff}
              normalMap={textures.stoneNor}
              roughnessMap={textures.stoneRough}
              roughness={0.82}
              color={i % 2 === 0 ? '#DDD0C0' : '#CFBEAC'}
            />
          ) : (
            <meshStandardMaterial color="#D2C3B2" roughness={0.84} />
          )}
        </mesh>
      ))}

      {/* 3. Naturally Scattered Cherry Blossom Petals on Stones */}
      {fallenPetals.map((fp, i) => (
        <mesh key={`p-${i}`} position={fp.pos} rotation={fp.rot} scale={fp.scale}>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial
            color={fp.color}
            roughness={0.6}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 4. Natural Organic Ground Meadow (PBR Grass, Muted Japanese Moss Tone) */}
      <mesh position={[0, -0.01, -2]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[46, 42, 32, 32]} />
        {textures ? (
          <meshStandardMaterial
            map={textures.grassDiff}
            normalMap={textures.grassNor}
            roughnessMap={textures.grassRough}
            roughness={0.92}
            color="#5C7B45"
          />
        ) : (
          <meshStandardMaterial color="#5C7B45" roughness={0.94} />
        )}
      </mesh>

      {/* 5. Seamless Distant Green Meadow Slope (No horizon line/void) */}
      <mesh position={[0, 1.6, -12]} rotation-x={-Math.PI / 2.3} receiveShadow>
        <planeGeometry args={[56, 26, 16, 16]} />
        {textures ? (
          <meshStandardMaterial
            map={textures.grassDiff}
            roughness={0.95}
            color="#486435"
          />
        ) : (
          <meshStandardMaterial color="#486435" roughness={0.96} />
        )}
      </mesh>
    </group>
  )
}

// -------------------------------------------------------------
// 2. CHERRY BLOSSOM TREES (Carefully Framed, Full Trunk & Canopy)
// -------------------------------------------------------------
function FramingCherryBlossomTrees() {
  const gl = useThree((state) => state.gl)
  const [model, setModel] = useState<THREE.Group | null>(() => cachedTreeScene)

  useEffect(() => {
    let active = true
    if (!model) {
      loadCherryTree(gl)
        .then((scene) => {
          if (active) setModel(scene)
        })
        .catch((err) => console.error('Tree load err:', err))
    }
    return () => {
      active = false
    }
  }, [gl, model])

  // Intentionally positioned trees to preserve trunk visibility and canopy framing
  const treeConfigs = useMemo(() => {
    if (!model) return []

    const configs = [
      // Left Hero Framing Tree:
      // Rooted clearly at x = -3.1, z = -0.8. Its canopy arches upward and inward,
      // framing the upper-left of the view without cutting off the trunk.
      { pos: [-3.1, 0, -0.8], scale: 0.46, rot: 0.35 },

      // Right Hero Framing Tree:
      // Rooted at x = 3.2, z = -1.3. Shading the bench and framing upper-right.
      { pos: [3.2, 0, -1.3], scale: 0.44, rot: -1.25 },

      // Left Midground Depth Tree:
      { pos: [-3.7, 0.05, -4.2], scale: 0.36, rot: 1.4 },

      // Right Midground Depth Tree:
      { pos: [3.6, 0.05, -4.8], scale: 0.34, rot: -0.7 },

      // Background Trees Framing the Gazebo:
      { pos: [-1.9, 0.2, -7.5], scale: 0.28, rot: 0.6 },
      { pos: [2.1, 0.2, -7.5], scale: 0.27, rot: -0.5 },
      { pos: [0.0, 0.4, -9.8], scale: 0.32, rot: 1.6 },
      { pos: [-4.2, 0.3, -8.8], scale: 0.30, rot: -0.9 },
      { pos: [4.4, 0.3, -8.8], scale: 0.30, rot: 0.8 },
    ]

    return configs.map((c) => {
      const cloned = model.clone(true)
      cloned.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })
      return { ...c, scene: cloned }
    })
  }, [model])

  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (groupRef.current && treeConfigs.length > 0) {
      const t = clock.getElapsedTime()
      groupRef.current.children.forEach((child, i) => {
        // Subtle natural spring breeze sway
        child.rotation.z = Math.sin(t * 0.5 + i * 1.3) * 0.004
      })
    }
  })

  if (!model) return null

  return (
    <group ref={groupRef}>
      {treeConfigs.map((t, i) => (
        <group key={i} position={t.pos as [number, number, number]} scale={t.scale} rotation-y={t.rot}>
          <primitive object={t.scene} />
        </group>
      ))}
    </group>
  )
}

// -------------------------------------------------------------
// 3. JAPANESE GARDEN PAVILION / GAZEBO (Visual Focal Point)
// -------------------------------------------------------------
function JapaneseGazebo() {
  const [lantern, setLantern] = useState<THREE.Group | null>(() => cachedLanternScene)

  useEffect(() => {
    let active = true
    if (!cachedLanternScene) {
      loadModel('/assets/models/decorations/wooden_lantern_01.glb').then((s) => {
        cachedLanternScene = s
        if (active) setLantern(s)
      })
    }
    return () => {
      active = false
    }
  }, [])

  return (
    <group position={[0.25, 0.02, -5.6]} scale={0.78}>
      {/* 1. Raised Wooden Foundation Deck */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.16, 2.4]} />
        <meshStandardMaterial color="#4A3728" roughness={0.7} />
      </mesh>
      {/* Step stone in front */}
      <mesh position={[0, 0.04, 1.35]} receiveShadow>
        <boxGeometry args={[0.8, 0.08, 0.4]} />
        <meshStandardMaterial color="#C2B29F" roughness={0.82} />
      </mesh>

      {/* 2. Four Slender Wooden Corner Pillars */}
      {[
        [-0.95, -0.95],
        [0.95, -0.95],
        [-0.95, 0.95],
        [0.95, 0.95],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.25, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.065, 0.075, 2.3, 14]} />
          <meshStandardMaterial color="#3D2B1F" roughness={0.65} />
        </mesh>
      ))}

      {/* 3. Horizontal Timber Support Beams (Nuki) */}
      <mesh position={[0, 2.35, -0.95]} castShadow>
        <boxGeometry args={[2.1, 0.1, 0.08]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.65} />
      </mesh>
      <mesh position={[0, 2.35, 0.95]} castShadow>
        <boxGeometry args={[2.1, 0.1, 0.08]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.65} />
      </mesh>
      <mesh position={[-0.95, 2.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 2.1]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.65} />
      </mesh>
      <mesh position={[0.95, 2.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 2.1]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.65} />
      </mesh>

      {/* 4. Classical Flared Japanese Eaves (Irimoya-style curved roof) */}
      <mesh position={[0, 2.65, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[2.1, 0.8, 4]} />
        <meshStandardMaterial color="#2E241E" roughness={0.6} />
      </mesh>
      {/* Upper ridge roof cap */}
      <mesh position={[0, 3.12, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[0.7, 0.35, 4]} />
        <meshStandardMaterial color="#D4A373" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* 5. Warm Hanging Lantern Inside Gazebo */}
      {lantern && (
        <group position={[0, 1.7, 0]}>
          <primitive object={lantern.clone(true)} scale={0.55} />
          <pointLight color="#FFAE66" intensity={2.4} distance={5.5} decay={2} />
        </group>
      )}

      {/* 6. Surrounding low decorative bamboo/wooden railing */}
      <mesh position={[-0.95, 0.45, 0]} castShadow>
        <boxGeometry args={[0.04, 0.05, 1.8]} />
        <meshStandardMaterial color="#5A4332" roughness={0.7} />
      </mesh>
      <mesh position={[0.95, 0.45, 0]} castShadow>
        <boxGeometry args={[0.04, 0.05, 1.8]} />
        <meshStandardMaterial color="#5A4332" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, -0.95]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.04]} />
        <meshStandardMaterial color="#5A4332" roughness={0.7} />
      </mesh>
    </group>
  )
}

// -------------------------------------------------------------
// 4. REFINED WOODEN BENCH & FAIRY LANTERN
// -------------------------------------------------------------
function RomanticBenchAndLantern() {
  const [bench, setBench] = useState<THREE.Group | null>(() => cachedBenchScene)
  const [lantern, setLantern] = useState<THREE.Group | null>(() => cachedLanternScene)

  useEffect(() => {
    let active = true
    if (!cachedBenchScene) {
      loadModel('/assets/models/decorations/painted_wooden_bench.glb').then((s) => {
        cachedBenchScene = s
        if (active) setBench(s)
      })
    }
    if (!cachedLanternScene) {
      loadModel('/assets/models/decorations/wooden_lantern_01.glb').then((s) => {
        cachedLanternScene = s
        if (active) setLantern(s)
      })
    }
    return () => {
      active = false
    }
  }, [])

  const benchScene = useMemo(() => {
    if (!bench) return null
    const c = bench.clone(true)
    c.traverse((n) => {
      if ((n as THREE.Mesh).isMesh) {
        n.castShadow = true
        n.receiveShadow = true
      }
    })
    return c
  }, [bench])

  const lanternScene = useMemo(() => {
    if (!lantern) return null
    const c = lantern.clone(true)
    c.traverse((n) => {
      if ((n as THREE.Mesh).isMesh) {
        n.castShadow = true
      }
    })
    return c
  }, [lantern])

  if (!benchScene) return null

  return (
    <group position={[1.8, 0, 0.1]}>
      {/* Bench nestled under right cherry blossom tree, angled toward stone path */}
      <primitive object={benchScene} scale={0.72} rotation={[0, -0.65, 0]} />

      {/* Fairy Lantern standing beside bench */}
      {lanternScene && (
        <group position={[0.72, 0, 0.35]}>
          <primitive object={lanternScene} scale={0.62} />
          <pointLight position={[0, 0.38, 0]} color="#FFB86C" intensity={2.2} distance={4.5} decay={2} />
        </group>
      )}
    </group>
  )
}

// -------------------------------------------------------------
// 5. BOTANICAL FLOWER BEDS (Organically Bordering the Pathway)
// -------------------------------------------------------------
function BotanicalPathwayFlowers() {
  const [gazania, setGazania] = useState<THREE.Group | null>(() => cachedGazaniaScene)
  const [ursinia, setUrsinia] = useState<THREE.Group | null>(() => cachedUrsiniaScene)

  useEffect(() => {
    let active = true
    if (!cachedGazaniaScene) {
      loadModel('/assets/models/flowers/flower_gazania.glb').then((s) => {
        cachedGazaniaScene = s
        if (active) setGazania(s)
      })
    }
    if (!cachedUrsiniaScene) {
      loadModel('/assets/models/flowers/flower_ursinia.glb').then((s) => {
        cachedUrsiniaScene = s
        if (active) setUrsinia(s)
      })
    }
    return () => {
      active = false
    }
  }, [])

  const flowerClusters = useMemo(() => {
    if (!gazania && !ursinia) return []

    const list: Array<{
      model: THREE.Group
      pos: [number, number, number]
      scale: number
      rot: number
    }> = []

    // Left border beds hugging the curved cobblestone path
    if (gazania) {
      list.push({ model: gazania, pos: [-0.95, 0.015, 2.4], scale: 0.65, rot: 0.4 })
      list.push({ model: gazania, pos: [-1.15, 0.015, 1.1], scale: 0.68, rot: 1.2 })
      list.push({ model: gazania, pos: [-0.92, 0.015, -0.5], scale: 0.62, rot: -0.5 })
      list.push({ model: gazania, pos: [-1.08, 0.015, -2.1], scale: 0.66, rot: 0.9 })
      list.push({ model: gazania, pos: [-0.9, 0.015, -3.6], scale: 0.64, rot: 1.5 })
    }
    if (ursinia) {
      list.push({ model: ursinia, pos: [-1.1, 0.015, 1.8], scale: 0.62, rot: -0.6 })
      list.push({ model: ursinia, pos: [-1.22, 0.015, 0.2], scale: 0.6, rot: 0.8 })
      list.push({ model: ursinia, pos: [-1.02, 0.015, -1.3], scale: 0.65, rot: -1.1 })
      list.push({ model: ursinia, pos: [-1.12, 0.015, -2.9], scale: 0.62, rot: 0.3 })
    }

    // Right border beds
    if (ursinia) {
      list.push({ model: ursinia, pos: [1.02, 0.015, 2.2], scale: 0.62, rot: -0.4 })
      list.push({ model: ursinia, pos: [1.12, 0.015, 0.9], scale: 0.65, rot: 1.0 })
      list.push({ model: ursinia, pos: [1.02, 0.015, -0.7], scale: 0.6, rot: -0.7 })
      list.push({ model: ursinia, pos: [1.12, 0.015, -2.2], scale: 0.65, rot: 0.6 })
      list.push({ model: ursinia, pos: [0.98, 0.015, -3.7], scale: 0.62, rot: -0.8 })
    }
    if (gazania) {
      list.push({ model: gazania, pos: [1.16, 0.015, 1.6], scale: 0.68, rot: 0.7 })
      list.push({ model: gazania, pos: [2.6, 0.015, 0.1], scale: 0.65, rot: -0.6 })
      list.push({ model: gazania, pos: [1.02, 0.015, -1.5], scale: 0.62, rot: 1.3 })
      list.push({ model: gazania, pos: [1.08, 0.015, -3.0], scale: 0.64, rot: -0.8 })
    }

    return list.map((item) => {
      const c = item.model.clone(true)
      c.traverse((n) => {
        if ((n as THREE.Mesh).isMesh) {
          n.castShadow = true
          n.receiveShadow = true
        }
      })
      return { ...item, scene: c }
    })
  }, [gazania, ursinia])

  return (
    <group>
      {flowerClusters.map((f, i) => (
        <group key={i} position={f.pos} rotation={[0, f.rot, 0]} scale={f.scale}>
          <primitive object={f.scene} />
        </group>
      ))}
    </group>
  )
}

// -------------------------------------------------------------
// MASTER SCENE COMPONENT
// -------------------------------------------------------------
export default function RomanticGardenScene3D() {
  const cameraGroupRef = useRef<THREE.Group>(null!)
  const { size, camera } = useThree()

  // Responsive camera setup: eye-level view down the romantic garden path
  useEffect(() => {
    const isMobile = size.width < 768
    if (isMobile) {
      camera.position.set(0, 1.48, 5.0)
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        ;(camera as THREE.PerspectiveCamera).fov = 50
        camera.updateProjectionMatrix()
      }
    } else {
      camera.position.set(0, 1.42, 4.4)
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        ;(camera as THREE.PerspectiveCamera).fov = 42
        camera.updateProjectionMatrix()
      }
    }
  }, [size.width, camera])

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()
    if (cameraGroupRef.current) {
      // Gentle cinematic parallax
      cameraGroupRef.current.position.x = Math.sin(t * 0.25) * 0.05 + pointer.x * 0.1
      cameraGroupRef.current.position.y = Math.cos(t * 0.35) * 0.03 - pointer.y * 0.05
      cameraGroupRef.current.rotation.y = Math.sin(t * 0.18) * 0.01 + pointer.x * 0.018
    }
  })

  return (
    <group ref={cameraGroupRef}>
      {/* 1. Golden Hour Peach Sunlight with Soft Shadows */}
      <directionalLight
        position={[-8, 14, 7]}
        intensity={2.1}
        color="#FFEBD6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      {/* 2. Soft Sky Ambient Fill */}
      <directionalLight position={[6, 8, -4]} intensity={0.85} color="#FFD5C2" />
      {/* 3. Subtle Warm Ground Hemispheric Bounce */}
      <hemisphereLight args={['#FFF5EB', '#687D52', 0.75]} />

      {/* Japanese Stone Pathway & Organic Ground */}
      <JapaneseStonePathway />

      {/* Romantic Wooden Bench & Fairy Lantern */}
      <RomanticBenchAndLantern />

      {/* Botanical Flower Borders */}
      <BotanicalPathwayFlowers />

      {/* Distant Japanese Garden Pavilion (Gazebo) */}
      <JapaneseGazebo />

      {/* Beautiful Framing Cherry Blossom Trees */}
      <FramingCherryBlossomTrees />

      {/* Drifting Petals & Butterflies */}
      <SakuraPetals count={85} area={16} />
      <Butterflies />
    </group>
  )
}
