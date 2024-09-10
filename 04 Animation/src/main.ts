import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()

// Grid
scene.add(new THREE.GridHelper())

// Skybox
scene.background = new THREE.CubeTextureLoader()
.setPath('https://sbcode.net/img/')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
scene.backgroundBlurriness = 0.1

// Camera
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z = 1.5
camera.position.y = 0.5

// Canvas
const canvas = document.getElementById('canvasim') as HTMLCanvasElement

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
renderer.setSize(400, 400)

// Cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
scene.add(cube)

// Orbit Controls
new OrbitControls(camera, renderer.domElement)

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  camera.lookAt(0, 0.5, 0)
  
  renderer.render(scene, camera)
}



animate()