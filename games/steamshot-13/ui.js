import { CanvasUI } from "./CanvasUI.js";

export class UI{
    constructor( parent ){
        this.scoreUI = new TextUI( parent, new THREE.Vector3( -0.1, -0.5, 0.1 ) );
        this.timeUI = new TextUI( parent, new THREE.Vector3( 0.1, -0.5, 0.1 ), "00:00" );
    }
}

class TextUI extends THREE.Mesh{
    constructor( parent, pos, txt = "00000", s = new THREE.Vector2( 128, 64 ) ){
        const canvas = createOffscreenCanvas( s.x, s.y );
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const geometry = new THREE.PlaneGeometry(0.7, 0.7 * s.y/s.x);
        
        super(geometry, material);

        this.context = canvas.getContext('2d');
        this.context.fillStyle = "white";
        this.context.font = "48px Arial";
        this.context.save();
        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';

        this.texture = texture;

        this.width = s;
        this.height = s;

        this.position.copy(pos);

        this.text = txt;

        parent.add( this );

        function createOffscreenCanvas(w, h) {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            return canvas;
        }
    }

    set text( txt ){
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillText( txt, 0, 32, 128 );
    }
}