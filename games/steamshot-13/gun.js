import { App } from './index.js';

class HelixCurve extends THREE.Curve{
    constructor( radius, height, startAngle, endAngle ){
        super();

        this.radius = radius;
        this.height = height;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    getPoint( t ){
        const theta = (this.endAngle-this.startAngle) * t + this.startAngle;

        return new THREE.Vector3( Math.cos(theta)*this.radius, this.height*t, Math.sin(theta)*this.radius )
    }
}

export class Gun extends THREE.Group{
    constructor(){
        super();

        this.createBarrel();
        this.createBody();
        this.createHandle();
    }

    createBarrel(){
        const geo1 = new THREE.CylinderGeometry( 0.01, 0.01, 0.21, 20 );
        const barrel = new THREE.Mesh( geo1, App.metalMat ); 
        barrel.rotation.x = -Math.PI/2;
        barrel.position.z = -0.07;

        this.add( barrel );

        const path = new THREE.Path();
        const radius = 0.007;
        const length = 0.015;

        path.absarc( 0, - length / 2, radius, Math.PI * 1.5, 0 );
		path.lineTo( radius, 0 );
        path.lineTo( 0, 0 );
		//path.absarc( 0, length, radius, 0, Math.PI * 0.5 );

		const geo2 = new THREE.LatheGeometry( path.getPoints( 8 ), 12 );
        const end = new THREE.Mesh( geo2, App.brassMat );
        end.rotateX( -Math.PI/2 );
        end.position.z = 0.035;
        this.add( end );

        const helixCurve = new HelixCurve( 0.012, 0.06, 0, Math.PI * 12 );
        const geo3 = new THREE.TubeGeometry( helixCurve, 50, 0.005 );
        const helix = new THREE.Mesh( geo3, App.brassMat );
        helix.rotateX( Math.PI/2 );
        helix.position.set( 0, 0, -0.16 );
        this.add( helix );

    }

    createBody(){
        const geo2 = new THREE.CylinderGeometry( 0.025, 0.025, 0.06, 20 );
        const body = new THREE.Mesh( geo2, App.darkMetalMat ); 
        body.rotation.x = -Math.PI/2;
        body.position.set( 0, -0.015, -0.042 );

        let xArr = [ 1, 3.6, 3.9, 3.9, 2, 0.7, 0.7, 1, 1.8, 2, 1.8, 2, 2.4, 2.3, 3.3, 3.3, 0, 0, 0.4, 0.4, 1 ];
        let yArr = [ 0, 0, -0.3, 0.3, 0.3, 0.7, 1.7, 2, 2, 1.5, 0.7, 0.6, 1.4, 2, 2, 2.3, 2.3, 2, 1.7, 0.5, 0 ];

        const shape = new THREE.Shape();
        const scale = 0.015

        for(let i=0; i<xArr.length; i++){
            if ( i==0 ){
                shape.moveTo( xArr[i] * scale, yArr[i] * scale );
            }else{
                shape.lineTo( xArr[i] * scale, yArr[i] * scale );
            }
        }

        const geometry = new THREE.ExtrudeGeometry( shape, { depth: 0.005, bevelEnabled: false } );
        geometry.rotateY( -Math.PI/2 );
        const trigger = new THREE.Mesh( geometry, App.metalMat ); 
        trigger.position.set( 0, -0.07, -0.065 );
        this.add( trigger );

        this.add( body );
    }

    createHandle(){

        let xArr = [ 0.5, 5, 5, 4.5, 4.2, 3.3, 3, 0, 0, 0.3, 1, 0.7, 0.5, 0.5 ];
        let yArr = [ 0, 0, 0.3, 0.3, 0.6, 5.7, 6, 6, 4, 3.7, 0.7, 0.5, 0.3, 0 ];

        const shape = new THREE.Shape();
        const scale = 0.015

        for(let i=0; i<xArr.length; i++){
            if ( i==0 ){
                shape.moveTo( xArr[i] * scale, yArr[i] * scale );
            }else{
                shape.lineTo( xArr[i] * scale, yArr[i] * scale );
            }
        }

        const geometry = new THREE.ExtrudeGeometry( shape, { depth: 0.02, bevelEnabled: false } );
        geometry.rotateY( -Math.PI/2 );
        geometry.translate( 0.01, -0.095, -0.02 );
        const handle = new THREE.Mesh( geometry, App.metalMat ); 

        this.add( handle );

        const inset = 0.3;
       // xArr = [ 1.3, 3.7, 4, 3, 2.7, 0.5, 1, 1.3 ];
       // yArr = [ 0.5, 0.5, 0.8, 5.3, 3.7, 5.7, 0.7, 0.5 ];
        xArr = [ 1.3+inset, 3.7-inset, 4-inset, 3-inset, 2.7-inset, 0.5+inset, 1+inset, 1.3+inset ];
        yArr = [ 0.5+inset, 0.5+inset, 0.8+inset, 5.3-inset, 5.7-inset, 5.7-inset, 0.7+inset, 0.5+inset ];

        const shapeb = new THREE.Shape();
        
        for(let i=0; i<xArr.length; i++){
            if ( i==0 ){
                shapeb.moveTo( xArr[i] * scale, yArr[i] * scale );
            }else{
                shapeb.lineTo( xArr[i] * scale , yArr[i] * scale );
            }
        }

        const geometry2 = new THREE.ExtrudeGeometry( shapeb, { 
            depth: 0.022, 
            bevelEnabled: true, 
            bevelSegments: 1,
            bevelThickness: inset * scale,
            bevelSize: inset * scale
         } );
        //geometry2.rotateY( -Math.PI/2 );
        geometry2.rotateX( Math.PI/2 )
        //geometry2.translate( 0.01, -0.09, -0.02 );
        const wood = new THREE.Mesh( geometry2, App.darkWoodMat ); 
        wood.rotateX( -Math.PI/2 );
        wood.rotateZ( -Math.PI/2 );
        wood.position.set( 0.01, -0.095, -0.019 );

        this.add( wood );
    }

    createProxy(){
        //const mat = new THREE.MeshStandardMaterial( { color: 0xAAAA22 } );
        const geo1 = new THREE.CylinderGeometry( 0.01, 0.01, 0.15, 20 );
        const barrel = new THREE.Mesh( geo1, App.metalMat ); 
        barrel.rotation.x = -Math.PI/2;
        barrel.position.z = -0.1;

        const geo2 = new THREE.CylinderGeometry( 0.025, 0.025, 0.06, 20 );
        const body = new THREE.Mesh( geo2, App.darkMetalMat ); 
        body.rotation.x = -Math.PI/2;
        body.position.set( 0, -0.015, -0.042 );

        const geo3 = new THREE.BoxGeometry( 0.02, 0.08, 0.04 );
        const handle = new THREE.Mesh( geo3, App.oakMat ); 
        handle.position.set( 0, -0.034, 0);

        this.add( barrel );
        this.add( body );
        this.add( handle );
    }
}