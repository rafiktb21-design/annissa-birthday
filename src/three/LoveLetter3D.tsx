import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { audio } from '../utils/audio'
import { createCircularParticleTexture } from './ParticleSystem'

interface LoveLetter3DProps {
  isOpen: boolean
  onToggleOpen: () => void
  position?: [number, number, number]
}

// ==========================================
// 1. DYNAMIC WAX BREAK PARTICLES
// ==========================================
function LuxuryWaxBreakParticles({ active }: { active: boolean }) {
  const count = 32
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const shards = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 2.8,
        Math.random() * 2.2 + 0.6,
        Math.random() * 2.4 + 0.8
      ),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      rotSpeed: new THREE.Euler(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      scale: 0.04 + Math.random() * 0.045,
      isAlive: false,
      age: 0,
      life: 0.85 + Math.random() * 0.35,
    }))
  }, [])

  useEffect(() => {
    if (active) {
      shards.forEach((s) => {
        s.pos.set(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          0.05
        )
        s.vel.set(
          (Math.random() - 0.5) * 3.0,
          Math.random() * 2.4 + 0.8,
          Math.random() * 2.8 + 0.6
        )
        s.isAlive = true
        s.age = 0
      })
    }
  }, [active, shards])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    let needsUpdate = false

    shards.forEach((s, i) => {
      if (s.isAlive) {
        needsUpdate = true
        s.age += delta
        s.pos.addScaledVector(s.vel, delta)
        s.vel.y -= delta * 5.5 // gravity
        s.rot.x += s.rotSpeed.x * delta
        s.rot.y += s.rotSpeed.y * delta
        s.rot.z += s.rotSpeed.z * delta

        const lifeRatio = 1 - s.age / s.life
        if (lifeRatio <= 0) {
          s.isAlive = false
          dummy.scale.set(0, 0, 0)
        } else {
          const currentScale = s.scale * lifeRatio
          dummy.position.copy(s.pos)
          dummy.rotation.copy(s.rot)
          dummy.scale.set(currentScale, currentScale, currentScale)
        }
      } else {
        dummy.scale.set(0, 0, 0)
      }
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, -0.05, 0.15]}>
      <boxGeometry args={[1, 1, 0.4]} />
      <meshStandardMaterial
        color="#8D1938"
        roughness={0.28}
        metalness={0.2}
        emissive="#500918"
      />
    </instancedMesh>
  )
}

// ==========================================
// 2. EMBOSSED 3D BURGUNDY HEART WAX SEAL
// ==========================================
function BurgundyHeartWaxSeal({
  hovered,
  pressed,
  scaleMod = 1,
  onClick,
}: {
  hovered: boolean
  pressed: boolean
  scaleMod?: number
  onClick: (e: { stopPropagation: () => void }) => void
}) {
  const sealGroup = useRef<THREE.Group>(null!)

  // 3D Extruded Heart Shape
  const heartGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const s = 0.038
    shape.moveTo(0, 0.3 * s)
    shape.bezierCurveTo(0, 0.3 * s, -0.5 * s, 0.8 * s, -1.0 * s, 0.8 * s)
    shape.bezierCurveTo(-1.6 * s, 0.8 * s, -1.6 * s, 0.2 * s, -1.6 * s, 0.2 * s)
    shape.bezierCurveTo(-1.6 * s, -0.4 * s, -0.9 * s, -0.9 * s, 0, -1.5 * s)
    shape.bezierCurveTo(0.9 * s, -0.9 * s, 1.6 * s, -0.4 * s, 1.6 * s, 0.2 * s)
    shape.bezierCurveTo(1.6 * s, 0.2 * s, 1.6 * s, 0.8 * s, 1.0 * s, 0.8 * s)
    shape.bezierCurveTo(0.5 * s, 0.8 * s, 0, 0.3 * s, 0, 0.3 * s)

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.018,
    })
  }, [])

  // Natural Scalloped Outer Rim
  const scallopedRimGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.38, 0.42, 0.065, 32)
  }, [])

  return (
    <group
      ref={sealGroup}
      scale={scaleMod * (pressed ? 0.88 : hovered ? 1.14 : 1.0)}
      position={[0, 0, 0.05]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      {/* Outer scalloped wax bed */}
      <mesh geometry={scallopedRimGeo} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <meshStandardMaterial
          color="#8D1938"
          roughness={0.28}
          metalness={0.18}
          emissive="#4a0818"
          emissiveIntensity={hovered ? 0.35 : 0.1}
        />
      </mesh>

      {/* Inner wax circular basin */}
      <mesh position={[0, 0, 0.022]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.31, 0.33, 0.05, 32]} />
        <meshStandardMaterial
          color="#75122b"
          roughness={0.25}
          metalness={0.22}
        />
      </mesh>

      {/* Thin Gold Embossed Inner Ring */}
      <mesh position={[0, 0, 0.035]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.29, 0.012, 12, 32]} />
        <meshStandardMaterial
          color="#D6B16E"
          metalness={0.88}
          roughness={0.2}
          emissive="#947438"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Embossed 3D Heart */}
      <mesh geometry={heartGeo} position={[0, 0.02, 0.04]} castShadow>
        <meshStandardMaterial
          color="#8D1938"
          roughness={0.22}
          metalness={0.25}
          emissive="#610b20"
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </mesh>

      {/* Gold Rim on Heart Crest */}
      <mesh geometry={heartGeo} position={[0, 0.02, 0.042]} scale={0.96}>
        <meshStandardMaterial
          color="#D6B16E"
          metalness={0.85}
          roughness={0.22}
          emissive="#D6B16E"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Warm Golden Glow Halo */}
      {hovered && (
        <pointLight position={[0, 0, 0.25]} intensity={1.8} color="#D6B16E" distance={3.2} />
      )}
    </group>
  )
}

// ==========================================
// 3. MASTER LUXURY 3D ENVELOPE COMPONENT
// ==========================================
export default function LoveLetter3D({
  isOpen,
  onToggleOpen,
  position = [0, 0, -185],
}: LoveLetter3DProps) {
  const { pointer } = useThree()
  const envelopeGroupRef = useRef<THREE.Group>(null!)
  const flapHingeRef = useRef<THREE.Group>(null!)
  const slidingPaperRef = useRef<THREE.Group>(null!)
  const sealAnchorRef = useRef<THREE.Group>(null!)

  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [breakShards, setBreakShards] = useState(false)

  // Animation timeline stage:
  // 'idle' -> 'pressing' -> 'opening' -> 'open'
  const [animStage, setAnimStage] = useState<'idle' | 'pressing' | 'opening' | 'open'>('idle')
  const timeRef = useRef(0)

  // Floating rose petals
  const petals = useMemo(() => {
    return Array.from({ length: 32 }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 8.0,
        Math.random() * 6.0 - 2.0,
        (Math.random() - 0.5) * 6.0
      ),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      speedY: 0.16 + Math.random() * 0.22,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.16 + Math.random() * 0.09,
      color: Math.random() > 0.4 ? '#8D1938' : '#381827',
    }))
  }, [])

  // Floating golden stardust
  const stardust = useMemo(() => {
    const count = 70
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5
      pos[i * 3 + 1] = Math.random() * 5.5 - 1.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6.0
    }
    return pos
  }, [])

  // Geometries: Envelope Ratio 1.6:1 (W = 4.8, H = 3.0)
  const w = 4.8
  const h = 3.0
  const cornerR = 0.12

  // 1. Back Plate Geometry with rounded corners
  const backPlateGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2 + cornerR, -h / 2)
    shape.lineTo(w / 2 - cornerR, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + cornerR)
    shape.lineTo(w / 2, h / 2 - cornerR)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - cornerR, h / 2)
    shape.lineTo(-w / 2 + cornerR, h / 2)
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - cornerR)
    shape.lineTo(-w / 2, -h / 2 + cornerR)
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + cornerR, -h / 2)

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    })
  }, [w, h, cornerR])

  // 2. Interior Silk Pocket Lining
  const pocketLiningGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const inset = 0.08
    shape.moveTo(-w / 2 + inset, -h / 2 + inset)
    shape.lineTo(w / 2 - inset, -h / 2 + inset)
    shape.lineTo(w / 2 - inset, h / 2 - inset)
    shape.lineTo(-w / 2 + inset, h / 2 - inset)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w, h])

  // 3. Symmetric Folded Front Flaps
  // Left flap
  const leftFlapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, -h / 2)
    shape.lineTo(-0.35, 0)
    shape.lineTo(-w / 2, h / 2)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w, h])

  // Right flap
  const rightFlapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(w / 2, -h / 2)
    shape.lineTo(0.35, 0)
    shape.lineTo(w / 2, h / 2)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w, h])

  // Bottom flap (folds upward, overlapping sides)
  const bottomFlapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, -h / 2)
    shape.lineTo(-0.25, 0.12)
    shape.quadraticCurveTo(0, 0.22, 0.25, 0.12)
    shape.lineTo(w / 2, -h / 2)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w, h])

  // 4. Hinged Top Flap (Pivot at top edge y = 1.5)
  const topFlapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo(-0.24, -1.55)
    shape.quadraticCurveTo(0, -1.72, 0.24, -1.55)
    shape.lineTo(w / 2, 0)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w])

  // Top Flap Gold Foil Trim
  const topFlapGoldTrimGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const inset = 0.07
    shape.moveTo(-w / 2 + inset * 1.5, -inset)
    shape.lineTo(-0.2, -1.55 + inset)
    shape.quadraticCurveTo(0, -1.72 + inset, 0.2, -1.55 + inset)
    shape.lineTo(w / 2 - inset * 1.5, -inset)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [w])

  // Synchronize with external isOpen
  useEffect(() => {
    if (isOpen) {
      setAnimStage('open')
    } else {
      setAnimStage('idle')
      setPressed(false)
      setBreakShards(false)
    }
  }, [isOpen])

  // User click trigger sequence:
  // 1. Press (150ms) -> 2. Seal break (300ms) -> 3. Flap open (700ms) -> 4. Slide & Reveal
  const handleSealClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (animStage !== 'idle') return

    // Step 1: Pressure response
    setAnimStage('pressing')
    setPressed(true)
    audio.playSparkle()

    // Step 2: Seal Break
    setTimeout(() => {
      setPressed(false)
      setBreakShards(true)
      audio.playSealBreak()
      setAnimStage('opening')

      // Step 3: Complete flap rotation & open letter
      setTimeout(() => {
        onToggleOpen()
      }, 750)
    }, 180)
  }

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    // Subtle 3D levitation + cursor tilt
    if (envelopeGroupRef.current) {
      const floatY = 1.35 + Math.sin(t * 1.3) * 0.04
      envelopeGroupRef.current.position.y = floatY

      const targetRotX = -pointer.y * 0.12
      const targetRotY = pointer.x * 0.16 + Math.sin(t * 0.5) * 0.02
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.x,
        targetRotX,
        delta * 3.5
      )
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.y,
        targetRotY,
        delta * 3.5
      )
    }

    // Flap smooth 3D rotation along top hinge (0 rad closed, -2.88 rad open backward)
    if (flapHingeRef.current) {
      const isFlapOpen = animStage === 'opening' || animStage === 'open'
      const targetRot = isFlapOpen ? -Math.PI * 0.92 : 0
      flapHingeRef.current.rotation.x = THREE.MathUtils.lerp(
        flapHingeRef.current.rotation.x,
        targetRot,
        delta * 4.2
      )
    }

    // Seal anchor scale (dissolves when opening)
    if (sealAnchorRef.current) {
      const isOpened = animStage === 'opening' || animStage === 'open'
      const targetScale = isOpened ? 0 : 1
      sealAnchorRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 8.5
      )
    }

    // Sliding folded parchment letter out of the pocket
    if (slidingPaperRef.current) {
      const isOpened = animStage === 'open' || animStage === 'opening'
      const targetY = isOpened ? 2.3 : 0.05
      const targetZ = isOpened ? 0.38 : 0.025
      const targetScale = isOpened ? 1.08 : 0.95

      slidingPaperRef.current.position.y = THREE.MathUtils.lerp(
        slidingPaperRef.current.position.y,
        targetY,
        delta * 3.2
      )
      slidingPaperRef.current.position.z = THREE.MathUtils.lerp(
        slidingPaperRef.current.position.z,
        targetZ,
        delta * 3.2
      )
      slidingPaperRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 3.2
      )
    }

    // Rose petals drift
    petals.forEach((p) => {
      p.pos.y -= delta * p.speedY
      p.pos.x += Math.sin(t * 1.2 + p.wobble) * delta * 0.16
      p.pos.z += Math.cos(t * 1.0 + p.wobble) * delta * 0.12
      p.rot.x += delta * 0.55
      p.rot.y += delta * 0.38

      if (p.pos.y < -2.2) {
        p.pos.y = 3.8
        p.pos.x = (Math.random() - 0.5) * 8.0
      }
    })
  })

  const stardustTexture = useMemo(() => {
    if (typeof document !== 'undefined') return createCircularParticleTexture()
    return null
  }, [])

  return (
    <group position={position}>
      {/* ================= 1. CINEMATIC LIGHTING ================= */}
      {/* Warm Golden Sunlight spotlight illuminating the envelope */}
      <spotLight
        position={[0, 6.0, 4.5]}
        target-position={[0, 1.35, 0]}
        intensity={3.6}
        angle={0.7}
        penumbra={0.7}
        color="#FFF4E8"
        castShadow
      />
      {/* Soft Rose Pink Rim Light */}
      <pointLight position={[-4.5, 3.2, 2.5]} intensity={1.8} color="#F8B8CC" distance={15} />
      {/* Soft Gold Accent Rim from behind */}
      <pointLight position={[3.8, 4.5, -2]} intensity={1.8} color="#F5D58A" distance={14} />
      {/* Lavender Soft Ambient Fill */}
      <pointLight position={[0, 0.4, 2.2]} intensity={1.2} color="#C8B6F0" distance={8} />

      {/* ================= 2. FLOATING PASTEL ROSE PETALS & STARDUST ================= */}
      {petals.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} scale={p.scale}>
          <planeGeometry args={[1, 1.25]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#F8B8CC' : '#FFC9A8'}
            roughness={0.55}
            side={THREE.DoubleSide}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}

      {/* Floating Golden Stardust */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stardust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={stardustTexture ?? undefined}
          size={0.18}
          color="#F5D58A"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ================= 4. LUXURY WHITE MARBLE & GOLD PEDESTAL TABLE ================= */}
      <mesh position={[0, 0.42, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.6, 0.14, 40]} />
        <meshStandardMaterial color="#FFF4E8" roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.38, 0.65, 1.3, 24]} />
        <meshStandardMaterial color="#FAF0E6" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[2.0, 2.3, 0.18, 32]} />
        <meshStandardMaterial color="#F5E8D8" roughness={0.45} />
      </mesh>

      {/* Soft Gold Ring Trim on Pedestal */}
      <mesh position={[0, 0.49, 0]}>
        <torusGeometry args={[2.42, 0.026, 12, 48]} />
        <meshStandardMaterial color="#F5D58A" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* Scented Candles on Pedestal Table with warm golden glow */}
      {[-1.65, 1.65].map((x, i) => (
        <group key={i} position={[x, 0.65, 0.35]}>
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.52, 16]} />
            <meshStandardMaterial color="#FFF4E8" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#F5D58A" />
          </mesh>
          <pointLight position={[0, 0.6, 0]} intensity={1.4} color="#F5D58A" distance={6} />
        </group>
      ))}

      {/* Pastel Floral Bouquets on Table Flanks */}
      {[-1.5, 1.5].map((x, i) => (
        <group key={`flower-${i}`} position={[x, 0.55, -0.6]}>
          {/* Porcelain Vase */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.22, 0.16, 0.5, 16]} />
            <meshStandardMaterial color="#FFF4E8" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Handcrafted Rose Arrangement */}
          <group position={[0, 0.52, 0]}>
            {[0, 1.25, 2.5, 3.75, 5.0].map((ang, j) => (
              <mesh
                key={j}
                position={[Math.cos(ang) * 0.16, (j % 2) * 0.06, Math.sin(ang) * 0.16]}
                rotation={[0.3, ang, 0.2]}
              >
                <cylinderGeometry args={[0.08, 0.03, 0.12, 10]} />
                <meshStandardMaterial
                  color={j % 2 === 0 ? '#F8B8CC' : '#FFC9A8'}
                  roughness={0.4}
                />
              </mesh>
            ))}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.09, 0.04, 0.14, 10]} />
              <meshStandardMaterial color="#FFF5EA" roughness={0.35} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ================= 5. MASTER 3D ENVELOPE GROUP ================= */}
      <group
        ref={envelopeGroupRef}
        position={[0, 1.35, 0]}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        {/* Soft Ambient Contact Shadow Under Envelope */}
        <mesh position={[0, -1.6, -0.1]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[5.2, 2.4]} />
          <meshBasicMaterial color="#100512" transparent opacity={0.45} depthWrite={false} />
        </mesh>

        {/* --- A. ENVELOPE BACK PLATE --- */}
        <mesh geometry={backPlateGeo} position={[0, 0, -0.02]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#FFF4E4"
            roughness={0.62}
            metalness={0.02}
          />
        </mesh>

        {/* --- B. INTERIOR SILK LINING (Dusty Burgundy #381827) --- */}
        <mesh geometry={pocketLiningGeo} position={[0, 0, 0.015]}>
          <meshStandardMaterial
            color="#381827"
            roughness={0.38}
            metalness={0.12}
          />
        </mesh>

        {/* --- C. SLIDING LETTER (Sits inside the pocket) --- */}
        <group ref={slidingPaperRef} position={[0, 0.05, 0.025]}>
          {/* Folded Parchment Paper Sheet */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.4, 2.7, 0.02]} />
            <meshStandardMaterial
              color="#FFF4E4"
              roughness={0.65}
              metalness={0.02}
            />
          </mesh>

          {/* Thin Champagne Gold Border Foil on Paper */}
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[4.16, 2.46]} />
            <meshBasicMaterial color="#D6B16E" transparent opacity={0.22} />
          </mesh>

          {/* Subtle Calligraphy Lines Impression */}
          {[-0.7, -0.35, 0.0, 0.35, 0.7].map((y, i) => (
            <mesh key={i} position={[0, y, 0.013]}>
              <planeGeometry args={[3.2 - (i === 4 ? 1.0 : 0), 0.03]} />
              <meshBasicMaterial color="#49352F" transparent opacity={0.35} />
            </mesh>
          ))}

          {/* Golden Heart Crest Stamp on Paper */}
          <mesh position={[0, 0.95, 0.014]}>
            <circleGeometry args={[0.11, 16]} />
            <meshBasicMaterial color="#D6B16E" />
          </mesh>

          {/* Warm Golden Glow when letter slides out */}
          {(animStage === 'open' || animStage === 'opening') && (
            <pointLight position={[0, 0, 0.4]} intensity={2.0} color="#FFF4E4" distance={4.5} />
          )}
        </group>

        {/* --- D. FRONT POCKET FLAPS (Folded Paper Construction) --- */}
        {/* Left Flap */}
        <mesh geometry={leftFlapGeo} position={[0, 0, 0.04]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#FFF4E4"
            roughness={0.62}
            metalness={0.02}
          />
        </mesh>
        {/* Left Flap Gold Trim */}
        <mesh geometry={leftFlapGeo} position={[0, 0, 0.042]} scale={0.96}>
          <meshBasicMaterial color="#D6B16E" transparent opacity={0.18} />
        </mesh>

        {/* Right Flap */}
        <mesh geometry={rightFlapGeo} position={[0, 0, 0.045]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#FFF4E4"
            roughness={0.62}
            metalness={0.02}
          />
        </mesh>
        {/* Right Flap Gold Trim */}
        <mesh geometry={rightFlapGeo} position={[0, 0, 0.047]} scale={0.96}>
          <meshBasicMaterial color="#D6B16E" transparent opacity={0.18} />
        </mesh>

        {/* Bottom Flap (Overlaps left and right flaps) */}
        <mesh geometry={bottomFlapGeo} position={[0, 0, 0.052]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#FFF4E4"
            roughness={0.62}
            metalness={0.02}
          />
        </mesh>
        {/* Bottom Flap Gold Trim */}
        <mesh geometry={bottomFlapGeo} position={[0, 0, 0.054]} scale={0.97}>
          <meshBasicMaterial color="#D6B16E" transparent opacity={0.22} />
        </mesh>

        {/* --- E. HINGED TOP FLAP (Pivot exactly at top edge y = 1.5) --- */}
        <group ref={flapHingeRef} position={[0, 1.5, 0.06]}>
          {/* Main Top Triangular Flap */}
          <mesh geometry={topFlapGeo} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial
              color="#FFF4E4"
              roughness={0.62}
              metalness={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Thin Champagne Gold Embossed Border */}
          <mesh geometry={topFlapGoldTrimGeo} position={[0, 0, 0.003]}>
            <meshBasicMaterial color="#D6B16E" transparent opacity={0.28} side={THREE.DoubleSide} />
          </mesh>

          {/* --- F. BURGUNDY HEART WAX SEAL (Anchored to tip of flap at y = -1.55) --- */}
          <group ref={sealAnchorRef} position={[0, -1.55, 0.02]}>
            <BurgundyHeartWaxSeal
              hovered={hovered}
              pressed={pressed}
              onClick={handleSealClick}
            />
            {/* Shard Burst Particles on detachment */}
            <LuxuryWaxBreakParticles active={breakShards} />
          </group>
        </group>
      </group>
    </group>
  )
}
