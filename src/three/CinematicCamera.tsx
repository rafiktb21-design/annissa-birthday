import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Keyframe {
  progress: number
  pos: [number, number, number]
  lookAt: [number, number, number]
}

const CAMERA_KEYFRAMES: Keyframe[] = [
  // Scene 1: The Magical Entrance
  { progress: 0.00, pos: [0, 2.4, 13.5], lookAt: [0, 1.9, -15] },
  { progress: 0.12, pos: [0, 2.1, 4.0], lookAt: [0, 1.8, -25] },
  // Transition 1 -> 2 (Pass under first Floral Rose Archway toward Celebration Banquet)
  { progress: 0.18, pos: [0, 1.9, -25], lookAt: [0, 1.6, -55] },
  // Scene 2: The Birthday Celebration (Centered on 3-tier Birthday Cake)
  { progress: 0.24, pos: [-1.4, 2.05, -55.5], lookAt: [0, 1.42, -65] },
  { progress: 0.31, pos: [0, 1.85, -56.5], lookAt: [0, 1.42, -65] },
  { progress: 0.38, pos: [1.3, 1.95, -57.5], lookAt: [0, 1.42, -65] },
  // Transition 2 -> 3 (Glide through Sakura Avenue toward Polaroid Pavilion)
  { progress: 0.44, pos: [0, 1.85, -90], lookAt: [0, 1.7, -115] },
  // Scene 3: Our Little Memories (Curved Polaroid Memory Gallery)
  { progress: 0.52, pos: [0, 1.8, -117], lookAt: [0, 1.7, -125] },
  { progress: 0.60, pos: [0, 1.8, -119], lookAt: [0, 1.7, -125] },
  // Transition 3 -> 4 (Approach Romantic Pedestal Table)
  { progress: 0.68, pos: [0, 1.7, -155], lookAt: [0, 1.4, -185] },
  // Scene 4: The Love Letter (Parchment & Champagne Gold Seal)
  { progress: 0.74, pos: [0, 1.55, -178], lookAt: [0, 1.35, -185] },
  { progress: 0.82, pos: [0, 1.52, -180], lookAt: [0, 1.35, -185] },
  // Transition 4 -> 5 (Ascend toward Golden Sunset Sky & Constellation)
  { progress: 0.88, pos: [0, 3.8, -218], lookAt: [0, 4.6, -245] },
  // Scene 5: Final Birthday Surprise
  { progress: 1.00, pos: [0, 5.2, -232], lookAt: [0, 5.0, -245] },
]

export default function CinematicCamera({
  progress,
  isLetterOpen = false,
  isBlowing = false,
}: {
  progress: number
  isLetterOpen?: boolean
  isBlowing?: boolean
}) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 12))
  const targetLookAt = useRef(new THREE.Vector3(0, 2.4, -20))
  const currentLookAt = useRef(new THREE.Vector3(0, 2.4, -20))

  // Interpolate keyframes based on current scroll progress
  useMemo(() => {
    const p = Math.max(0, Math.min(1, progress))

    let i = 0
    while (i < CAMERA_KEYFRAMES.length - 1 && CAMERA_KEYFRAMES[i + 1].progress < p) {
      i++
    }

    const kfA = CAMERA_KEYFRAMES[i]
    const kfB = CAMERA_KEYFRAMES[Math.min(i + 1, CAMERA_KEYFRAMES.length - 1)]

    const range = kfB.progress - kfA.progress
    const alpha = range <= 0.0001 ? 0 : (p - kfA.progress) / range

    // Smooth hermite / smoothstep curve
    const smoothAlpha = alpha * alpha * (3 - 2 * alpha)

    const posA = new THREE.Vector3(...kfA.pos)
    const posB = new THREE.Vector3(...kfB.pos)
    targetPos.current.lerpVectors(posA, posB, smoothAlpha)

    const lookA = new THREE.Vector3(...kfA.lookAt)
    const lookB = new THREE.Vector3(...kfB.lookAt)
    targetLookAt.current.lerpVectors(lookA, lookB, smoothAlpha)

    // Cinematic zoom towards candle flames when blowing
    if (isBlowing && p >= 0.20 && p <= 0.44) {
      targetPos.current.set(0, 2.05, -60.8)
      targetLookAt.current.set(0, 2.45, -65)
    }

    // Cinematic intimacy close-up when love letter is open
    if (isLetterOpen && p >= 0.65 && p <= 0.88) {
      targetPos.current.z += 1.4
      targetPos.current.y += 0.08
      targetLookAt.current.y += 0.35
    }
  }, [progress, isLetterOpen, isBlowing])

  useFrame((_state, delta) => {
    // Butter-smooth camera position lerping (lag damping)
    const lerpFactor = Math.min(1, delta * 4.5)
    camera.position.lerp(targetPos.current, lerpFactor)

    // Smooth lookAt target tracking
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
