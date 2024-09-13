import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// Scene
const scene = new THREE.Scene()

// Environment Texture (Map ~same thing)
// Find Free C.U. HDRs Here: https://polyhaven.com/
// and see how to implement it in 8:30 here: https://tubitak.udemy.com/course/threejs-tutorials/learn/lecture/43195168#overview

const hdr = 'imgs/venice_sunset_1k.hdr'
const image = 'imgs/grid.png'
const model = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Soldier.glb'

new RGBELoader().load(hdr, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture
  scene.backgroundBlurriness = 1.0
})

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(2, 1, -2)

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

// Render Once Before loading assets, why not
renderer.render(scene, camera)

// Geometry
//

// Material
//


// Objects
// Get cars and models here: https://kenney.nl/assets/car-kit
let suvModel: THREE.Object3D
const suvBodyModel = 'models/suv_body.glb'
const suvWheelModel = 'models/suv_wheel.glb'

/*
const loader = new GLTFLoader()
loader.load(suvBodyModel, (gltf) => {
  suvModel = gltf.scene

  loader.load(suvWheelModel, (gltf) => {
    const wheels = [gltf.scene, gltf.scene.clone(), gltf.scene.clone(), gltf.scene.clone()]

    wheels[0].position.set(-0.65, 0.2, -0.77)
    wheels[1].position.set(0.65, 0.2, -0.77)
    wheels[1].rotateY(Math.PI)
    wheels[2].position.set(-0.65, 0.2, 0.57)
    wheels[3].position.set(0.65, 0.2, 0.57)
    wheels[3].rotateY(Math.PI)

    suvModel.add(...wheels)
  })

  scene.add(suvModel)
})
  */

// ORRRRRR
// YOU CAN LOADASYNC
// WHICH FREEZESA LL THINGS even render UNTIL LOADING IS DONE
/*
const loader = new GLTFLoader()
let suvBody: THREE.Object3D
await loader.loadAsync('models/suv_body.glb').then((gltf) => {
  suvBody = gltf.scene
})
loader.load('models/suv_wheel.glb', function (gltf) {
  const wheels = [gltf.scene, gltf.scene.clone(), gltf.scene.clone(), gltf.scene.clone()]
  wheels[0].position.set(-0.65, 0.2, -0.77)
  wheels[1].position.set(0.65, 0.2, -0.77)
  wheels[1].rotateY(Math.PI)
  wheels[2].position.set(-0.65, 0.2, 0.57)
  wheels[3].position.set(0.65, 0.2, 0.57)
  wheels[3].rotateY(Math.PI)
  suvBody.add(...wheels)
  scene.add(suvBody)
})
  */

// ORRR YOU CAN
// USE PROMISES
async function loadCar() {
  const loader = new GLTFLoader()
  
  const [...model] = await Promise.all(
    [
      loader.loadAsync(suvBodyModel), 
      loader.loadAsync(suvWheelModel)
    ]
  )

  suvModel = model[0].scene
  const wheels = [model[1].scene, model[1].scene.clone(), model[1].scene.clone(), model[1].scene.clone()]

  wheels[0].position.set(-0.65, 0.2, -0.77)
  wheels[1].position.set(0.65, 0.2, -0.77)
  wheels[1].rotateY(Math.PI)
  wheels[2].position.set(-0.65, 0.2, 0.57)
  wheels[3].position.set(0.65, 0.2, 0.57)
  wheels[3].rotateY(Math.PI)
  suvModel.add(...wheels)
  
  scene.add(suvModel)

  console.log("içerdema")
}

console.log("önce")
await loadCar()
console.log("sonra")


// Lights
//

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.y = 0.75
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
