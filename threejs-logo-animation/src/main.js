import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Basic scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');

// Simple camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 50;

// Basic renderer
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Simple lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Create a fallback cube in case SVG doesn't load
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);

// Load SVG
console.log('Attempting to load SVG...');
const loader = new SVGLoader();
loader.load(
    './assets/Cline_Logo_black.svg', // Try relative path
    function(data) {
        console.log('SVG loaded successfully!');
        scene.remove(cube); // Remove fallback cube
        
        const svgGroup = new THREE.Group();
        
        // Process SVG paths
        data.paths.forEach((path) => {
            const shapes = path.toShapes(true);
            
            shapes.forEach((shape) => {
                // Simple extrusion
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 2,
                    bevelEnabled: false
                });
                
                // Basic black material
                const material = new THREE.MeshBasicMaterial({ 
                    color: 0x000000,
                    side: THREE.DoubleSide
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                svgGroup.add(mesh);
            });
        });
        
        // Center the logo
        const box = new THREE.Box3().setFromObject(svgGroup);
        const center = box.getCenter(new THREE.Vector3());
        svgGroup.position.x = -center.x;
        svgGroup.position.y = -center.y;
        
        // Scale to fit view
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y);
        const scale = 30 / maxDim;
        svgGroup.scale.multiplyScalar(scale);
        
        // Flip to correct orientation
        svgGroup.rotation.x = Math.PI;
        
        scene.add(svgGroup);
    },
    undefined,
    function(error) {
        console.error('Error loading SVG:', error);
        // Try alternative path if first one fails
        loader.load(
            '/assets/Cline_Logo_black.svg',
            function(data) {
                console.log('SVG loaded with alternate path!');
                // Same processing code as above
                scene.remove(cube);
                
                const svgGroup = new THREE.Group();
                
                data.paths.forEach((path) => {
                    const shapes = path.toShapes(true);
                    
                    shapes.forEach((shape) => {
                        const geometry = new THREE.ExtrudeGeometry(shape, {
                            depth: 2,
                            bevelEnabled: false
                        });
                        
                        const material = new THREE.MeshBasicMaterial({ 
                            color: 0x000000,
                            side: THREE.DoubleSide
                        });
                        
                        const mesh = new THREE.Mesh(geometry, material);
                        svgGroup.add(mesh);
                    });
                });
                
                const box = new THREE.Box3().setFromObject(svgGroup);
                const center = box.getCenter(new THREE.Vector3());
                svgGroup.position.x = -center.x;
                svgGroup.position.y = -center.y;
                
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y);
                const scale = 30 / maxDim;
                svgGroup.scale.multiplyScalar(scale);
                
                svgGroup.rotation.x = Math.PI;
                
                scene.add(svgGroup);
            },
            undefined,
            function(error) {
                console.error('Both SVG load attempts failed:', error);
            }
        );
    }
);

// Simple animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate cube if it's still in the scene
    if (scene.children.includes(cube)) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
}

animate(); 