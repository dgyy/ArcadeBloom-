import { App } from './index.js';

class ElbowCurve extends THREE.Curve{
    constructor( radius ){
        super();

        this.radius = radius;
    }

    getPoint( t ){
        const theta = t * Math.PI/2;

        return new THREE.Vector3( Math.cos( theta ), Math.sin( theta ) ).multiplyScalar( this.radius );
    }
}

export class Ball{
    static states = { DROPPING: 1, ROTATE: 2, FIRED: 3, HIT: 4, PIC: 5 };
    static canvas = document.createElement('canvas');
    static geometry = new THREE.SphereGeometry( 0.5 );
    static support;
    
    constructor( scene, num, minus = false, xPos = -1, speed = 0.1, levelNum = 1 ){
        if (Ball.canvas.width != 256 ){
		    Ball.canvas.width = 256;
            Ball.canvas.height = 128;
        }

        if ( Ball.support == undefined ){
            const geo1 = new THREE.CylinderGeometry( 0.04, 0.04, 1.5, 10, 1, true );
            geo1.translate( 0, 0.7, 0 );
            Ball.support = new THREE.Mesh( geo1, App.darkMetalMat );
            Ball.support.rotateX( Math.PI/2 );
            Ball.support.castShadow = true;

            const geo2 = new THREE.TubeGeometry( new ElbowCurve( 0.04 ), 9, 0.04, 10, false );
            const elbow = new THREE.Mesh( geo2, App.metalMat );
            const geo3 = new THREE.CylinderGeometry( 0.04, 0.04, 0.9, 10, 1, true );
            geo3.translate( 0, 0.35, 0 );
            const upright = new THREE.Mesh( geo3, App.darkMetalMat );
            const geo4 = new THREE.CylinderGeometry( 0.04, 0.04, 0.4, 10, 1, true );
            geo4.rotateX( Math.PI/2 );
            geo4.translate( 0, 0, 0.2 );
            const horz = new THREE.Mesh( geo4, App.darkMetalMat );
            horz.position.set( 0, 0.84, 0.04);
            const elbow2 = elbow.clone();
            elbow.position.set( 0, 0.8, 0.04 );
            elbow.rotateY( Math.PI/2 );
            elbow2.position.set( 0, 0.88, 0.44 );
            elbow2.rotateY( Math.PI/2 );
            elbow2.rotateZ( Math.PI );
            const geo5 = new THREE.CylinderGeometry( 0.04, 0.04, 0.2, 10, 1, false );
            geo5.translate( 0, -0.1, 0 );
            const upright2 = new THREE.Mesh( geo5, App.darkMetalMat );
            upright2.position.set( 0, 1.08, 0.48 );

            Ball.support2 = new THREE.Group();
            Ball.support2.add( upright );
            Ball.support2.add( upright2 );
            Ball.support2.add( horz );
            Ball.support2.add( elbow );
            Ball.support2.add( elbow2 );
        }

        const context = Ball.canvas.getContext('2d');

        if (num == 13){
            context.fillStyle = "#000";
            this.color = 0x000000;
        }else if (minus){
            context.fillStyle = "#f00";
            this.color = 0xFF0000;
        }else{
            context.fillStyle = "#0f0";
            this.color = 0x00FF00;
        }

        this.num = num; 
        this.speed = speed * 60;
        this.time = 0;

        context.fillRect(0, 0, 256, 128);

        context.fillStyle = "#fff";
        context.font = "48px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(String(num), 128, 64 );

        if (minus) this.num *= -1;

        const tex = new THREE.CanvasTexture( Ball.canvas );

        const material = new THREE.MeshStandardMaterial( { map: tex, roughness: 0.1 } );

        this.mesh = new THREE.Mesh( Ball.geometry, material );
        this.mesh.castShadow = true;
        this.mesh.position.set( xPos, 4, -20.6 );
        this.mesh.rotateY( Math.PI/2 );

        this.levelNum = levelNum;
        this.tmpVec = new THREE.Vector3();

        if ( levelNum < 3 ){
            this.support = Ball.support.clone();
            this.support.position.z = -20.6;
        }else{
            this.support = Ball.support2.clone();
            this.support.position.z = -21.2;
        }
        this.support.position.x = xPos;
        
        scene.add( this.support );

        this.state = Ball.states.DROPPING;

        scene.add( this.mesh );

        this.scene = scene;
    }

    hit( game ){
        console.log( "Ball hit" );
        this.game = game;
        game.updateScore( this.num, true );
        game.SFX.hit();

        this.scene.remove( this.mesh );
        this.scene.remove( this.support );
        this.state = Ball.states.HIT;
        
        this.group = new THREE.Group();
        this.group.position.copy( this.mesh.position );
        this.scene.add( this.group );

        this.particles = [];

        for( let i=0; i<40; i++ ){
            const particle = new Particle( this );
            this.group.add( particle );
            this.particles.push( particle );
        }
    }

    removeParticle( particle ){
        const index = this.particles.indexOf( particle );
        if (index != -1){
            this.group.remove( particle );
            this.particles.splice( index, 1 );
            if (this.particles.length==0) this.game.removeBall( this );
        }
    }

    update(game, dt){
        switch(this.state){
            case Ball.states.DROPPING:
                this.mesh.position.y -= 0.1;
                if (this.mesh.position.y <= 1.6){
                    this.state = Ball.states.ROTATE;
                    this.mesh.position.y = 1.6;
                }
                this.support.rotation.x -= 0.1;
                if (this.support.rotation.x<0){
                    this.support.rotation.x = 0;
                }
                break;
            case Ball.states.ROTATE:
                this.mesh.rotateY( -0.1 );
                if (this.mesh.rotation.y < -Math.PI/2.1){
                    this.state = Ball.states.FIRED;
                }
                break;
            case Ball.states.FIRED:
                this.time += dt;
                switch( this.levelNum ){
                    case 1:
                        this.mesh.position.z += this.speed * dt;
                        this.support.position.z = this.mesh.position.z;
                        break;
                    case 2:
                        this.mesh.position.z += this.speed * dt;
                        this.support.position.z = this.mesh.position.z;
                        this.mesh.position.y = (Math.cos( this.time * 2.0 ) - 1.0) * 0.4 + 1.6; 
                        this.support.position.y = this.mesh.position.y - 1.6;
                        break;
                    default: 
                        this.support.rotateY(dt*3);
                        this.support.position.z += this.speed * dt;
                        this.support.children[4].getWorldPosition( this.tmpVec );
                        this.tmpVec.y += 0.7;//this.mesh.position.y
                        this.mesh.position.copy( this.tmpVec );
                        break;
                    }

                    if (this.levelNum>3) this.support.position.y = (Math.cos( this.time * 3.0 ) - 1.0) * 0.4 + 0.1;    
                break;
            case Ball.states.HIT:
                this.particles.forEach( particle => { particle.update( this, dt ) })
                break
        }

        if (this.mesh.position.z > 2){
            this.mesh.material.map.dispose();
            if (game) game.removeBall( this, this.num==13 );
        }
    }
}

class Particle extends THREE.Mesh{
    static geometry = new THREE.IcosahedronGeometry( 0.08, 1 );

    constructor( ball ){
        super( Particle.geometry, new THREE.MeshStandardMaterial( { color: ball.color }) );

        this.dir = new THREE.Vector3( ball.game.random( -1, 1 ), ball.game.random( -1, 1 ), ball.game.random( -1, 1 ) );
        this.dir.normalize();
        this.position.copy( this.dir ).multiplyScalar( 0.45 );

        this.time = 0;
        this.lifeTime = ball.game.random( 0.5, 1.5 );
        this.down = 0;
    }

    update( ball, dt ){
        this.position.add( this.dir.clone().multiplyScalar( dt ));
        this.position.y -= this.down * dt;
        this.down += 0.1;

        this.time += dt;
        if (this.time > this.lifeTime) ball.removeParticle( this );
    }
}