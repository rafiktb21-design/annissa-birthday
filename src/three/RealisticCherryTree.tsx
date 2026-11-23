import { useRef, useMemo, Suspense } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { GLTFLoader, KTX2Loader, MeshoptDecoder } from 'three-stdlib'
import * as THREE from 'three'

interface RealisticCherryTreeProps {
  position: [number, number, number]
  scale?: number
  rotationY?: number
}

function CherryTreeModel({ position, scale = 1, rotationY = 0 }: RealisticCherryTreeProps) {
  const gl = useThree((state) => state.gl)

  const gltf = useLoader(
    GLTFLoader,
    '/assets/models/trees/cherry-blossom-tree-light.glb',
    (loader) => {
      const ktx2 = new KTX2Loader()
      ktx2.setTranscoderPath('/basis/')
      ktx2.detectSupport(gl)
      loader.setKTX2Loader(ktx2)
      loader.setMeshoptDecoder(typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder)
    }
  )

  // Clone scene for multiple instances
  const cloned = useMemo(() => {
    const c = gltf.scene.clone(true)
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return c
  }, [gltf.scene])

  const ref = useRef<THREE.Group>(null!)

  return (
    <group ref={ref} position={position} scale={scale} rotation-y={rotationY}>
      <primitive object={cloned} />
    </group>
  )
}

export default function RealisticCherryTree(props: RealisticCherryTreeProps) {
  return (
    <Suspense fallback={null}>
      <CherryTreeModel {...props} />
    </Suspense>
  )
}
