import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SakuraPetalsProps {
  count?: number
  area?: number
  windStrength?: number
}

export default function SakuraPetals({
  count = 90,
  area = 10,
  windStrength = 1.0,
}: SakuraPetalsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Distribute petals directly across the visible camera frustum
  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * area,
        (Math.random() - 0.5) * 8 + 1, // Visible immediately across y: [-3, 5]
        (Math.random() - 0.5) * 4 + 1
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      speedY: Math.random() * 0.012 + 0.008,
      speedX: Math.random() * 0.006 + 0.003,
      rotSpeedX: (Math.random() - 0.5) * 0.025,
      rotSpeedY: (Math.random() - 0.5) * 0.03,
      rotSpeedZ: (Math.random() - 0.5) * 0.02,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleFreq: Math.random() * 1.5 + 1.2,
      scale: Math.random() * 0.35 + 0.3,
    }))
  }, [count, area])

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    petals.forEach((p, i) => {
      // Natural downward drift
      p.position.y -= p.speedY

      // Organic horizontal swaying with gentle wind & cursor influence
      const wind = Math.sin(t * p.wobbleFreq + p.wobbleOffset) * 0.008 * windStrength
      const mouseWind = pointer.x * 0.012
      p.position.x += wind + mouseWind + p.speedX * 0.5
      p.position.z += Math.cos(t * 0.8 + p.wobbleOffset) * 0.004

      // Gentle tumbling rotation in 3D air currents
      p.rotation.x += p.rotSpeedX + Math.sin(t * 2) * 0.005
      p.rotation.y += p.rotSpeedY
      p.rotation.z += p.rotSpeedZ + Math.cos(t * 2) * 0.005

      // Seamless wrap-around when petal drifts below visible screen
      if (p.position.y < -4.5) {
        p.position.y = 4.5 + Math.random() * 1.5
        p.position.x = (Math.random() - 0.5) * area
        p.position.z = (Math.random() - 0.5) * 4 + 1
      }
      if (p.position.x > area * 0.6) {
        p.position.x = -area * 0.6
      } else if (p.position.x < -area * 0.6) {
        p.position.x = area * 0.6
      }

      dummy.position.copy(p.position)
      dummy.rotation.copy(p.rotation)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Delicate organic sakura petal shape
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.12, 0.1, 0.16, 0.35, 0.04, 0.5)
    shape.bezierCurveTo(0.0, 0.54, -0.04, 0.54, -0.04, 0.5)
    shape.bezierCurveTo(-0.16, 0.35, -0.12, 0.1, 0, 0)

    const geo = new THREE.ShapeGeometry(shape, 8)
    geo.scale(0.55, 0.55, 0.55)
    return geo
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[petalGeometry, undefined, count]}>
      <meshStandardMaterial
        color="#F4D9DE"
        roughness={0.4}
        metalness={0.05}
        transparent
        opacity={0.88}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}
