import { useEffect, useRef } from 'react'

export default function Car3D({ scene = 0 }) {
  const svgRef = useRef(null)

  // Scene-based camera positions (zoom + pan)
  const cameraSettings = {
    0: { scale: 1, x: 0, y: 0, label: 'Full Car' },        // Full car view
    1: { scale: 2.5, x: -150, y: -80, label: 'Engine' },   // Engine close-up
    2: { scale: 3, x: 180, y: 100, label: 'Wheel' },       // Wheel close-up
    3: { scale: 2, x: -120, y: 120, label: 'Back' },       // Trunk/back close-up
  }

  const currentCamera = cameraSettings[Math.min(scene, 3)]

  return (
    <div className="w-full h-full flex items-center justify-center perspective">
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className="w-full max-w-2xl h-auto transition-transform duration-500"
        style={{
          transform: `scale(${currentCamera.scale}) translate(${currentCamera.x}px, ${currentCamera.y}px)`,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
        }}
      >
        {/* Car Body */}
        <path
          d="M 80 150 L 100 120 L 150 100 L 250 100 L 300 120 L 320 150 L 300 200 L 100 200 Z"
          fill="#c41e3a"
          stroke="#8b0000"
          strokeWidth="2"
        />

        {/* Windshield */}
        <polygon
          points="120,110 160,105 160,140 125,135"
          fill="#87ceeb"
          opacity="0.7"
        />

        {/* Back Window */}
        <polygon
          points="240,105 280,110 275,135 235,140"
          fill="#87ceeb"
          opacity="0.7"
        />

        {/* Side Windows */}
        <rect
          x="170"
          y="120"
          width="60"
          height="35"
          fill="#87ceeb"
          opacity="0.6"
        />

        {/* Engine Hood Detail */}
        <line x1="150" y1="105" x2="150" y2="115" stroke="#666" strokeWidth="2" />
        <line x1="160" y1="105" x2="160" y2="115" stroke="#666" strokeWidth="2" />
        <line x1="170" y1="100" x2="170" y2="120" stroke="#666" strokeWidth="2" />

        {/* Engine Block (visible detail) */}
        <g id="engine" transform="translate(160, 110)">
          <circle cx="0" cy="0" r="8" fill="#ff6b35" />
          <rect x="-10" y="-3" width="20" height="6" fill="#333" />
          <circle cx="-8" cy="0" r="3" fill="#ffd700" />
          <circle cx="8" cy="0" r="3" fill="#ffd700" />
        </g>

        {/* Left Wheel */}
        <g id="left-wheel">
          {/* Tire */}
          <circle cx="130" cy="200" r="22" fill="#222" stroke="#555" strokeWidth="2" />
          {/* Rim */}
          <circle cx="130" cy="200" r="15" fill="#888" stroke="#666" strokeWidth="1" />
          {/* Wheel detail */}
          <line x1="130" y1="185" x2="130" y2="215" stroke="#555" strokeWidth="2" />
          <line x1="115" y1="200" x2="145" y2="200" stroke="#555" strokeWidth="2" />
          <circle cx="130" cy="200" r="5" fill="#333" />
        </g>

        {/* Right Wheel */}
        <g id="right-wheel">
          {/* Tire */}
          <circle cx="270" cy="200" r="22" fill="#222" stroke="#555" strokeWidth="2" />
          {/* Rim */}
          <circle cx="270" cy="200" r="15" fill="#888" stroke="#666" strokeWidth="1" />
          {/* Wheel detail */}
          <line x1="270" y1="185" x2="270" y2="215" stroke="#555" strokeWidth="2" />
          <line x1="255" y1="200" x2="285" y2="200" stroke="#555" strokeWidth="2" />
          <circle cx="270" cy="200" r="5" fill="#333" />
        </g>

        {/* Bumper details */}
        <rect x="75" y="195" width="250" height="8" fill="#333" opacity="0.6" />

        {/* Headlights */}
        <circle cx="95" cy="145" r="8" fill="#ffeb3b" opacity="0.8" />
        <circle cx="95" cy="145" r="5" fill="#fff" opacity="0.6" />

        {/* Tail Lights */}
        <circle cx="305" cy="150" r="6" fill="#ff4444" opacity="0.8" />
        <circle cx="305" cy="160" r="6" fill="#ff4444" opacity="0.8" />

        {/* Trunk/Back Detail Lines */}
        <line x1="285" y1="130" x2="295" y2="150" stroke="#8b0000" strokeWidth="1" />
        <line x1="295" y1="130" x2="305" y2="150" stroke="#8b0000" strokeWidth="1" />

        {/* Door Lines */}
        <line x1="180" y1="105" x2="180" y2="200" stroke="#8b0000" strokeWidth="2" opacity="0.5" />
        <line x1="220" y1="105" x2="220" y2="200" stroke="#8b0000" strokeWidth="2" opacity="0.5" />

        {/* Door Handles */}
        <rect x="175" y="140" width="8" height="3" fill="#666" />
        <rect x="217" y="140" width="8" height="3" fill="#666" />

        {/* Shadow */}
        <ellipse
          cx="200"
          cy="225"
          rx="130"
          ry="15"
          fill="#000"
          opacity="0.15"
        />
      </svg>

      {/* Debug Label */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
        Scene: {currentCamera.label}
      </div>
    </div>
  )
}
