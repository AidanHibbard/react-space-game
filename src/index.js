import SmallFighter from './models/SmallFighter.gltf'
import React, { Suspense, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { 
    Canvas, 
    useLoader, 
    extend,
    useFrame,
    useThree
} from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//Floor height
const FloorHeight = -100;



extend({ OrbitControls })

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
// Ship model
function Fighter() {
    const ship = useLoader(GLTFLoader, SmallFighter)
    return <primitive object={ship.scene} position={[0, 0, 0]} />
}
// Ground layer (space)

function Floor() {
    const floor = useRef()
    return (
        <mesh 
            visible
            position={[0, FloorHeight, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            ref={floor}
        >
            <planeBufferGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
            <meshStandardMaterial
                attach="material"
                color="white"
                roughness={1}
                metalness={0}
                wireframe
            />
        </mesh>
    )
}

// Camera Controls
const CameraControls = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree();
    const controls = useRef()
    // I have no idea if state is neccessary or not, Ive tested without it and the controls work but Im leaving it in
    useFrame((state) => controls.current.update())
    // maxAzimuthAngle={Math.PI / 4} maxPolarAngle={Math.PI} minAzimuthAngle={-Math.PI / 4} minPolarAngle={0}
    return <orbitControls ref={controls} args={[camera, domElement]}/>;
}


// APP
function App() {
    return (
        <Canvas style={{ background: "#ffffff" }}>
            <CameraControls />
            <directionalLight intensity={0.5} />
            <Suspense fallback={<LoadingState />}>
                <Fighter />
            </Suspense>
            <Floor />
        </Canvas>
    )
}
// Binding app to root element
const root = document.getElementById('root');
ReactDOM.render(<App />, root);