import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

// Scene
const scene = new THREE.Scene()

// Axes Helper
scene.add(new THREE.AxesHelper(5))

// Skybox
scene.background = new THREE.CubeTextureLoader()
.setPath('https://sbcode.net/img/')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
scene.backgroundBlurriness = 0.1

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(1, 2, 3)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Orbit Controls
new OrbitControls(camera, renderer.domElement)

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI

const gui = new GUI()

const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube, 'visible')
cubeFolder.open()

const positionFolder = cubeFolder.addFolder('Position')
positionFolder.add(cube.position, 'x', -5, 5)
positionFolder.add(cube.position, 'y', -5, 5)
positionFolder.add(cube.position, 'z', -5, 5)
positionFolder.open()

const rotationFolder = cubeFolder.addFolder('Rotation')
rotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
rotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
rotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
rotationFolder.open()

const scaleFolder = cubeFolder.addFolder('Scale')
scaleFolder.add(cube.scale, 'x', -5, 5)
scaleFolder.add(cube.scale, 'y', -5, 5)
scaleFolder.add(cube.scale, 'z', -5, 5)
scaleFolder.open()

// Delta Time
const clock = new THREE.Clock()
let delta

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  delta = clock.getDelta()

  cube.rotation.x += 0.3 * delta
  cube.rotation.y += 0.3 * delta

  stats.update()
  
  renderer.render(scene, camera)
}



animate()