import { App } from './index.js';

class RoundedRectCurve extends THREE.Curve{
    constructor(width = 50, height = 50, radius = 10){
      super();
      this.width = width;
      this.height = height;
      this.radius = radius;
    }
    
    getPoint(t){
      const pt = new THREE.Vector3();
      let theta;
      if (t<0.125){
        //0-0.125 = top right corner
        t *= 2;
        const theta = 2 * Math.PI * t;
        pt.x = Math.cos( theta ) * this.radius + this.width * 0.5;
          pt.y = Math.sin( theta ) * this.radius + this.height * 0.5;
      }else if (t<0.25){
        //0.125-0.25 = top
        t = (t-0.125) * 8;
        pt.x = this.width * 0.5 - t * this.width;
        pt.y = this.height * 0.5 + this.radius;
      }else if (t<0.375){
        //0.25=0.375 = top left corner
        t = (t-0.25) * 2 + 0.25;
        const theta = 2 * Math.PI * t;
        pt.x = Math.cos( theta ) * this.radius - this.width * 0.5;
          pt.y = Math.sin( theta ) * this.radius + this.height * 0.5;
      }else if (t<0.5){
        //0.375-0.5 = left
        t = (t-0.375) * 8;
        pt.x = -this.width * 0.5 - this.radius;
        pt.y = this.height * 0.5 - t * this.height;
      }else if (t<0.625){
        //0.5-0.625 = bottom left corner
        t = (t-0.5) * 2 + 0.5;
        const theta = 2 * Math.PI * t;
        pt.x = Math.cos( theta ) * this.radius - this.width * 0.5;
          pt.y = Math.sin( theta ) * this.radius - this.height * 0.5;
      }else if (t<0.75){
        //0.625-0.75 = bottom
        t = (t-0.625) * 8;
        pt.x = -this.width * 0.5 + this.width * t;
        pt.y = -this.height * 0.5 - this.radius;
      }else if (t<0.875){
        //0.75-0.875 = bottom right corner
        t = (t-0.75) * 2 + 0.75;
        const theta = 2 * Math.PI * t;
        pt.x = Math.cos( theta ) * this.radius + this.width * 0.5;
          pt.y = Math.sin( theta ) * this.radius - this.height * 0.5;
      }else{
        //0.875-1.0 = right
        t = (t-0.875) * 8;
        pt.x = this.width * 0.5 + this.radius;
        pt.y = -this.height * 0.5 + t * this.height;
      }
      
      return pt;
    }
  }

export class Ceiling extends THREE.Group{
    constructor( width = 14, depth = 25 ){
        super();

        const block = this.createBlock( width/2, 4 );

        for( let z=0; z>-depth; z-=4 ){
            const blk = block.clone();
            blk.position.z = z;
            this.add( blk );
        }
    }

    createBlock( halfwidth, depth ){
        const group = new THREE.Group();

        const shape = new THREE.Shape();
        shape.moveTo( -halfwidth, 0 );
        shape.lineTo( -halfwidth*0.7, 1.5 );
        shape.lineTo( -halfwidth*0.7, 2 );
        shape.lineTo( halfwidth*0.7, 2 );
        shape.lineTo( halfwidth*0.7, 1.5 );
        shape.lineTo( halfwidth, 0 );
        shape.lineTo( halfwidth, 3 );
        shape.lineTo( -halfwidth, 3 );
        shape.lineTo( -halfwidth, 0 );
        const geo1 = new THREE.ExtrudeGeometry( shape, { depth, bevelEnabled: false } );
        geo1.translate( 0, 0, depth/2 );
        const mesh1 = new THREE.Mesh( geo1, new THREE.MeshStandardMaterial( { color: 0x443311, side: THREE.DoubleSide }));
        group.add(mesh1);

        const geo2 = new THREE.SphereGeometry( 0.3 );
        const mesh2 = new THREE.Mesh( geo2, new THREE.MeshBasicMaterial() );
        group.add( mesh2 );

        const metalMat = App.metalMat;

        const geo3 = new THREE.SphereGeometry( 0.31, 32, 16, 0, Math.PI*2, 0, Math.PI/2 );
        const mesh3 = new THREE.Mesh( geo3, metalMat );
        group.add( mesh3 );

        const geo4 = new THREE.TubeGeometry( new RoundedRectCurve( halfwidth * 0.7, depth * 0.7, 0.25 ), 128, 0.05, 16, true );
        geo4.rotateX( Math.PI/2 );
        const mesh4 = new THREE.Mesh( geo4, metalMat );
        group.add(mesh4);

        const geo5 = new THREE.CylinderGeometry( 0.03, 0.03, 2.5, 12, 1, true );
        const mesh5 = new THREE.Mesh( geo5, metalMat );
        mesh5.position.y = 1.3;
        group.add(mesh5);

        const geo6 = new THREE.CylinderGeometry( 0.25, 0.25, depth, 20, 1, true );
        geo6.rotateX( Math.PI/2 );
        const mesh6 = new THREE.Mesh( geo6, metalMat );
        mesh6.position.x = -halfwidth * 0.6;
        group.add(mesh6);
        const mesh7 = mesh6.clone();
        mesh7.position.x = halfwidth * 0.6;
        group.add(mesh7);

        const geo8 = new THREE.CylinderGeometry( 0.3, 0.3, 0.05, 20, 1, false );
        geo8.rotateX( Math.PI/2 );
        const mesh8 = new THREE.Mesh( geo8, metalMat );
        mesh8.position.x = -halfwidth * 0.6;
        group.add(mesh8);
        const mesh9 = mesh8.clone();
        mesh9.position.x = halfwidth * 0.6;
        group.add(mesh9);

        const light = new THREE.PointLight( 0xFFFFFF, 10, 50 );
        group.add( light );

        return group;
    }
}