import { VRButton } from './VRButton.js';
//import { Proxy } from './proxy.js';
import { Ball } from './ball.js';
import { Gun } from './gun.js';
import { Bullet } from './bullet.js';
import { Counter } from './counter.js';
import { SFX } from './sfx.js';
//import { Test } from './test.js';
import { NoiseMaterial } from './NoiseMaterial.js';
import { Panelling } from './panelling.js';
import { Ceiling } from './ceiling.js';
import { MouldGeometry } from './MouldGeometry.js';
import { Leaderboard } from './leaderboard.js';

class App{
    static states = { INTRO: 1, GAME: 2, OVER: 3, NEWLEVEL: 4 }
    static woodMat = new NoiseMaterial( 'wood', { roughness: 0.3 } );
    static darkWoodMat = new NoiseMaterial( 'darkwood', { roughness: 0.3 } ); 
    static oakMat = new NoiseMaterial( 'oak', { roughness: 0.3 } ); 
    static darkMetalMat = new THREE.MeshStandardMaterial( { color: 0x707070, metalness: 1, roughness: 0.3 } );
    static metalMat = new THREE.MeshStandardMaterial( { color: 0x999999, metalness: 1, roughness: 0.3 } );
	static brassMat = new THREE.MeshStandardMaterial( { color: 0xffAA11, metalness: 1, roughness: 0.1 } );
        
    constructor(){
        const debug = false;

		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 200 );

		this.camera.position.set( 0, 1.3, 0 );
        
		this.scene = new THREE.Scene();
    
		this.scene.add( new THREE.HemisphereLight( 0xffffff, 0x404040, 1.5) );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

        const light = new THREE.DirectionalLight(0xFFFFFF, 2);
        light.castShadow = true;
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default
        const size = 15;
        light.shadow.camera.top = size;
        light.shadow.camera.right = size;
        light.shadow.camera.bottom = -size;
        light.shadow.camera.left = -size;
        light.position.set(1,3,3);
        this.scene.add(light);
        
		container.appendChild( this.renderer.domElement );
        
        this.initScene();

        this.tmpVec = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();

        this.leaderboard = new Leaderboard();

        this.setupVR();

        this.SFX = new SFX();
        
        window.addEventListener('resize', this.resize.bind(this) );

        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	

    startGame(){
        this.state = App.states.GAME;
        this.gameTime = 0;
        this.ballTime = 2.5;
        this.ballCount = 0;
        this.hitCount = 0;
        this.levelHitCount = 6;
        this.ball13Count = 10;
        this.levelNum = 1;
        this.startTime = this.clock.elapsedTime;
        this.newBallTime = 3;
        this.balls = [];
        this.bullets = [];
        this.score = 0;
        this.timerTime = 0;
        this.timeCounter.seconds = 0;
        const panel = document.getElementById('openingPanel');
        panel.style.top = '-50%';
        this.SFX.heart();
    }

    gameOver(dead = true){
        //return;
        const panel = document.getElementById('gameoverPanel');
        const details = document.getElementById('details');

        let html;

        if (dead){
            html = `<P>You let a Ball 13 get passed you.<table>`;
        }else{
            html = `<P>You quit the game<table>`;
        }

        const totalScore = this.score + this.timeCounter.seconds;

        html = `${html}<tr><td>Hit score</td><td>${this.score}</td></tr>`;
        html = `${html}<tr><td>Time</td><td>${this.timeCounter.time}</td></tr>`;
        html = `${html}<tr><td>Total Score</td><td>${totalScore}</td></tr></table></p>`;

        details.innerHTML = html;

        window.showGameover();

        const elm = document.getElementById("name");
        if (elm.value != ""){
            this.leaderboard.write( { name: elm.value, score: totalScore });
            //this.updateLeaderboard();
        }

        let count = 0;

        while( this.balls.length > 0 ){
            count++;
            if (count>1000) break;
            this.removeBall( this.balls[0] );
        }

        count = 0;
        while( this.bullets.length > 0 ){
            count++;
            if (count>1000) break;
            this.removeBullet( this.bullets[0] );
        }

        this.state = App.states.OVER;

        this.SFX.gameOver();

        if (dead) this.vrButton.endSession();
    }

    random( min, max, int = false ){
        let value = Math.random() * (max-min) + min;
        if (int) value = Math.floor( value );
        return value;
    }
    
    initScene(){
        //this.proxy = new Proxy( this.scene );

        const woodMat = App.woodMat;

        const geo1 = new THREE.PlaneGeometry( 15, 30 );
        geo1.rotateX( -Math.PI/2 );
        const floor = new THREE.Mesh( geo1, woodMat );
        floor.receiveShadow = true;
        floor.position.set( 0, 0.01, -15 );
        this.scene.add( floor );

        const panellingLeft = new Panelling();
        panellingLeft.rotateY( Math.PI/2 );
        panellingLeft.position.set( -7, 3.15, -10 );
        this.scene.add( panellingLeft );
        const panellingRight = panellingLeft.clone();
        panellingRight.rotateY( Math.PI );
        panellingRight.position.x = 7;
        this.scene.add( panellingRight );
        this.panels = [ panellingLeft, panellingRight ];

        const ceiling = new Ceiling();
        ceiling.position.y = 6.3;
        this.scene.add( ceiling );

        const geo2 = new THREE.CylinderGeometry( 0.25, 0.25, 3 );
        const brassMat = App.brassMat;
        const metalMat = App.metalMat;

        const column = new THREE.Mesh( geo2, brassMat );
        column.castShadow = true;

        const shape = new THREE.Shape();
        const w = 0.2;
        const h = 0.15;
        shape.moveTo( w/2, 0 );
        shape.lineTo( w/2, h*0.3 );
        shape.lineTo( w*0.2, h );
        shape.lineTo( w*0.1, h );
        shape.lineTo( w*0.1, h/2);
        shape.lineTo( -w*0.1, h/2);
        shape.lineTo( -w*0.1, h );
        shape.lineTo( -w*0.2, h );
        shape.lineTo( -w/2, h*0.3 );
        shape.lineTo( -w/2, 0 );
        shape.lineTo( w/2, 0 );
        const geo4 = new THREE.ExtrudeGeometry( shape, { depth: 30, steps: 1, bevelEnabled: false } );
        geo4.translate( 0, 0, -30 );
        const channel = new THREE.Mesh( geo4, metalMat );
        //channel.castShadow = true;
        //channel.position.y = 1;
        
        for ( let x = -6; x<=6; x+=2 ){
            const columnA = column.clone();
            columnA.position.set( x, 1.5, -20);
            this.scene.add( columnA );
            if (x<6){
                const channelA = channel.clone();
                channelA.position.x = x+1;
                this.scene.add( channelA );
            }
        }

        const geo3 = new THREE.BoxGeometry( 0.6, 5, 15 );
        const lintel = new THREE.Mesh( geo3, woodMat );
        //lintel.rotateZ( Math.PI/2 );
        //lintel.rotateZ( Math.PI/2 );
        lintel.rotateY( Math.PI/2 );
        lintel.position.set( 0, 5.5, -20 ); 
        this.scene.add( lintel );

        const geo5 = new MouldGeometry( 0.1, 0.2, 15 );
        geo5.translate( 0, 0, -7.5 );
        const trim = new THREE.Mesh( geo5, woodMat );
        trim.rotateY( -Math.PI/2 );
        trim.position.set( 0, 3, -19.5 ); 
        this.scene.add( trim );

        this.scoreCounter = new Counter( this.scene, new THREE.Vector3( -3, 4.5, -19.8 ) );
        this.timeCounter = new Counter( this.scene, new THREE.Vector3( 3.9, 4.5, -19.8 ) );
        
       // this.test = new Gun();

		this.scene.background = new THREE.Color( 0x202020 );
		//this.scene.fog = new THREE.Fog( 0x0a0a0a, 20, 50 );

        delete this.envMap;
    } 
    
   /* loadSound( snd, listener, vol=0.5, loop=false ){
        // create a global audio source
        const sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( snd, ( buffer ) => {  
            sound.setBuffer( buffer );
            sound.setLoop(loop);
            sound.setVolume(vol);
        });

        return sound;
    }*/

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }

    resetGame(){
        if ( this.state == App.states.GAME ) this.gameOver( false );
    }

    setupVR(){
        this.renderer.xr.enabled = true;
        
        const button = new VRButton( this.renderer );
        this.vrButton = button;

        const scope = this;

        button.onClick = () => {
            //this.sfx.ball.play();
        }
        
        function onSelect() {
            console.log(`BulletTime:${this.userData.bulletTime.toFixed(2)}`);
            if (this.userData.bulletTime > 0.25 ){
                this.userData.bulletTime = 0;
                scope.bullets.push( new Bullet( scope, this ) );
                scope.SFX.shoot( 0.1 );
            }   
        }

        function onSqueeze() { 
        }

        this.renderer.xr.addEventListener( 'sessionend', function ( event ) {
            scope.resetGame();
        } );

        this.renderer.xr.addEventListener( 'sessionstart', function ( event ) {
            scope.startGame();
        } );

        this.controllers = [];

        for (let i=0; i<=1; i++){
            const controller = this.renderer.xr.getController( i );
            this.scene.add( controller );

            controller.addEventListener( 'select', onSelect );
            controller.addEventListener( 'squeeze', onSqueeze );
            controller.addEventListener( 'connected', ( event ) => {
                event.target.add( new Gun() );
                event.target.handedness = event.data.handedness;
                event.target.userData.bulletTime = 0.5;
                this.controllers.push( event.target );   
            } );
            
            controller.addEventListener( 'disconnected', function () {
                
            } );

        }

    }
    
    handleController( controller, dt ){
        if (controller.handedness == 'right'){
            
        }else if (controller.handedness == 'left'){
            
        }
    }

    updateScore( num,  levelUpdate=false){
        if (levelUpdate){
            this.hitCount++;
            if (this.hitCount >= this.levelHitCount){
                this.levelNum++;
                this.levelHitCount++;
                this.hitCount = 0;
                this.score += 100;
                if (this.ball13Count>5) this.ball13Count--;
            }
        }

        this.score += num;
        if (this.score < 0) this.score = 0;
        this.scoreCounter.score = this.score;

        
        //console.log(`Update score ${num} ${this.score}`);
    }

    removeBall( ball, gameOver = false ){
        const index = this.balls.indexOf( ball );
        if (index != -1){
            ball.mesh.material.map.dispose();
            this.scene.remove( ball.group );
            this.scene.remove( ball.mesh );
            this.scene.remove( ball.support );
            this.balls.splice( index, 1 );
        }
        if (gameOver) this.gameOver( true );
    }

    removeBullet( bullet ){
        const index = this.bullets.indexOf( bullet );
        if (index != -1){
            this.scene.remove( bullet );
            this.bullets.splice( index, 1 );
        }
    }

    newBall(){
        this.ballCount++;

        const speed = Math.min( 0.05 + 0.01 * this.ballCount, 0.2 );

        let count = 0;

        let xPos = 1;

        if ( this.ballCount > 50 ){
            const r1 = Math.random();
            if (r1>0.7){
                xPos += 4;
            }else if (r1>0.3){
                xPos += 2;
            }
        }else if (this.ballCount > 10){
            if (Math.random()>0.5) xPos += 2;
        }

        if (this.newBallTime>0.5) this.newBallTime -= 0.05;
        const rand = Math.random();

        let num;
        const minus = Math.random() > 0.7;
        const scores = [ 10, 50, 250 ];
        const leftSide = Math.random()>0.5;

        if ( this.ballCount % this.ball13Count == 0){
            if (xPos > 3) xPos = 3;
            num = 13;
        }else{
            let index = (xPos-1)/2;
            num = scores[ index ];
        }

        if (leftSide) xPos *= -1;
        
        const balls = this.balls.filter(  ball => {
            if (ball.state == Ball.states.FIRED) return false;
            const offset = ball.mesh.position.x - xPos;
            return offset * offset < 0.5;
        });

        if (balls.length > 0){
            this.ballCount--;
            return;
        }

        this.ballTime = 0;

        if ( num==13 ){
            this.SFX.piano();
        }else{
            this.SFX.drum();
        }

        return new Ball( this.scene, num, minus, xPos, speed, this.levelNum )
    }

    capture(){
        const cav = this.renderer.domElement;
        const base64 = cav.toDataURL('img/png');
        this.envMap = new THREE.Texture( base64 );
        this.scene.environment = this.envMap;

        const geo = new THREE.PlaneGeometry();
        const mat = new THREE.MeshBasicMaterial( { map: this.envMap } );
        const mesh = new THREE.Mesh( geo, mat );
        mesh.position.set( -1, 1, -5 );
        this.scene.add( mesh );
    }

	render( time, frame ) {  
        const dt = this.clock.getDelta();

        if ( this.state == App.states.GAME ){
            this.gameTime += dt;
            this.ballTime += dt;
            this.timerTime += dt;
            if ( this.timerTime > 1){
                this.timerTime -= 1;
                this.timeCounter.seconds = Math.floor( this.gameTime );
            }

            if (this.ballTime > this.newBallTime){
                const ball = this.newBall();
                if (ball) this.balls.push( ball );
            }

            if ( this.balls && this.balls.length > 0 ){
                this.balls.forEach( ball => ball.update( this, dt ) );
            }

            this.controllers.forEach( controller => {
                if ( controller && controller.userData && controller.userData.bulletTime!=undefined){
                    controller.userData.bulletTime += dt;
                }
            });

            if (this.bullets && this.bullets.length > 0){
                this.bullets.forEach( bullet => bullet.update( dt ) );
            }

            this.scoreCounter.update( dt );
        }
       
        if (this.scene.environment == null){
            const panelling = new Panelling( 1.5, 1.5, true );
            panelling.position.set( 0.12, 1.34, -1 );
            this.scene.add( panelling );

            const renderTarget = new THREE.WebGLRenderTarget(128, 128, {
                generateMipmaps: true, 
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
                minFilter: THREE.LinearMipmapLinearFilter
            });
            this.camera.aspect = 1.2;
            this.camera.updateProjectionMatrix();
            this.renderer.setRenderTarget( renderTarget );
            this.renderer.render( this.scene, this.camera );
            
            const map = renderTarget.texture;
            map.repeat.set( 30, 6 );
            this.panels[0].panelling.material.map = map;
            this.panels[1].panelling.material.map = map;
            this.scene.remove( panelling );

            this.renderTarget = new THREE.WebGLRenderTarget(1024, 512);
            this.renderer.setSize( 1024, 512 );
            this.renderer.setRenderTarget( this.renderTarget );
            this.renderer.render( this.scene, this.camera );

            const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
            pmremGenerator.compileEquirectangularShader();
            const envmap = pmremGenerator.fromEquirectangular( this.renderTarget.texture ).texture;
            pmremGenerator.dispose();

            this.scene.environment = envmap;
            this.renderer.setRenderTarget( null );

            const ball = new Ball( this.scene, 13 );
            ball.state = Ball.states.PIC;
            ball.mesh.position.set( 0, 1.2, -1.5 );
            ball.mesh.rotation.y = -Math.PI/2;

            this.camera.aspect = 1;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( 128, 128 );

            this.renderer.render( this.scene, this.camera );
            const elm = document.getElementById( "ballPic" );
            elm.src = this.renderer.domElement.toDataURL( "image/png" );

            ball.mesh.material.map.dispose();
            this.scene.remove( ball.mesh );
            this.scene.remove( ball.support );

            this.resize();
        }

        /*if ( this.test == undefined){
            this.test = Ball.support2.clone();
            this.test.position.set( 0, 0, -3 );
            this.scene.add( this.test );
        }else{
            this.test.rotateY( dt );
            //this.test.update();
        }*/

        this.renderer.render( this.scene, this.camera );
    }
}

export { App };

document.addEventListener( 'DOMContentLoaded', () => {
    const app = new App();  
    window.app = app;

    const elm = document.getElementById("name");
    elm.addEventListener( "change", () => {
        app.leaderboard.write( { name: elm.value, score: app.score + app.timeCounter.seconds });
    });

    setTimeout( () => {
        const opening = document.getElementById("openingPanel");
        opening.style.top = "50%";
    }, 1000);
});