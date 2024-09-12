import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// import hdr from './img/venice_sunset_1k.hdr'
// import image from './img/grid.png'
// import model from './models/suzanne_no_material.glb'

// Scene
const scene = new THREE.Scene()

// Environment Texture (Map ~same thing)
// Find Free C.U. HDRs Here: https://polyhaven.com/
// and see how to implement it in 8:30 here: https://tubitak.udemy.com/course/threejs-tutorials/learn/lecture/43195168#overview

const hdr = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/venice_sunset_1k.hdr'
const image = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/uv_grid_opengl.jpg'
const model = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Xbot.glb'

// const hdr = 'https://sbcode.net/img/venice_sunset_1k.hdr'
// const image = 'https://sbcode.net/img/grid.png'
// const model = 'https://sbcode.net/models/suzanne_no_material.glb'

// const hdr = 'img/venice_sunset_1k.hdr'
// const image = 'img/grid.png'
// const model = 'models/suzanne_no_material.glb'

new RGBELoader().load(hdr, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture
})

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-2, 0.5, 2)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Geometry
//

// Material
const material = new THREE.MeshStandardMaterial()
material.map = new THREE.TextureLoader().load(image)
//material.map.colorSpace = THREE.SRGBColorSpace


// Objects
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
plane.rotation.x = -Math.PI / 2
plane.position.y = -1
scene.add(plane)

new GLTFLoader().load(model, (gltf) => {
  gltf.scene.traverse((child) => {
    ;(child as THREE.Mesh).material = material
  })
  scene.add(gltf.scene)
})

// Lights
//

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
//

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  stats.update()
  
  renderer.render(scene, camera)
}


animate()
