import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {perlin} from './perlin.js'

window.THREE = THREE
window.perlin = perlin

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth - 10, window.innerHeight - 10 )
document.body.appendChild( renderer.domElement )

let scene

function createWorld(SIZE = 50, HARDNESS = 10, OCEAN_HEIGHT = 8) {
	perlin.seed()
	scene = new THREE.Scene()

	for (let z = 0; z < SIZE; z++) {
		for (let x = 0; x < SIZE; x++) {
			const height = 10 + perlin.get(1 / SIZE * x,1 / SIZE * z ) * HARDNESS
			const randomColor = 55 + Math.round(perlin.get(1 / SIZE * x,1 / SIZE * z ) * 200)

			let r = '00'
			let g = randomColor.toString(16).padStart(2, '0')
			let b = '00'

			if (height < OCEAN_HEIGHT) {
				r = '00'
				g = '00'
				b = (randomColor + 70).toString(16).padStart(2, '0')
			}

			let color = Number(`0x${r}${g}${b}`)
			const geometry = new THREE.BoxGeometry( 1, height, 1 )

			// const material = new THREE.MeshBasicMaterial( { color: Math.floor(Math.random() * 0xffffff) } )
			const material = new THREE.MeshBasicMaterial( { color } )

			const cube = new THREE.Mesh( geometry, material )
			cube.position.x = SIZE / 2 - x
			cube.position.y = height / 2
			cube.position.z = SIZE / 2 - z
			scene.add( cube )
		}
	}
}

window.createWorld = createWorld
createWorld()

document.querySelector('#create').onclick = () => {
	const a = document.querySelector('#size').value
	const b = document.querySelector('#hardness').value
	const c = document.querySelector('#ocean-height').value
	createWorld(a, b, c)
}

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 13, 9, 15 );
controls.update();

camera.position.x = 34
camera.position.y = 36
camera.position.z = 44


window.camera = camera

function animate() {
	requestAnimationFrame( animate )
	controls.update();
	renderer.render( scene, camera )
}
animate()
window.animate = animate
