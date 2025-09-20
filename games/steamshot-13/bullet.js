import { Ball } from "./ball.js";

export class Bullet extends THREE.Group{
    constructor( game, controller ){
        super();

        const geo1 = new THREE.CylinderGeometry( 0.008, 0.008, 0.07, 16 );
        geo1.rotateX( -Math.PI/2 );
        const material = new THREE.MeshBasicMaterial( { color: 0xFFAA00  });
        const mesh = new THREE.Mesh( geo1, material );

        const geo2 = new THREE.CylinderGeometry( 0.008, 0.008, 0.7, 16 );
        geo2.rotateX( -Math.PI/2 );
        const material2 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, opacity: 0.6, transparent: true  });
        const mesh2 = new THREE.Mesh( geo2, material2 );

        this.add(mesh);
        this.add(mesh2);

        const v = new THREE.Vector3();
        const q = new THREE.Quaternion();

        this.position.copy( controller.getWorldPosition( v ) );
        this.quaternion.copy( controller.getWorldQuaternion( q ) );

        game.scene.add( this );

        this.tmpVec = v;
        this.tmpVec2 = new THREE.Vector3();
        
        this.game = game;
    }

    update( dt ){
        let dist = dt * 25;
        let count = 0;

        while(count<1000){

            count++;
            if (dist > 0.5){
                dist -= 0.5;
                this.translateZ( -0.5 );
            }else{
                this.translateZ( -dist );
                dist = 0;
            }

            this.getWorldPosition( this.tmpVec );

            let hit = false;

            this.game.balls.forEach( ball => {
                if (!hit){
                    if (ball.state == Ball.states.FIRED ){
                        ball.mesh.getWorldPosition( this.tmpVec2 );
                        const offset = this.tmpVec.distanceTo( this.tmpVec2 );
                        if ( offset < 0.5 ){
                            hit = true;
                            ball.hit(this.game );
                            this.game.removeBullet( this );
                        }
                    }
                }
            });

            if (dist==0 || hit) break;
        }

        if ( this.position.length() > 20 ) this.game.removeBullet();
    }
}