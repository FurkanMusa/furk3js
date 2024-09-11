import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

// Scene
const scene = new THREE.Scene()
scene.environment = new THREE.CubeTextureLoader()
.setPath('https://sbcode.net/img/')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

// Axes Helper
scene.add(new THREE.AxesHelper(5))

// Grid Helper
const gridHelper = new THREE.GridHelper()
gridHelper.position.y = -1
scene.add(gridHelper)

// Skybox
// scene.background = new THREE.CubeTextureLoader()
// .setPath('https://sbcode.net/img/')
// .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
// scene.backgroundBlurriness = 0.1

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 7)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Geometry
const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry()
const planeGeometry = new THREE.PlaneGeometry()
const torusKnotGeometry = new THREE.TorusKnotGeometry()

// Material
const material = new THREE.MeshNormalMaterial()

// Objects
const cube = new THREE.Mesh(boxGeometry, material)
cube.position.set(5, 0, 0)
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.set(3, 0, 0)
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
icosahedron.position.set(0, 0, 0)
scene.add(icosahedron)

const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(-2, 0, 0)
scene.add(plane)

const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.set(-5, 0, 0)
scene.add(torusKnot)

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI

const gui = new GUI()

const options = {
  side: {
    FrontSide: THREE.FrontSide,
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide,
  },
}

const materialFolder = gui.addFolder('THREE.Material')
materialFolder.add(material, 'transparent').onChange(() => (material.needsUpdate = true))
materialFolder.add(material, 'opacity', 0, 1, 0.01)
materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())
materialFolder.add(material, 'visible')
materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
materialFolder.open()

function updateMaterial() {
  material.side = Number(material.side) as THREE.Side
  material.needsUpdate = true
}

// Delta Time
const clock = new THREE.Clock()
let delta

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  delta = clock.getDelta()

  // cube.rotation.x += 0.3 * delta
  // cube.rotation.y += 0.3 * delta

  controls.update()
  stats.update()
  gui.updateDisplay()
  
  renderer.render(scene, camera)
}


animate()

// FROM HERE:
// https://sbcode.net/threejs/three-object3d/
// https://tubitak.udemy.com/course/threejs-tutorials/learn/lecture/43195122#overview
