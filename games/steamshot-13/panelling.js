import { NoiseMaterial } from "./NoiseMaterial.js";
import { App } from './index.js';
import { MouldGeometry } from "./MouldGeometry.js";

export class Panelling extends THREE.Group{
    constructor( width = 30, height = 6.3, texture ){
        super();

        this.material = App.darkWoodMat;

        this.config = {
            height,
            width,
            skirtingHeight: 0.2,
            corniceHeight: 0.15,
            panelWidth: 1,
            panelHeight: 0.8,
            timberWidth: 0.12,
            panelEdgingWidth: 0.08
        }

        this.config.repeatWidth = this.config.panelWidth + this.config.timberWidth;

        //const bb = new THREE.Mesh( new THREE.BoxGeometry( this.config.width, this.config.height, 0.02 ), new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } ) );
        //this.add( bb );

        const skirting = this.createSkirting();
        const cornice = this.createCornice();

        if ( texture ){
            const panelling = new THREE.Group();

            const vertical = this.createVertical();
            const horizontal = this.createHorizontal();
            const panel = this.createPanel();

            for( let x=(this.config.timberWidth-this.config.width)/2; x<(this.config.width)/2; x+=this.config.repeatWidth ){
                const vert = vertical.clone();
                vert.position.set( x, (this.config.skirtingHeight - this.config.corniceHeight)/2, 0);
                panelling.add( vert );
                for (let y = (this.config.timberWidth-this.config.height)/2 + this.config.skirtingHeight; y<(this.config.height/2 - this.config.corniceHeight); y+=this.config.panelHeight + this.config.timberWidth ){
                    const horz = horizontal.clone();
                    horz.position.set( x + this.config.timberWidth/2 + this.config.panelWidth/2, y, 0);
                    panelling.add( horz );
                    const pnl = panel.clone();
                    pnl.position.set( x + (this.config.timberWidth + this.config.panelWidth)/2, y + ( this.config.timberWidth + this.config.panelHeight)/2, -0.01  );
                    panelling.add( pnl );
                    console.log(y);
                }
            } 

            this.add( panelling );
        }else{
            const geo = new THREE.PlaneGeometry( this.config.width, this.config.height );
            const mat = new THREE.MeshStandardMaterial( { roughness: 0.5, metalness: 0 } );
            this.panelling = new THREE.Mesh( geo, mat );
            this.add( this.panelling );
        }

        skirting.position.set( this.config.width/2, (this.config.skirtingHeight-this.config.height)/2, 0.01 );
        if ( !texture ) this.add( skirting );

        cornice.position.set( 0, (this.config.height - this.config.corniceHeight)/2, this.config.corniceHeight/2 );
        if ( !texture ) this.add( cornice );
    }

    createPanel(){
        const group = new THREE.Group();
        const geo1 = new THREE.PlaneGeometry( this.config.panelWidth - 2*this.config.panelEdgingWidth, this.config.panelHeight - 2*this.config.panelEdgingWidth );
        geo1.rotateX( -Math.PI/2 );
        const mesh1 = new THREE.Mesh( geo1, this.material );
        mesh1.rotateX( Math.PI/2 );
        group.add( mesh1 );
        
        const geo2 = new MouldGeometry( 0.02, this.config.panelEdgingWidth, this.config.panelWidth );
        const mesh2 = new THREE.Mesh( geo2, this.material );
        let offset =  this.config.panelHeight/2;// + h/2;
        mesh2.rotateY( -Math.PI/2 );
        mesh2.position.set( this.config.panelWidth/2, -offset, -0.005 );
        group.add( mesh2 );
        const mesh3 = mesh2.clone();
        mesh3.position.y = offset;
        mesh3.position.x = -this.config.panelWidth/2;
        mesh3.rotateX( Math.PI );
        group.add( mesh3 );

        const geo3 = new MouldGeometry( 0.02, this.config.panelEdgingWidth, this.config.panelHeight );
        const mesh4 = new THREE.Mesh( geo3, this.material );
        offset =  this.config.panelWidth/2;// + h/2;
        mesh4.rotateY( -Math.PI/2 );
        mesh4.rotateX( -Math.PI/2 );
        mesh4.position.set( -offset, -this.config.panelHeight/2, -0.005 );
        group.add( mesh4 );
        const mesh5 = mesh4.clone();
        mesh5.position.x = offset;
        mesh5.position.y = this.config.panelWidth/2 - this.config.panelEdgingWidth*1.5;
        mesh5.rotateX( Math.PI );
        group.add( mesh5 );

        return group;
    }

    createVertical(){
        const geometry = new THREE.PlaneGeometry( this.config.timberWidth, this.config.height - this.config.corniceHeight - this.config.skirtingHeight );
        geometry.rotateX( -Math.PI/2 );
        const mesh = new THREE.Mesh( geometry, this.material );
        mesh.rotateX( Math.PI/2 );
        //mesh.rotateZ( Math.PI/2 );
        return mesh;
    }

    createHorizontal(){
        const geometry = new THREE.PlaneGeometry( this.config.timberWidth, this.config.panelWidth );
        geometry.rotateX( -Math.PI/2 );
        const mesh = new THREE.Mesh( geometry, this.material );
        mesh.rotateX( Math.PI/2 );
        //mesh.rotateZ( Math.PI/2 );
        mesh.rotateY( Math.PI/2 );
        return mesh;
    }

    createSkirting(){
        const geometry = new MouldGeometry( 0.02, this.config.panelEdgingWidth, this.config.width, this.config.skirtingHeight - this.config.panelEdgingWidth );

        const mesh = new THREE.Mesh( geometry, this.material );
        mesh.rotateY( -Math.PI/2 );

        return mesh;
    }

    createCornice(){
        const geometry = new THREE.CylinderGeometry( this.config.corniceHeight, this.config.corniceHeight, this.config.width, 20, 1, false, 1.5*Math.PI, Math.PI/2 ); 
        const material = new THREE.MeshStandardMaterial( {
            color: 0x999999,
            metalness: 1,
            roughness: 0.3
        });
        geometry.rotateZ( Math.PI/2 )
        return new THREE.Mesh( geometry, material );
    }
}