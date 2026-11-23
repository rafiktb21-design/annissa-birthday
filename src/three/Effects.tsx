export default function Effects() {
  return (
    <>
      <fog attach="fog" args={['#0d0221', 20, 80]} />
      <ambientLight intensity={0.3} />
    </>
  )
}
