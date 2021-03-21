import SmallFighter from './models/SmallFighter.gltf'
import background from './images/background.png'
import React, { Suspense, useRef, useState } from 'react';
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
import { MeshBasicMaterial, TextureLoader } from 'three';

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
    const [shipPosition, setShipPosition] = useState()
    const ship = useRef()
    useFrame(({mouse}) => {
        setShipPosition({
            position: { x: mouse.x * 6, y: mouse.y * 2 },
            rotation: { z: -mouse.x * 0.5, x: -mouse.x * 0.5, y: -mouse.y * 0.2 },
        })
    })
    useFrame(() => {
        ship.current.rotation.z = shipPosition.rotation.z;
        ship.current.rotation.y = shipPosition.rotation.x;
        ship.current.rotation.x = shipPosition.rotation.y;
        ship.current.position.y = shipPosition.position.y;
        ship.current.position.x = shipPosition.position.x;
    })
    const gltf = useLoader(GLTFLoader, SmallFighter)
    return (
        <group ref={ship}>
            <primitive object={gltf.scene} position={[0, 0, 0]} />
        </group>
    )
}
// Ground layer (space)
function Floor() {
    const floor = useRef()
    const texture = useLoader(TextureLoader, background)
    return (
        <mesh 
            visible
            position={[0, FloorHeight, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            ref={floor}
        >
            <planeBufferGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
            <MeshBasicMaterial attach="material" map={texture}/>
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
    // I have no idea if (state) is neccessary or not, Ive tested without it and the controls work but Im leaving it in because it may be useful later
    useFrame((state) => controls.current.update())
    // Add below to controls to
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
                <Floor />
            </Suspense>
        </Canvas>
    )
}
// Binding app to root element
const root = document.getElementById('root');
ReactDOM.render(<App />, root);