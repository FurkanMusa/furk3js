import './style.css'
import {
  Mesh,
  Color,
  MeshStandardMaterial,
  BufferGeometry,
  Raycaster,
  Scene,
  SpotLight,
  PerspectiveCamera,
  WebGLRenderer,
  VSMShadowMap,
  BoxGeometry,
  CylinderGeometry,
  TetrahedronGeometry,
  PlaneGeometry,
  Vector2,
  Clock,
  EquirectangularReflectionMapping,
  MeshPhongMaterial,
  Vector3,
  MathUtils,
  Object3D,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'

// Scene
const scene = new Scene()

// Environment Texture (Map ~same thing)
// Find Free C.U. HDRs Here: https://polyhaven.com/
// and see how to implement it in 8:30 here: https://tubitak.udemy.com/course/threejs-tutorials/learn/lecture/43195168#overview

await new RGBELoader().loadAsync('img/autumn_field_puresky_1k.hdr').then((texture) => {
  texture.mapping = EquirectangularReflectionMapping
  scene.environment = texture
})

// Camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2, 4)

// Renderer
const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = VSMShadowMap
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

// Custom Lerp Function
function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}

// Custom Object Pickable
class Pickable extends Mesh {
  hovered = false
  clicked = false
  colorTo: Color
  defaultColor: Color
  geometry: BufferGeometry
  material: MeshStandardMaterial
  v = new Vector3()

  constructor(geometry: BufferGeometry, material: MeshStandardMaterial, colorTo: Color) {
    super()
    this.geometry = geometry
    this.material = material
    this.colorTo = colorTo
    this.defaultColor = material.color.clone()
    this.castShadow = true
  }

  update(delta: number) {
    // this.rotation.x += delta / 10
    this.rotation.y += delta / 6

    this.clicked ? (this.position.y = MathUtils.lerp(this.position.y, 1, delta * 5)) : (this.position.y = MathUtils.lerp(this.position.y, 0, delta * 5))

    //console.log(this.position.y)

    // this.clicked
    //   ? (this.position.y = lerp(this.position.y, 1, delta * 5))
    //   : (this.position.y = lerp(this.position.y, 0, delta * 5))

    // this.hovered
    //   ? this.material.color.lerp(this.colorTo, delta * 10)
    //   : this.material.color.lerp(this.defaultColor, delta * 10)

    this.hovered
      ? (this.material.color.lerp(this.colorTo, delta * 10),
        (this.material.roughness = lerp(this.material.roughness, 0, delta * 10)),
        (this.material.metalness = lerp(this.material.metalness, 1, delta * 10))
        )
      : (this.material.color.lerp(this.defaultColor, delta),
        (this.material.roughness = lerp(this.material.roughness, 1, delta)),
        (this.material.metalness = lerp(this.material.metalness, 0, delta)))

    // this.clicked
    //   ? this.scale.set(
    //       MathUtils.lerp(this.scale.x, 1.5, delta * 5),
    //       MathUtils.lerp(this.scale.y, 1.5, delta * 5),
    //       MathUtils.lerp(this.scale.z, 1.5, delta * 5)
    //     )
    //   : this.scale.set(
    //       MathUtils.lerp(this.scale.x, 1.0, delta),
    //       MathUtils.lerp(this.scale.y, 1.0, delta),
    //       MathUtils.lerp(this.scale.z, 1.0, delta)
    //     )

    this.clicked
      ? this.scale.set(
          lerp(this.scale.x, 1.5, delta * 5),
          lerp(this.scale.y, 1.5, delta * 5),
          lerp(this.scale.z, 1.5, delta * 5)
        )
      : this.scale.set(
          lerp(this.scale.x, 1.0, delta),
          lerp(this.scale.y, 1.0, delta),
          lerp(this.scale.z, 1.0, delta)
        )

    // this.clicked ? this.v.set(1.5, 1.5, 1.5) : this.v.set(1.0, 1.0, 1.0)
    // this.scale.lerp(this.v, delta * 5)
  }
}

const raycaster = new Raycaster()
const pickables: Pickable[] = [] // used in the raycaster intersects methods
const fish: any[] = []
let intersectsPickables
let intersectsFish
const mouse = new Vector2()

// Some stuff idk
renderer.domElement.addEventListener('pointerdown', (e) => {
  mouse.set((e.clientX / renderer.domElement.clientWidth) * 2 - 1, -(e.clientY / renderer.domElement.clientHeight) * 2 + 1)

  raycaster.setFromCamera(mouse, camera)

  intersectsPickables = raycaster.intersectObjects(pickables, false)

  // toggles `clicked` property for only the Pickable closest to the camera
  intersectsPickables.length && ((intersectsPickables[0].object as Pickable).clicked = !(intersectsPickables[0].object as Pickable).clicked)

  // toggles `clicked` property for all overlapping Pickables detected by the raycaster at the same time
  // intersectsPickables.forEach((i) => {
  //   ;(i.object as Pickable).clicked = !(i.object as Pickable).clicked
  // })

  // Fishy Stuff



})

// Mousedan raycasting yapıp hover mı değil mi bakıyor
renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
  )

  raycaster.setFromCamera(mouse, camera)

  intersectsPickables = raycaster.intersectObjects(pickables, false)

  pickables.forEach((p) => (p.hovered = false))

  intersectsPickables.length && ((intersectsPickables[0].object as Pickable).hovered = true)
})

// Objects
let fishModel: Object3D
const fishSkinModel = 'models/fish.glb'
const fishBoneModel = 'models/fish-bones.glb'

const loader = new GLTFLoader()
loader.load(fishSkinModel, (gltf) => {
  fishModel = gltf.scene

  // fishModel.traverse((node) => {
  //   if (node.isMesh && node.material) {
  //     node.material.transparent = true; // Saydamlık etkinleştir
  //     node.material.opacity = 0.5; // Saydamlık seviyesi ayarla
  //   }
  // });

  fishModel.scale.x *= 8
  fishModel.scale.y *= 8
  fishModel.scale.z *= 8

  // loader.load(fishBoneModel, (gltf) => {
    
  //   let bone = gltf.scene
  //   bone.scale.x *= 0.6
  //   bone.scale.y *= 0.3
  //   bone.scale.z *= 0.85
  //   bone.rotateZ(3*Math.PI/2)
  //   bone.position.x = -0.014
  //   bone.position.y = 0.12
  //   bone.position.z = 0.024
  //   bone.castShadow = true

  //   fishModel.add(gltf.scene)
  // })

  console.log( "fish: " + fishModel.id )
  fishModel.castShadow = true
  fish.push(fishModel)
  scene.add(fishModel)
})

loader.load(fishBoneModel, (gltf) => {
    
  let bone = gltf.scene
  bone.scale.x *= 5
  bone.scale.y *= 3
  bone.scale.z *= 7
  bone.rotateZ(3*Math.PI/2)
  bone.position.x = -0.14
  bone.position.y = 0.9
  bone.position.z = 0
  bone.castShadow = true

  scene.add(gltf.scene)
})





// const cylinder = new Pickable(
//   new CylinderGeometry(0.66, 0.66),
//   new MeshStandardMaterial({ color: 0x888888 }),
//   new Color(0x008800)
// )
// scene.add(cylinder)
// pickables.push(cylinder)

const cube = new Pickable(
  new BoxGeometry(),
  new MeshStandardMaterial({ color: 0x888888 }),
  new Color(0xff2200)
)
cube.position.set(-2, 0, 0)
scene.add(cube)
pickables.push(cube)

// const pyramid = new Pickable(
//   new TetrahedronGeometry(),
//   new MeshStandardMaterial({ color: 0x888888 }),
//   new Color(0x0088ff)
// )
// pyramid.position.set(2, 0, 0)
// scene.add(pyramid)
// pickables.push(pyramid)

// Objects - Floor
const floor = new Mesh(new PlaneGeometry(20, 20), new MeshPhongMaterial())
floor.rotateX(-Math.PI / 2)
floor.position.y = -1.25
floor.receiveShadow = true
//floor.material.envMapIntensity = 0
scene.add(floor)


// Lights
const spotLight = new SpotLight(0xffffff, 500)
spotLight.position.set(5, 5, 5)
spotLight.angle = 0.3
spotLight.penumbra = 0.5
spotLight.castShadow = true
spotLight.shadow.radius = 20
spotLight.shadow.blurSamples = 20
spotLight.shadow.camera.far = 20
scene.add(spotLight)

// Lens Flare
//

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 + Math.PI / 16 // ~ 100 degrees

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
//

// Delta Time
const clock = new Clock()
let delta = 0

// ~ A N I M A T E ~ //
function animate() {
  requestAnimationFrame(animate)

  delta = clock.getDelta()

  pickables.forEach((p) => {
    p.update(delta)
  })

  controls.update()
  stats.update()
  
  renderer.render(scene, camera)
}


animate()
