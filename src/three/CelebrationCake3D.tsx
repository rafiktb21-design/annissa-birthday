import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { audio } from '../utils/audio'
import { createCircularParticleTexture } from './ParticleSystem'

interface CelebrationCake3DProps {
  candlesLit: boolean
  onBlowCandles: () => void
  isBlowing?: boolean
  isSurpriseActive?: boolean
  scrollProgress?: number
  position?: [number, number, number]
}

// =========================================================================
// 1. DELICATE HANDCRAFTED SUGAR ROSES
// =========================================================================
function SugarRose({
  position,
  scale = 1,
  color = '#F4B6C8',
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Rose center bud */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {/* Inner Petals */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <mesh
          key={`in-${i}`}
          position={[Math.cos(angle) * 0.04, 0.03, Math.sin(angle) * 0.04]}
          rotation={[0.3, angle, 0.2]}
        >
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Outer Petals */}
      {[0.6, 1.8, 3.0, 4.2, 5.4].map((angle, i) => (
        <mesh
          key={`out-${i}`}
          position={[Math.cos(angle) * 0.08, 0.015, Math.sin(angle) * 0.08]}
          rotation={[0.45, angle, 0.3]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// =========================================================================
// 2. GLOSSED RIPE STRAWBERRIES
// =========================================================================
function GlossyStrawberry({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Strawberry body (tapered berry cone) */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <coneGeometry args={[0.085, 0.16, 14]} />
        <meshStandardMaterial
          color="#D9384E"
          roughness={0.22}
          metalness={0.08}
          emissive="#520B15"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Berry top rounded crown */}
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshStandardMaterial
          color="#C92A40"
          roughness={0.25}
          metalness={0.08}
        />
      </mesh>
      {/* Green Leaf Calyx */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.045, 0.155, Math.sin(angle) * 0.045]}
          rotation={[0.2, angle, 0.4]}
        >
          <coneGeometry args={[0.03, 0.08, 4]} />
          <meshStandardMaterial color="#3D7E40" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// =========================================================================
// 3. BUTTERCREAM PIPED PEARL BORDER
// =========================================================================
function ButtercreamPearlRing({
  radius,
  count,
  y,
  color = '#FFFDF8',
  size = 0.04,
}: {
  radius: number
  count: number
  y: number
  color?: string
  size?: number
}) {
  const pearls = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      }
    })
  }, [radius, count])

  return (
    <group position={[0, y, 0]}>
      {pearls.map((p, i) => (
        <mesh key={i} position={[p.x, 0, p.z]}>
          <sphereGeometry args={[size, 10, 10]} />
          <meshStandardMaterial
            color={color}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

// =========================================================================
// 4. CANDLE WITH FLICKERING FLAME & SMOKE WISPS
// =========================================================================
interface CandleProps {
  position: [number, number, number]
  isLit: boolean
  isBlowing: boolean
  smokeActive: boolean
  delayIndex: number
}

function BirthdayCandle({
  position,
  isLit,
  isBlowing,
  smokeActive,
  delayIndex,
}: CandleProps) {
  const flameRef = useRef<THREE.Group>(null!)
  const flameLightRef = useRef<THREE.PointLight>(null!)
  const smokeRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(delayIndex * 0.7)

  const smokeTexture = useMemo(() => {
    if (typeof document !== 'undefined') return createCircularParticleTexture()
    return null
  }, [])

  // Smoke particles
  const smokeParticles = useMemo(() => {
    const count = 16
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.04
      pos[i * 3 + 1] = i * 0.06
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.04
    }
    return pos
  }, [])

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    if (flameRef.current) {
      if (isLit) {
        // Natural organic candle flame dance
        const flickerX = Math.sin(t * 18 + delayIndex) * 0.06
        const flickerZ = Math.cos(t * 14 + delayIndex * 2) * 0.05
        const scaleY = 1.0 + Math.sin(t * 22) * 0.12

        // When blowing, flame leans heavily and shrinks
        if (isBlowing) {
          flameRef.current.rotation.z = THREE.MathUtils.lerp(flameRef.current.rotation.z, 0.7, delta * 8)
          flameRef.current.scale.set(0.6, 0.5, 0.6)
        } else {
          flameRef.current.rotation.set(flickerX, 0, flickerZ)
          flameRef.current.scale.set(1, scaleY, 1)
        }
        flameRef.current.visible = true
      } else {
        flameRef.current.visible = false
      }
    }

    if (flameLightRef.current) {
      if (isLit) {
        const intensity = isBlowing
          ? 0.4 + Math.sin(t * 25) * 0.2
          : 0.9 + Math.sin(t * 16) * 0.2
        flameLightRef.current.intensity = intensity
      } else {
        flameLightRef.current.intensity = 0
      }
    }

    // Animate rising smoke puffs when extinguished
    if (smokeRef.current && smokeActive) {
      const arr = smokeRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < 16; i++) {
        arr[i * 3 + 1] += delta * 0.4
        arr[i * 3] += Math.sin(t * 3 + i) * delta * 0.05
        if (arr[i * 3 + 1] > 0.8) {
          arr[i * 3 + 1] = 0.02
          arr[i * 3] = (Math.random() - 0.5) * 0.03
        }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Candle Body: Spiral Tapered Wax Cylinder */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.036, 0.56, 16]} />
        <meshStandardMaterial
          color={delayIndex % 2 === 0 ? '#F4B6C8' : '#FFF5EA'}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Gold Spiral Stripe Accent */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.033, 0.037, 0.52, 16]} />
        <meshStandardMaterial
          color="#D9B77E"
          metalness={0.8}
          roughness={0.25}
          wireframe
        />
      </mesh>

      {/* Dark Wick */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
        <meshStandardMaterial color="#2B1810" roughness={0.9} />
      </mesh>

      {/* Candle Flame Group */}
      <group ref={flameRef} position={[0, 0.65, 0]}>
        {/* Outer Warm Flame Teardrop */}
        <mesh position={[0, 0.06, 0]}>
          <coneGeometry args={[0.038, 0.14, 12]} />
          <meshBasicMaterial color="#FF9D3B" />
        </mesh>
        {/* Inner Bright Flame Core */}
        <mesh position={[0, 0.035, 0]}>
          <coneGeometry args={[0.022, 0.09, 10]} />
          <meshBasicMaterial color="#FFF7B8" />
        </mesh>
        {/* Blue Flame Base */}
        <mesh position={[0, 0.005, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#5E9FFF" />
        </mesh>
      </group>

      {/* Candle Flame Glow Light */}
      <pointLight
        ref={flameLightRef}
        position={[0, 0.72, 0]}
        color="#FFA845"
        intensity={0.9}
        distance={4.5}
        decay={2}
      />

      {/* Rising Smoke Wisps after Extinguishing */}
      {smokeActive && (
        <points ref={smokeRef} position={[0, 0.6, 0]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[smokeParticles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={smokeTexture ?? undefined}
            size={0.16}
            color="#FFF4E8"
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  )
}

// =========================================================================
// 5. HELIUM BALLOONS WITH WAVING SATIN STRINGS
// =========================================================================
function HeliumBalloon({
  position,
  color,
  delay = 0,
  isSurprise = false,
}: {
  position: [number, number, number]
  color: string
  delay?: number
  isSurprise?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(delay)
  const baseY = position[1]

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    if (groupRef.current) {
      // Natural bobbing sway
      const swayY = Math.sin(t * 0.9) * 0.18
      const swayX = Math.sin(t * 0.6) * 0.08
      const swayZ = Math.cos(t * 0.7) * 0.08

      // When surprise is active, balloons gently ascend
      const riseOffset = isSurprise ? Math.min(2.8, (t - delay) * 0.35) : 0

      groupRef.current.position.y = baseY + swayY + riseOffset
      groupRef.current.position.x = position[0] + swayX
      groupRef.current.position.z = position[2] + swayZ
      groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.06
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Glossy Pearlescent Balloon Sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.65}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Balloon Base Tie Knot */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.045, 0.07, 10]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Golden Ribbon String */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 1.3, 6]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

// =========================================================================
// 6. PARTY POPPERS & EXPLODING CONFETTI CANNONS
// =========================================================================
function PartyPopperCannons({ active }: { active: boolean }) {
  const leftPopperRef = useRef<THREE.Group>(null!)
  const rightPopperRef = useRef<THREE.Group>(null!)
  const confettiMeshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 120 confetti flakes per blast
  const confettiCount = 140
  const confettiData = useMemo(() => {
    const colors = ['#F4B6C8', '#E99BB7', '#D9B77E', '#FFF5EA', '#C8B9E8', '#F7C9B4']
    return Array.from({ length: confettiCount }, (_, i) => {
      const isLeft = i % 2 === 0
      const originX = isLeft ? -3.2 : 3.2
      const angle = isLeft ? (Math.PI / 4 + (Math.random() - 0.5) * 0.5) : (3 * Math.PI / 4 + (Math.random() - 0.5) * 0.5)
      const speed = Math.random() * 4.5 + 3.0

      return {
        pos: new THREE.Vector3(originX, 0.6, 0.4),
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed + Math.random() * 2.5,
          (Math.random() - 0.5) * 2.5
        ),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8),
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
        alive: true,
      }
    })
  }, [])

  useEffect(() => {
    if (!confettiMeshRef.current) return
    confettiData.forEach((c, i) => {
      confettiMeshRef.current.setColorAt(i, c.color)
    })
    if (confettiMeshRef.current.instanceColor) {
      confettiMeshRef.current.instanceColor.needsUpdate = true
    }
  }, [confettiData])

  useFrame((_state, delta) => {
    if (!active) return

    // Animate popper pop recoil
    if (leftPopperRef.current) {
      leftPopperRef.current.position.x = THREE.MathUtils.lerp(leftPopperRef.current.position.x, -2.8, delta * 6)
    }
    if (rightPopperRef.current) {
      rightPopperRef.current.position.x = THREE.MathUtils.lerp(rightPopperRef.current.position.x, 2.8, delta * 6)
    }

    if (confettiMeshRef.current) {
      confettiData.forEach((c, i) => {
        c.pos.addScaledVector(c.vel, delta)
        c.vel.y -= delta * 3.8 // gravity
        c.vel.x *= 0.98 // air drag
        c.vel.z *= 0.98

        c.rot.x += c.rotSpeed.x * delta
        c.rot.y += c.rotSpeed.y * delta
        c.rot.z += c.rotSpeed.z * delta

        if (c.pos.y < -0.2) {
          c.pos.y = -0.2
          c.vel.set(0, 0, 0)
        }

        dummy.position.copy(c.pos)
        dummy.rotation.copy(c.rot)
        dummy.scale.set(0.12, 0.18, 0.01)
        dummy.updateMatrix()
        confettiMeshRef.current.setMatrixAt(i, dummy.matrix)
      })
      confettiMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  if (!active) return null

  return (
    <group>
      {/* Left Festive Popper Cannon */}
      <group ref={leftPopperRef} position={[-3.4, 0.6, 0.4]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.1, 0.65, 16]} />
          <meshStandardMaterial color="#E99BB7" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.165, 0.165, 0.1, 16]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Right Festive Popper Cannon */}
      <group ref={rightPopperRef} position={[3.4, 0.6, 0.4]} rotation={[0, 0, Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.1, 0.65, 16]} />
          <meshStandardMaterial color="#F4B6C8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.165, 0.165, 0.1, 16]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Exploding Metallic Confetti Flakes */}
      <instancedMesh ref={confettiMeshRef} args={[undefined, undefined, confettiCount]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.25} metalness={0.75} />
      </instancedMesh>
    </group>
  )
}

// =========================================================================
// 7. FLOATING HEART PARTICLES
// =========================================================================
function FloatingHeartSurprise({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const heartGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0, y = 0
    shape.moveTo(x + 0.25, y + 0.25)
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35)
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0)
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35)
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y)
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)

    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [])

  const hearts = useMemo(() => {
    const colors = ['#F4B6C8', '#E99BB7', '#FFF5EA', '#C8B9E8']
    return Array.from({ length: 18 }, () => ({
      pos: [
        (Math.random() - 0.5) * 4.5,
        Math.random() * 2.5 + 1.2,
        (Math.random() - 0.5) * 3.5,
      ] as [number, number, number],
      scale: 0.22 + Math.random() * 0.18,
      speed: 0.6 + Math.random() * 0.6,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [])

  useFrame((_state, delta) => {
    if (!active || !groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const h = hearts[i]
      if (h) {
        child.position.y += delta * h.speed
        child.rotation.y += delta * h.rotSpeed
        if (child.position.y > 6.5) {
          child.position.y = 1.2
        }
      }
    })
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {hearts.map((h, i) => (
        <mesh key={i} position={h.pos} scale={h.scale} geometry={heartGeo}>
          <meshStandardMaterial
            color={h.color}
            roughness={0.3}
            metalness={0.4}
            emissive={h.color}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}

// =========================================================================
// 8. SPIRAL RIBBON STREAMERS
// =========================================================================
function SpiralStreamers({ active }: { active: boolean }) {
  const streamersRef = useRef<THREE.Group>(null!)

  const ribbons = useMemo(() => {
    const colors = ['#D9B77E', '#F4B6C8', '#C8B9E8', '#F7C9B4', '#FFF5EA']
    return Array.from({ length: 10 }, (_, i) => {
      const points: THREE.Vector3[] = []
      const turns = 3.5
      const height = 2.2
      const radius = 0.16
      for (let j = 0; j <= 30; j++) {
        const t = j / 30
        const angle = t * Math.PI * 2 * turns
        points.push(new THREE.Vector3(Math.cos(angle) * radius, -t * height, Math.sin(angle) * radius))
      }
      const curve = new THREE.CatmullRomCurve3(points)
      const geo = new THREE.TubeGeometry(curve, 24, 0.022, 6, false)
      return {
        geo,
        color: colors[i % colors.length],
        pos: [
          (Math.random() - 0.5) * 5.5,
          5.2 + Math.random() * 2.0,
          (Math.random() - 0.5) * 3.0,
        ] as [number, number, number],
        speed: 0.9 + Math.random() * 0.5,
        rotSpeed: (Math.random() - 0.5) * 2.4,
      }
    })
  }, [])

  useFrame((_state, delta) => {
    if (!active || !streamersRef.current) return
    streamersRef.current.children.forEach((child, i) => {
      const r = ribbons[i]
      if (r) {
        child.position.y -= delta * r.speed
        child.rotation.y += delta * r.rotSpeed
        if (child.position.y < -0.2) {
          child.position.y = 5.8
        }
      }
    })
  })

  if (!active) return null

  return (
    <group ref={streamersRef}>
      {ribbons.map((r, i) => (
        <mesh key={i} geometry={r.geo} position={r.pos}>
          <meshStandardMaterial color={r.color} roughness={0.3} metalness={0.65} />
        </mesh>
      ))}
    </group>
  )
}

// =========================================================================
// 9. FESTIVE BIRTHDAY BUNTING BANNER & FAIRY LIGHTS
// =========================================================================
function FestiveBirthdayBanner() {
  const pennants = useMemo(() => {
    const count = 17
    const colors = ['#F4B6C8', '#D9B77E', '#C8B9E8', '#FFF5EA', '#F7C9B4']
    return Array.from({ length: count }, (_, i) => {
      const t = (i / (count - 1)) * 2 - 1 // -1 to 1
      const x = t * 4.8
      const y = 4.3 - (1 - t * t) * 0.75
      const z = -2.8 + Math.abs(t) * 0.45
      return {
        pos: [x, y, z] as [number, number, number],
        color: colors[i % colors.length],
        rotZ: t * -0.22,
      }
    })
  }, [])

  return (
    <group>
      {/* Golden Banner Posts */}
      <mesh position={[-4.8, 2.3, -2.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 4.6, 16]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-4.8, 4.65, -2.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.8, 2.3, -2.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 4.6, 16]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.8, 4.65, -2.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Triangular Pennants */}
      {pennants.map((p, i) => (
        <group key={i} position={p.pos} rotation={[0, 0, p.rotZ]}>
          <mesh position={[0, -0.22, 0]}>
            <coneGeometry args={[0.22, 0.44, 3]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.4}
              metalness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Mini Gold Bead */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#FFD899" />
          </mesh>
        </group>
      ))}

      {/* Warm Fairy Light Garland Arc */}
      {Array.from({ length: 24 }).map((_, i) => {
        const t = (i / 23) * 2 - 1
        const x = t * 4.6
        const y = 3.6 - (1 - t * t) * 0.6
        const z = -2.6 + Math.abs(t) * 0.35
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#FFE8A3" />
          </mesh>
        )
      })}
    </group>
  )
}

// =========================================================================
// AUTHENTIC CC0 DECORATIONS (LANTERNS, BENCH, GIFTS, BALLOON CLUSTERS)
// =========================================================================
function AuthenticCelebrationDecorations() {
  const lantern = useGLTF('/assets/models/decorations/wooden_lantern_01.glb')
  const bench = useGLTF('/assets/models/decorations/painted_wooden_bench.glb')
  const gifts = useGLTF('/assets/models/decorations/gift-box-collection.glb')
  const balloons = useGLTF('/assets/models/balloons/balloons-cluster.glb')

  const lanternLeft = useMemo(() => lantern.scene.clone(true), [lantern.scene])
  const lanternRight = useMemo(() => lantern.scene.clone(true), [lantern.scene])
  const benchClone = useMemo(() => bench.scene.clone(true), [bench.scene])
  const giftsClone = useMemo(() => gifts.scene.clone(true), [gifts.scene])
  const balloonsLeft = useMemo(() => balloons.scene.clone(true), [balloons.scene])
  const balloonsRight = useMemo(() => balloons.scene.clone(true), [balloons.scene])

  return (
    <group>
      {/* Garden Lantern Left with flickering candle glow */}
      <group position={[-2.7, -0.32, 1.4]} scale={0.65} rotation={[0, 0.4, 0]}>
        <primitive object={lanternLeft} />
        <pointLight position={[0, 0.5, 0]} color="#FFBA66" intensity={1.6} distance={6} decay={2} />
      </group>

      {/* Garden Lantern Right with flickering candle glow */}
      <group position={[2.7, -0.32, 1.4]} scale={0.65} rotation={[0, -0.4, 0]}>
        <primitive object={lanternRight} />
        <pointLight position={[0, 0.5, 0]} color="#FFBA66" intensity={1.6} distance={6} decay={2} />
      </group>

      {/* Romantic Garden Park Bench */}
      <group position={[4.6, -0.32, -0.8]} scale={0.8} rotation={[0, -0.5, 0]}>
        <primitive object={benchClone} />
      </group>

      {/* Gift Boxes resting near bench */}
      <group position={[4.1, -0.32, 0.6]} scale={0.85} rotation={[0, 0.3, 0]}>
        <primitive object={giftsClone} />
      </group>

      {/* Balloon Clusters framing the banquet table */}
      <group position={[-2.8, -0.2, -1.5]} scale={0.7} rotation={[0, 0.3, 0]}>
        <primitive object={balloonsLeft} />
      </group>
      <group position={[2.8, -0.2, -1.5]} scale={0.7} rotation={[0, -0.3, 0]}>
        <primitive object={balloonsRight} />
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/decorations/wooden_lantern_01.glb')
useGLTF.preload('/assets/models/decorations/painted_wooden_bench.glb')
useGLTF.preload('/assets/models/decorations/gift-box-collection.glb')
useGLTF.preload('/assets/models/balloons/balloons-cluster.glb')

// =========================================================================
// 10. MASTER CELEBRATION CAKE & ENVIRONMENT SCENE
// =========================================================================
export default function CelebrationCake3D({
  candlesLit,
  onBlowCandles,
  isBlowing = false,
  isSurpriseActive = false,
  scrollProgress = 0,
  position = [0, 0, -65],
}: CelebrationCake3DProps) {
  const cakeGroupRef = useRef<THREE.Group>(null!)
  const [internalBlowing, setInternalBlowing] = useState(false)
  const [candleStates, setCandleStates] = useState([true, true, true, true, true])
  const [smokeActive, setSmokeActive] = useState(false)
  const [surpriseActive, setSurpriseActive] = useState(false)

  // 5 Candle positions symmetrically placed on the top tier (y = 2.45)
  const candleConfigs = useMemo(() => [
    { pos: [0, 2.45, 0] as [number, number, number], delay: 0 },
    { pos: [0.26, 2.45, 0.16] as [number, number, number], delay: 1 },
    { pos: [-0.26, 2.45, 0.16] as [number, number, number], delay: 2 },
    { pos: [0.24, 2.45, -0.18] as [number, number, number], delay: 3 },
    { pos: [-0.24, 2.45, -0.18] as [number, number, number], delay: 4 },
  ], [])

  // Sync external candlesLit prop with internal multi-candle state
  useEffect(() => {
    if (!candlesLit) {
      // Trigger smooth sequential extinguishing sequence
      setInternalBlowing(true)
      audio.playWindBlow()

      // Extinguish candles one by one with a short delay
      candleConfigs.forEach((_, idx) => {
        setTimeout(() => {
          setCandleStates((prev) => {
            const next = [...prev]
            next[idx] = false
            return next
          })
        }, 350 + idx * 160)
      })

      // Activate smoke wisps
      setTimeout(() => {
        setSmokeActive(true)
        setInternalBlowing(false)
      }, 1100)

      // Trigger Party Surprise Cannon Explosion!
      setTimeout(() => {
        setSurpriseActive(true)
        audio.playPartyPopper()
      }, 1400)

      // Fade out smoke after 4s
      setTimeout(() => {
        setSmokeActive(false)
      }, 4500)
    } else {
      // Reset candles back to lit
      setCandleStates([true, true, true, true, true])
      setInternalBlowing(false)
      setSmokeActive(false)
      setSurpriseActive(false)
    }
  }, [candlesLit, candleConfigs])

  // Gentle idle rotation of the cake and presentation podium
  useFrame((_state, delta) => {
    if (cakeGroupRef.current) {
      cakeGroupRef.current.rotation.y += delta * 0.09
    }
  })

  // Balloons flanking the celebratory setup
  const balloons = [
    { pos: [-2.5, 2.1, -1.5] as const, color: '#F4B6C8', delay: 0 },
    { pos: [2.5, 2.3, -1.3] as const, color: '#D9B77E', delay: 1 },
    { pos: [-2.1, 2.5, 0.8] as const, color: '#C8B9E8', delay: 2 },
    { pos: [2.2, 2.4, 0.9] as const, color: '#F7C9B4', delay: 3 },
  ]

  // Strawberries around top tier
  const strawberries = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const r = 0.52
      return {
        pos: [Math.cos(angle) * r, 2.46, Math.sin(angle) * r] as [number, number, number],
        rot: [0.15, angle, 0.1] as [number, number, number],
      }
    })
  }, [])

  // Sugar roses clustered on top tier
  const topTierRoses = useMemo(() => [
    { pos: [0.14, 2.47, 0.35] as [number, number, number], scale: 1.1, color: '#F4B6C8' },
    { pos: [-0.34, 2.47, -0.15] as [number, number, number], scale: 1.0, color: '#FFF5EA' },
    { pos: [0.35, 2.47, -0.12] as [number, number, number], scale: 0.95, color: '#E99BB7' },
    { pos: [-0.18, 2.47, 0.38] as [number, number, number], scale: 1.05, color: '#F7C9B4' },
  ], [])

  const [fabricDiff, fabricNor] = useTexture([
    '/assets/textures/fabric/diffuse.jpg',
    '/assets/textures/fabric/normal.jpg',
  ])

  useEffect(() => {
    if (fabricDiff && fabricNor) {
      ;[fabricDiff, fabricNor].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(6, 6)
        t.needsUpdate = true
      })
    }
  }, [fabricDiff, fabricNor])

  return (
    <group position={position}>
      {/* Authentic CC0 Decorations (Lanterns, Bench, Gift Boxes, Balloon Clusters) */}
      <AuthenticCelebrationDecorations />

      {/* ================= 1. LUXURY FESTIVE BANQUET TABLE ================= */}
      {/* Table Top: Soft Ivory Linen with Champagne Gold Trim */}
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.32, 48]} />
        <meshStandardMaterial
          map={fabricDiff}
          normalMap={fabricNor}
          color="#FFF5EA"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>
      {/* Table Gold Rim */}
      <mesh position={[0, -0.16, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.82, 0.04, 16, 48]} />
        <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Warm Fairy Light Beads around Table Rim */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.85, -0.18, Math.sin(angle) * 2.85]}
          >
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#FFD899" />
          </mesh>
        )
      })}

      {/* Table Flowers & Peonies around Stand Base */}
      {[0, 1.05, 2.1, 3.14, 4.2, 5.25].map((angle, i) => (
        <group
          key={`tbl-flower-${i}`}
          position={[Math.cos(angle) * 1.85, -0.12, Math.sin(angle) * 1.85]}
          rotation={[0.1, angle, 0]}
        >
          <SugarRose
            position={[0, 0, 0]}
            scale={1.2}
            color={i % 2 === 0 ? '#F4B6C8' : '#FFF5EA'}
          />
        </group>
      ))}

      {/* ================= 2. FESTIVE BIRTHDAY BUNTING BANNER ================= */}
      <FestiveBirthdayBanner />

      {/* ================= 3. ROTATING CELEBRATION CAKE & GOLD STAND ================= */}
      <group ref={cakeGroupRef} position={[0, 0, 0]}>
        {/* --- A. CHAMPAGNE GOLD CAKE STAND --- */}
        {/* Flared Pedestal Base */}
        <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 1.35, 0.16, 36]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Turned Column Shaft */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 0.32, 24]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Ornate Gold Torus Bead */}
        <mesh position={[0, 0.16, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.28, 0.04, 12, 32]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* Mirrored Gold Cake Plate */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.7, 0.08, 48]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.9} roughness={0.18} />
        </mesh>

        {/* --- B. TIER 1: BOTTOM TIER (IVORY BUTTERCREAM) --- */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.42, 1.45, 0.66, 48]} />
          <meshStandardMaterial
            color="#FFF5EA"
            roughness={0.52}
            metalness={0.03}
          />
        </mesh>
        {/* Bottom Tier Piped Pearls */}
        <ButtercreamPearlRing radius={1.44} count={34} y={0.41} size={0.045} />
        {/* Pastel Pink Fondant Ribbon Wrap */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[1.44, 1.44, 0.14, 48]} />
          <meshStandardMaterial color="#F4B6C8" roughness={0.45} />
        </mesh>
        {/* Gold Border Trim on Ribbon */}
        <mesh position={[0, 0.72, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.445, 0.015, 8, 48]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.58, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.445, 0.015, 8, 48]} />
          <meshStandardMaterial color="#D9B77E" metalness={0.88} roughness={0.2} />
        </mesh>

        {/* --- C. TIER 2: MIDDLE TIER (PASTEL BLUSH PINK) --- */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.02, 1.05, 0.60, 40]} />
          <meshStandardMaterial
            color="#F4B6C8"
            roughness={0.50}
            metalness={0.02}
          />
        </mesh>
        {/* Middle Tier Piped Pearls */}
        <ButtercreamPearlRing radius={1.04} count={26} y={1.07} size={0.04} />
        {/* Soft Cream Lace Drip Trim */}
        <mesh position={[0, 1.58, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.03, 0.035, 12, 40]} />
          <meshStandardMaterial color="#FFF5EA" roughness={0.4} />
        </mesh>
        {/* Delicate Sugar Pearls on Middle Tier */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.035, 1.35 + (i % 2 === 0 ? 0.08 : -0.08), Math.sin(angle) * 1.035]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#FFFDF8" metalness={0.4} roughness={0.2} />
            </mesh>
          )
        })}

        {/* --- D. TIER 3: TOP TIER (SOFT CREAM) --- */}
        <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.66, 0.68, 0.56, 36]} />
          <meshStandardMaterial
            color="#FFF5EA"
            roughness={0.52}
            metalness={0.03}
          />
        </mesh>
        {/* Top Tier Piped Pearls */}
        <ButtercreamPearlRing radius={0.68} count={20} y={1.69} size={0.036} />
        {/* Top Rim Frosted Border */}
        <mesh position={[0, 2.22, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.66, 0.035, 12, 36]} />
          <meshStandardMaterial color="#F4B6C8" roughness={0.45} />
        </mesh>

        {/* --- E. TOP TIER GARNISHES (STRAWBERRIES & SUGAR ROSES) --- */}
        {strawberries.map((s, i) => (
          <GlossyStrawberry key={i} position={s.pos} rotation={s.rot} scale={1.0} />
        ))}
        {topTierRoses.map((r, i) => (
          <SugarRose key={i} position={r.pos} scale={r.scale} color={r.color} />
        ))}

        {/* --- F. 5 PROPORTIONAL BIRTHDAY CANDLES --- */}
        {candleConfigs.map((c, idx) => (
          <BirthdayCandle
            key={idx}
            position={c.pos}
            isLit={candleStates[idx]}
            isBlowing={internalBlowing}
            smokeActive={smokeActive}
            delayIndex={c.delay}
          />
        ))}

        {/* Dynamic Warm Candle Glow Light */}
        {candlesLit && (
          <pointLight
            position={[0, 3.2, 0]}
            color="#FFA845"
            intensity={1.8}
            distance={10}
            decay={2}
          />
        )}
      </group>

      {/* ================= 3. FLOATING HELIUM METALLIC BALLOONS ================= */}
      {balloons.map((b, i) => (
        <HeliumBalloon
          key={i}
          position={[b.pos[0], b.pos[1], b.pos[2]]}
          color={b.color}
          delay={b.delay}
          isSurprise={surpriseActive}
        />
      ))}

      {/* ================= 5. SURPRISE PARTY POPPERS & CONFETTI ================= */}
      <PartyPopperCannons active={surpriseActive} />

      {/* ================= 6. SURPRISE SPIRAL RIBBON STREAMERS ================= */}
      <SpiralStreamers active={surpriseActive} />

      {/* ================= 7. SURPRISE FLOATING HEARTS ================= */}
      <FloatingHeartSurprise active={surpriseActive} />

      {/* ================= 6. CINEMATIC SCENE LIGHTING ================= */}
      {/* Overhead Key Light illuminating the centerpiece */}
      <pointLight position={[0, 5.5, 1.2]} intensity={2.4} color="#FFF5EA" distance={16} />
      {/* Soft Rose Fill Light */}
      <pointLight position={[-4, 3.5, 2]} intensity={1.6} color="#F4B6C8" distance={14} />
      {/* Warm Champagne Accent Light */}
      <pointLight position={[4, 3.5, 2]} intensity={1.6} color="#D9B77E" distance={14} />
      {/* Soft Lavender Rim Light from behind */}
      <pointLight position={[0, 4.0, -3.5]} intensity={1.4} color="#C8B9E8" distance={14} />
    </group>
  )
}
