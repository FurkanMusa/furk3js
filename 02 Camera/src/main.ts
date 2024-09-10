import './style.css'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

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
const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, -5, 10)
camera.position.set(1, 1, 1)
camera.lookAt(0, 0.5, 0)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Window Resize listener for Aspect Ratio Calculation
window.addEventListener('resize', () => {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
scene.add(cube)

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
const gui = new GUI()
gui.close()

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -10, 10)
cameraFolder.add(camera.position, 'y', -10, 10)
cameraFolder.add(camera.position, 'z', -10, 10)
cameraFolder.add(camera, 'left', -10, 0).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'right', 0, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'top', 0, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'bottom', -10, 0).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'near', -5, 5).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'far', 0, 10).onChange(() => {
  camera.updateProjectionMatrix()
})
cameraFolder.open()

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  camera.lookAt(0, 0.5, 0)

  stats.update()
  gui.updateDisplay()
  
  renderer.render(scene, camera)
}



animate()