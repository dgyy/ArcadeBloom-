import { NoiseMaterial } from "./NoiseMaterial.js";

export class Test extends THREE.Mesh{
    constructor( scene ){
        const geometry = new THREE.SphereGeometry();
        const material = new NoiseMaterial('wood',  { roughness: 0.3 });
        super( geometry, material );
        scene.add( this );
    }
}