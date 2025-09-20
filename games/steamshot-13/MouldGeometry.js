export class MouldGeometry extends THREE.BufferGeometry{
    constructor( width=0.02, height=0.08, depth=1, baseExtend=0 ){
        const shape = new THREE.Shape();
        
        const xArr = [ 1, 1, 0.8, 0.6, 0.6, 0.8, 0.9, 0.8, 0.6, 0.4, 0.4, 0.5, 0.35, 0.2, 0.2, 0, 0 ];
        const yArr = [ 0, 0.16, 0.24, 0.3, 0.36, 0.42, 0.5, 0.58, 0.66, 0.7, 0.75, 0.8, 0.86, 0.93, 1, 1, 0];
        //
        shape.moveTo( 0, 0 );
        for( let i=0; i<xArr.length; i++){
            const extend = (yArr[i]) ? baseExtend : 0
            shape.lineTo( width*xArr[i], height*yArr[i]+extend );
        }

        super();
        const geometry = new THREE.ExtrudeGeometry( shape, { depth, bevelEnabled: false } );

        this.attributes = geometry.attributes;
    }
}