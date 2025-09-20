export function sleep(time) {

    return new Promise((resolve) => setTimeout(resolve, time))

}

export function createText(message, height, font, emoji = false) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
        // willReadFrequently: true
    });
    let metrics = null;
    const textHeight = 100;
    context.font = 'normal ' + textHeight + 'px ' + font;
    metrics = context.measureText(message);
    const textWidth = metrics.width;
    canvas.width = textWidth;
    canvas.height = textHeight;
    canvas.border = '10px solid blue';

    if (emoji == false) {

        context.font = 'normal ' + textHeight + 'px ' + font

    }
    else {

        context.font = 'normal ' + textHeight * 0.75 + 'px ' + font

    }

    context.textAlign = 'center';
    context.textBaseline = 'middle';


    context.fillText(message, textWidth / 2, textHeight / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshStandardMaterial({

        side: THREE.DoubleSide,
        map: texture,
        transparent: true

    });

    const geometry = new THREE.PlaneGeometry((height * textWidth) / textHeight, height);


    const plane = new THREE.Mesh(geometry, material);
    return plane


}

//TODO add destroy helper
// const destroy = () =>
//     {
//         scene.remove(firework)
//         geometry.dispose()
//         material.dispose()
//     }


export function removeOb(name, parent) {

    let ob = sgobn(name)

    parent.remove(ob, true)

}


export function sgobn(namestring) {

    let ob = scene.getObjectByName(namestring)
    return ob

}

export function gradientMateriail(colbtm, coltop) {
    //https://stackoverflow.com/questions/52614371/apply-color-gradient-to-material-on-mesh-three-js
    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            color1: {
                value: new THREE.Color(colbtm)
            },
            color2: {
                value: new THREE.Color(coltop)
            }
        },
        vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`,
        fragmentShader: `
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;

void main() {
  
  gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
}
`,
        //wireframe: true
    });

    return material

}

export function addSkySphere() {

    const geometry = new THREE.SphereGeometry(80, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);

    const skyMat = gradientMateriail("peachpuff", "blue");

    const mesh = new THREE.Mesh(geometry, skyMat);

    mesh.position.set(0, -4, 0);

    mesh.name = "Sky";

    scene.add(mesh);

}

const extrudeSettings = {
    steps: 4,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4
};

export function addArrow() {

    const arrowShape = new THREE.Shape()
        .moveTo(-2, 16)//1
        .lineTo(-8, 14)//2
        .lineTo(0, 26)//3
        .lineTo(8, 14)//4
        .lineTo(2, 16)//5
        .lineTo(2, 0)//6
        .lineTo(-2, 0)//7
        .lineTo(-2, 16)//7

    const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    arrowGeo.center();

    return arrowGeo

}

export function addCross() {

    //cross geometry
    const legLength = 2 * 0.1;
    const legWidth = 1 * 0.1;
    const crossShape = new THREE.Shape()
        .moveTo(0, legLength)//1
        .lineTo(legLength, legLength)//2
        .lineTo(legLength, 0)//3
        .lineTo(legLength + legWidth, 0)//4
        .lineTo(legLength + legWidth, legLength)//5
        .lineTo(legLength + legWidth + legLength, legLength)//6
        .lineTo(legLength + legWidth + legLength, legLength + legWidth)//7
        .lineTo(legLength + legWidth, legLength + legWidth)//8
        .lineTo(legLength + legWidth, legLength + legWidth + legLength)//9
        .lineTo(legLength, legLength + legWidth + legLength)//10
        .lineTo(legLength, legLength + legWidth)//11
        .lineTo(0, legLength + legWidth);//12;


    const crossGeo = new THREE.ExtrudeGeometry(crossShape, extrudeSettings);
    crossGeo.center();
    crossGeo.rotateZ(Math.PI / 4);

    return crossGeo


}

export function addCactus() {
    const cactusShape = new THREE.Shape()
        .moveTo(0.18, 0.76)
        .lineTo(0.16, 0.72)
        .lineTo(0.09, 0.67)
        .lineTo(0.12, 1.20)
        .lineTo(0.13, 1.20)
        .lineTo(0.09, 1.29)
        .lineTo(0.00, 1.33)
        .lineTo(-0.09, 1.29)
        .lineTo(-0.13, 1.20)
        .lineTo(-0.12, 1.20)
        .lineTo(-0.10, 0.77)
        .lineTo(-0.16, 0.82)
        .lineTo(-0.18, 0.86)
        .lineTo(-0.17, 1.10)
        .lineTo(-0.20, 1.17)
        .lineTo(-0.27, 1.20)
        .lineTo(-0.34, 1.17)
        .lineTo(-0.37, 1.10)
        .lineTo(-0.34, 0.83)
        .lineTo(-0.28, 0.74)
        .lineTo(-0.09, 0.62)
        .lineTo(-0.06, 0.00)
        .lineTo(0.06, 0.00)
        .lineTo(0.08, 0.53)
        .lineTo(0.29, 0.65)
        .lineTo(0.34, 0.73)
        .lineTo(0.35, 0.98)
        .lineTo(0.33, 1.04)
        .lineTo(0.26, 1.07)
        .lineTo(0.19, 1.04)
        .lineTo(0.17, 0.98)

    const cactusGeo = new THREE.ExtrudeGeometry(cactusShape, extrudeSettings);
    cactusGeo.center();
    cactusGeo.scale(4, 4, 4);

    return cactusGeo
}

export function addCheck() {

    const checkShape = new THREE.Shape()
        .moveTo(30, 40)//1
        .lineTo(0, 0)//2
        .lineTo(-15, 15)//3
        .lineTo(-10, 20)//4
        .lineTo(0, 10)//5
        .lineTo(25, 45)//6

    const checkGeo = new THREE.ExtrudeGeometry(checkShape, extrudeSettings);
    checkGeo.center();

    return checkGeo

}

export function addCloud() {

    const cloudShape = new THREE.Shape()

        .moveTo(0.88, -0.15)
        .lineTo(0.99, -0.07)
        .lineTo(1.01, 0.03)
        .lineTo(0.97, 0.14)
        .lineTo(0.86, 0.21)
        .lineTo(0.75, 0.19)
        .lineTo(0.68, 0.30)
        .lineTo(0.56, 0.37)
        .lineTo(0.35, 0.37)
        .lineTo(0.28, 0.29)
        .lineTo(0.23, 0.23)
        .lineTo(0.12, 0.27)
        .lineTo(0.03, 0.20)
        .lineTo(-0.05, 0.10)
        .lineTo(-0.05, -0.02)
        .lineTo(0.00, -0.09)
        .lineTo(0.12, -0.20)
        .lineTo(0.25, -0.17)
        .lineTo(0.28, -0.24)
        .lineTo(0.37, -0.28)
        .lineTo(0.44, -0.27)
        .lineTo(0.49, -0.24)
        .lineTo(0.58, -0.30)
        .lineTo(0.70, -0.28)
        .lineTo(0.81, -0.27)

    const cloudGeo = new THREE.ExtrudeGeometry(cloudShape, extrudeSettings);
    cloudGeo.center();

    return cloudGeo

}

export function addJason() {

    const jasonShape = new THREE.Shape()
        .moveTo(16.16, 60.89)
        .lineTo(9.48, 64.64)
        .lineTo(4.92, 65.49)
        .lineTo(3.93, 61.00)
        .lineTo(0.00, 60.78)
        .lineTo(0.00, 41.02)
        .lineTo(9.34, 43.30)
        .lineTo(-0.03, 37.19)
        .lineTo(4.99, 35.70)
        .lineTo(5.59, 37.40)
        .lineTo(8.49, 39.02)
        .lineTo(10.65, 38.92)
        .lineTo(12.66, 38.60)
        .lineTo(13.72, 36.94)
        .lineTo(13.44, 34.93)
        .lineTo(11.71, 32.42)
        .lineTo(9.94, 31.29)
        .lineTo(8.49, 31.32)
        .lineTo(7.08, 31.71)
        .lineTo(5.84, 33.41)
        .lineTo(5.06, 35.21)
        .lineTo(0.00, 36.96)
        .lineTo(0.00, 21.78)
        .lineTo(1.48, 21.85)
        .lineTo(2.16, 21.69)
        .lineTo(2.33, 20.93)
        .lineTo(1.63, 20.20)
        .lineTo(0.00, 19.72)
        .lineTo(0.00, 0.00)
        .lineTo(3.81, 0.54)
        .lineTo(10.53, 3.88)
        .lineTo(15.89, 9.50)
        .lineTo(21.22, 18.48)
        .lineTo(23.98, 28.10)
        .lineTo(25.45, 35.74)
        .lineTo(25.54, 37.58)
        .lineTo(23.21, 37.03)
        .lineTo(23.21, 43.85)
        .lineTo(25.35, 44.39)
        .lineTo(23.12, 50.75)
        .lineTo(19.94, 57.18)

    const jasonGeo = new THREE.ExtrudeGeometry(jasonShape, extrudeSettings);
   // jasonGeo.center();
   jasonGeo.scale( 0.008,0.008,0.008 );

    return jasonGeo

}


export function remap(val, smin, smax, emin, emax) {
    const t = (val - smin) / (smax - smin)
    return (emax - emin) * t + emin
}

export function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}

export const randomizeMatrix_OG = function () {

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix) {

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        quaternion.random();



        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose(position, quaternion, scale);

    };

}();
