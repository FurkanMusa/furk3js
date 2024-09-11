import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

// Scene
const scene = new THREE.Scene()
scene.environment = new THREE.CubeTextureLoader()
.setPath('https://sbcode.net/img/')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

// Axes Helper
// scene.add(new THREE.AxesHelper(5))

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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-1, 4, 2.5)

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
const geometry = new THREE.IcosahedronGeometry(1, 1)


// Material
// const material = new THREE.MeshStandardMaterial()
const material = new THREE.MeshNormalMaterial()

// Objects
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: 0x111111 }))
plane.rotation.x = -Math.PI / 2
plane.visible = true
scene.add(plane)

const data = { color: 0x00ff00, labelsVisible: true }

const meshes = [
  new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: data.color })),
  new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({ flatShading: true })),
  new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: data.color, flatShading: true })),
  new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: data.color, flatShading: true })),
]

meshes[0].position.set(-3, 1, 0)
meshes[1].position.set(-1, 1, 0)
meshes[2].position.set(1, 1, 0)
meshes[3].position.set(3, 1, 0)

scene.add(...meshes)

// Lights
const light = new THREE.DirectionalLight(undefined, Math.PI)
light.position.set(1, 1, 1)
scene.add(light)

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
const gui = new GUI()

const meshBasicMaterialFolder = gui.addFolder('MeshBasicMaterial')
meshBasicMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[0].material as THREE.MeshBasicMaterial).color.set(data.color)
})
meshBasicMaterialFolder.add(meshes[0].material, 'wireframe')

const meshNormalMaterialFolder = gui.addFolder('MeshNormalMaterial')
meshNormalMaterialFolder.add(meshes[1].material as THREE.MeshNormalMaterial, 'flatShading').onChange(() => {
  meshes[1].material.needsUpdate = true
})
meshNormalMaterialFolder.add(meshes[1].material, 'wireframe')

const meshPhongMaterialFolder = gui.addFolder('MeshPhongMaterial')
meshPhongMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[2].material as THREE.MeshPhongMaterial).color.set(data.color)
})
meshPhongMaterialFolder.add(meshes[2].material as THREE.MeshPhongMaterial, 'flatShading').onChange(() => {
  meshes[2].material.needsUpdate = true
})
meshPhongMaterialFolder.add(meshes[2].material, 'wireframe')

const meshStandardMaterialFolder = gui.addFolder('MeshStandardMaterial')
meshStandardMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[3].material as THREE.MeshStandardMaterial).color.set(data.color)
})
meshStandardMaterialFolder.add(meshes[3].material as THREE.MeshStandardMaterial, 'flatShading').onChange(() => {
  meshes[3].material.needsUpdate = true
})
meshStandardMaterialFolder.add(meshes[3].material, 'wireframe')

const lightFolder = gui.addFolder('Light')
lightFolder.add(light, 'visible')

const gridFolder = gui.addFolder('Grid')
gridFolder.add(gridHelper, 'visible')

const labelsFolder = gui.addFolder('Labels')
labelsFolder.add(data, 'labelsVisible')

const labels = document.querySelectorAll<HTMLDivElement>('.label')

let x, y
const v = new THREE.Vector3()

// Delta Time
// const clock = new THREE.Clock()
// let delta

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  controls.update()

  //delta = clock.getDelta()

  // cube.rotation.x += 0.3 * delta
  // cube.rotation.y += 0.3 * delta

  for (let i = 0; i < 4; i++) {
    v.copy(meshes[i].position)
    v.project(camera)

    x = ((1 + v.x) / 2) * innerWidth - 50
    y = ((1 - v.y) / 2) * innerHeight

    labels[i].style.left = x + 'px'
    labels[i].style.top = y + 'px'
    labels[i].style.display = data.labelsVisible ? 'block' : 'none'
  }
  
  stats.update()
  
  renderer.render(scene, camera)
}


animate()
