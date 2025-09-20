export class Proxy{
    constructor( scene ){
        this.scene = scene;

        const geo1 = new THREE.CylinderGeometry( 0.25, 0.25, 3 );
        const mat1 = new THREE.MeshStandardMaterial( { color: 0x999999 } );
        const mat2 = new THREE.MeshStandardMaterial( { color: 0x444444, side: THREE.BackSide, wireframe: false } );

        const column = new THREE.Mesh( geo1, mat1 );
        
        for ( let x = -6; x<=6; x+=2 ){
            const columnA = column.clone();
            columnA.position.set( x, 1.5, -20);
            scene.add( columnA );
        }

        const geo2 = new THREE.PlaneGeometry( 15, 25 );
        geo2.rotateX( -Math.PI/2 );
        const floor = new THREE.Mesh( geo2, mat1 );
        floor.position.set( 0, 0, -12.5 );
        //scene.add( floor );

        const geo3 = new THREE.BoxGeometry( 15, 5, 0.6 );
        const lintel = new THREE.Mesh( geo3, mat1 );
        lintel.position.set( 0, 5.5, -20 );
        scene.add( lintel );

        const geo4 = new THREE.BoxGeometry( 15, 5.3, 36 );
        const room = new THREE.Mesh( geo4, mat2 );
        room.position.set( 0, 2.65, -10 );
        //scene.add( room );
    }
}