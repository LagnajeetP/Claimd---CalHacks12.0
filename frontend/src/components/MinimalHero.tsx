import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

function ApplicationScene() {
  const groupRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
    
    // Clock animation - showing time passing
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  // Create animated document stack
  const documents = [];
  for (let i = 0; i < 7; i++) {
    documents.push(
      <mesh 
        key={i}
        position={[0, i * 0.25, 0]} 
        rotation={[0, 0, (i % 2 ? -1 : 1) * 0.02]}
      >
        <boxGeometry args={[1.5, 2, 0.15]} />
        <meshStandardMaterial 
          color={i % 2 === 0 ? "#3B82F6" : "#2563EB"} 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Document stack - representing 34 documents per application */}
      {documents}
      
      {/* Clock showing waiting time */}
      <group position={[-2.5, -1, 0]} rotation={[0, 0, 0]}>
        {/* Clock face */}
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial color="#1F2937" metalness={0.5} roughness={0.5} />
        </mesh>
        
        {/* Hour hand */}
        <mesh ref={hourHandRef} position={[0, 0.05, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.02]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        
        {/* Minute hand */}
        <mesh ref={minuteHandRef} position={[0, 0.05, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.02]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        
        {/* Clock center */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>

      {/* Calendar pages falling - representing months passing */}
      <mesh position={[2.5, 1, 0]} rotation={[Math.PI / 6, 0, Math.PI / 4]}>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#DC2626" metalness={0.6} roughness={0.4} />
      </mesh>

      <mesh position={[2.5, 0.5, 0.2]} rotation={[Math.PI / 8, 0, -Math.PI / 6]}>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#EA580C" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Light sources */}
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#3B82F6" />
      <pointLight position={[-5, 3, 5]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#EC4899" />
    </group>
  );
}

function AnimatedNumbers() {
  return (
    <div className="grid grid-cols-3 gap-12 mt-20 max-w-4xl mx-auto">
      {/* Stat 1 */}
      <div className="group">
        <div className="text-6xl font-light mb-2 text-gray-900">7</div>
        <div className="text-sm text-gray-600 uppercase tracking-wider">Months</div>
        <div className="text-xs text-gray-500 mt-1">Average wait</div>
      </div>
      
      {/* Stat 2 */}
      <div className="group">
        <div className="text-6xl font-light mb-2 text-gray-900">940k+</div>
        <div className="text-sm text-gray-600 uppercase tracking-wider">People</div>
        <div className="text-xs text-gray-500 mt-1">Waiting today</div>
      </div>
      
      {/* Stat 3 */}
      <div className="group">
        <div className="text-6xl font-light mb-2 text-gray-900">34</div>
        <div className="text-sm text-gray-600 uppercase tracking-wider">Documents</div>
        <div className="text-xs text-gray-500 mt-1">Per application</div>
      </div>
    </div>
  );
}

export default function MinimalHero() {
  const [textGradient, setTextGradient] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextGradient((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Light overlay for text contrast */}
      <div className="absolute inset-0 bg-white/70 z-10" />
      
      {/* 3D Canvas - lighter for visibility */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, 5]} intensity={0.8} />
          <ApplicationScene />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 pt-32 pb-20">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 
            className="text-5xl md:text-7xl font-thin tracking-tight mb-4"
            style={{
              background: `linear-gradient(${textGradient}deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #3B82F6)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              display: 'inline-block'
            }}
          >
            Claimd
          </h1>
        </div>

        {/* Main message */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-4xl font-extralight text-gray-900 mb-6 leading-relaxed">
            Social Security benefits.<br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              7 months faster.
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto font-light leading-relaxed">
            AI-powered processing reduces wait times from 7 months to 1-2 days. 
            Helping 940,000+ Americans get their benefits faster.
          </p>
        </div>

        {/* CTA */}
        <div className="mb-20">
          <Link
            to="/user"
            className="inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-light tracking-wide hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get Started
            <span className="ml-3">→</span>
          </Link>
        </div>

        {/* Stats */}
        <AnimatedNumbers />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gray-600 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}

