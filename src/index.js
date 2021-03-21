import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Canvas, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


// Loading state
function LoadingState() {
    return (
        <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry attach='geometry' args={[1, 16, 16]} />
            <meshStandardMaterial
                attach='material'
                color='white'
                transparent
                opacity={0.5}
                roughness={1}
                metalness={0}
            />
        </mesh>
    )
}
function Fighter() {
    const { nodes } = useLoader(GLTFLoader, 'models/SmallFighter.gltf')
    return (
        <group>
            <mesh visible geometry={nodes.Default.geometry}>
                <meshStandardMaterial
                    attatch='material'
                    color='white'
                    roughness={0.3}
                    metalness={0.3}
                />
            </mesh>
        </group>
    )
}




// APP
function App() {
    return (
        <Canvas style={{ background: "#171717" }}>
            <directionalLight intensity={0.5} />
            <Suspense fallback={<LoadingState />}>
                <Fighter />
            </Suspense>
        </Canvas>
    )
}
const root = document.getElementById('root');
ReactDOM.render(<App />, root);