export function addParticles(){



const count =300;
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
const particlesGeometry = new THREE.BufferGeometry()

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 100
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 1
particlesMaterial.sizeAttenuation = true

particlesMaterial.color = new THREE.Color('#ff88cc')

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.blending = THREE.AdditiveBlending

particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.set(0,50,0);
particles.name = 'star';
scene.add(particles);

}
