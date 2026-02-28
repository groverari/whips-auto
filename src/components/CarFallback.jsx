export default function CarFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <img
        src="/car-fallback.jpg"
        alt="Car"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        draggable={false}
      />
    </div>
  )
}
