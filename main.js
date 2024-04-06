import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 360})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Galaxy Generator
 */
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1; 
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';


let geometry = null;
let material = null;
let points = null;

const generatorGallery = () =>{
if(points !== null){
    geometry.dispose();
    material.dispose();
    scene.remove(points);
}
  geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const  colorsInside  = new THREE.Color(parameters.insideColor);
    const  colorsOutside = new THREE.Color(parameters.outsideColor);
    
    for(let i = 0; i < parameters.count; i++){
        //Position
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches  * Math.PI * 2;
        const spinAngle = radius * parameters.spin;

        const randomX = Math.pow(Math.random(),  parameters.randomnessPower) * (Math.random()  < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(),  parameters.randomnessPower) * (Math.random()  < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(),  parameters.randomnessPower) * (Math.random()  < 0.5 ? 1 : -1);
        // const randomX = (Math.random() -0.5) * parameters.randomness ;
        // const randomY = (Math.random() -0.5) * parameters.randomness;
        // const randomZ = (Math.random() -0.5)  * parameters.randomness;

        positions[i3] = Math.cos(branchAngle + spinAngle) * Math.pow(radius + randomX, 1);
        positions[i3 + 1] =  randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle)* Math.pow(radius + randomZ,1 );
 
        //Color
        const mixedColor = colorsInside.clone();
        mixedColor.lerp(colorsOutside, radius / parameters.radius)
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;


    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //Material
    material = new THREE.PointsMaterial();
    material.size = parameters.size;   
    material.depthWrite = false;
    material.blenging = THREE.AdditiveBlending;
    material.vertexColors = true;

    points = new THREE.Points(geometry, material);
    scene.add(points);
}
generatorGallery();


gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generatorGallery);
gui.add(parameters, 'size').min(0.01).max(0.1).step(0.001).onFinishChange(generatorGallery);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generatorGallery);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generatorGallery);
gui.add(parameters, 'spin').min(-5).max(5).step(1).onFinishChange(generatorGallery);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generatorGallery);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generatorGallery);
gui.addColor(parameters, 'insideColor').onFinishChange(generatorGallery);
gui.addColor(parameters, 'outsideColor').onFinishChange(generatorGallery);




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()