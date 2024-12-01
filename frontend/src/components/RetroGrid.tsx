import { Canvas } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Grid() {
  const gridRef = useRef<THREE.Group>(null);

  const horizontalLines = [];
  const verticalLines = [];
  const size = 200; 
  const divisions = 12; 
  const step = size / divisions;
  const perspectiveOffset = 100;

  const getFadeOpacity = (index: number, total: number) => {
    const normalizedIndex = index / total;
    return Math.max(0.15, 1 - Math.pow(normalizedIndex, 1.5));
  };

  for (let i = 0; i <= divisions; i++) {
    const z = (i * step) - (size / 2);
    const y = -perspectiveOffset + (i * (perspectiveOffset / divisions));
    const opacity = getFadeOpacity(i, divisions);
    
    horizontalLines.push(
      <Line
        key={`h${i}`}
        points={[
          new THREE.Vector3(-size / 2, y, z),
          new THREE.Vector3(size / 2, y, z)
        ]}
        color="white"
        lineWidth={1}
        transparent
        opacity={opacity}
      />
    );
  }

  for (let i = 0; i <= divisions; i++) {
    const x = (i * step) - (size / 2);
    const opacity = getFadeOpacity(i, divisions);
    
    verticalLines.push(
      <Line
        key={`v${i}`}
        points={[
          new THREE.Vector3(x, -perspectiveOffset, -size / 2),
          new THREE.Vector3(x, 0, size / 2)
        ]}
        color="white"
        lineWidth={1}
        transparent
        opacity={opacity}
      />
    );
  }

  return (
    <group 
      ref={gridRef}
      rotation={[0.6, 0, 0]}
      position={[0, -20, -50]}
    >
      {horizontalLines}
      {verticalLines}
    </group>
  );
}

function RetroGrid() {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100dvw', 
        height: '100dvh', 
        zIndex: -1, 
        background: 'black',
        overflow: 'hidden'
      }} 
    >
      <Canvas
        camera={{
          position: [0, 30, -10],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <Grid />
      </Canvas>
    </div>
  );
}

export default RetroGrid;
