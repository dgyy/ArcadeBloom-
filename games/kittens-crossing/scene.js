setTimeout(function() {
  SVOX.models.City = City.generate();
  City.mesh = SvoxMeshGenerator.generate('City', SVOX.models.City);
  document.getElementById("wait").classList.add("hide");
  document.getElementById("start").classList.remove("hide");
},200);

function buildScene() {
    
let kittens = '';
for (let k=0; k<20; k++) {
let x = 0;
let z = 0;
let pos = new THREE.Vector3(0,0,0);
const color = ['#C84','#DB9','#777','#AAA'][Math.floor(Math.random()*4)];
kittens+=`<a-entity catwalk="${color}" kitten avoidbuildings walk-up-and-down mixin="deathsound"></a-entity>`;
}

let cars = ["CarRed","CarGreen","CarBlue","CarGrey","CarTan","Van","PickupTruck","Truck"].map(c=>`<a-entity vehicle svox="${c}" mixin="enginesound"></a-entity>`).join('');
cars += cars;

document.body.innerHTML = `
<a-scene id="scene" fpscounter renderer="highRefreshRate:true; logarithmicDepthBuffer:false; colorManagement:true; antialias: true;">
<a-assets>
<audio id="engine" src="${SVOX.sounds.Engine}"></audio>
<audio id="death" src="${SVOX.sounds.Death}"></audio>
<a-mixin id="enginesound" sound="src:#engine;autoplay:true;volume:0.1;loop:true;positional:true;distanceModel:linear;refDistance:5;maxDistance:25;rolloffFactor:1;"></a-mixin>
<a-mixin id="deathsound" sound="src:#death;autoplay:false;volume:1;positional:true;distanceModel:linear;refDistance:10;maxDistance:250;rolloffFactor:1;"></a-mixin>
</a-assets>
<a-entity id="cat" catwalk position="-6 0.5 0" avoidbuildings walk-up-and-down mixin="deathsound">
<a-text id="text" align="center" width="8" color="red" value="" position="0 1.5 0"></a-text>
<a-entity score position="0 1.25 0"></a-entity>
</a-entity>  
<a-entity id="camerarig" position="-10 0 1.5" third-person-camera="target:#cat;">  
<a-camera id="camera" look-controls wasd-controls="enabled: false" position="0 1.6 1.5" avoidbuildings="preservePosition:true;"></a-camera>
<a-entity id="lefthand" meta-touch-controls="hand:left;model:true;" movecontrols="#cat"></a-entity> 
<a-entity id="righthand" meta-touch-controls="hand: right;model:true;" movecontrols="#cat"></a-entity>         
</a-entity>
<a-sky src="data:image/bmp;base64,Qk1SAAAAAAAAAEIAAAAoAAAAAQAAAAQAAAABAAgAAAAAAAAAAADEDgAAxA4AAAMAAAADAAAA/5QA////AP//////AgAAAAIAAAABAAAAAAAAAA=="></a-sky>
<a-entity id="City" city position="0 -0.5 0"></a-entity>
<a-entity vehicle svox="Ambulance" mixin="enginesound"></a-entity>
<a-entity vehicle svox="FireTruck" mixin="enginesound"></a-entity>
<a-entity vehicle svox="PoliceCar" mixin="enginesound"></a-entity>
${cars} 
${kittens}
</a-scene>
`;

/*
// Set the environment map for standard materials without a specific environment map
// Simple tiny (64 x 32 size texture) smaller does not work!?
let scene = document.getElementById('scene');
let environment = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgAgMAAADf85YXAAAACVBMVEXAwMD///9gYGAdIplaAAAAH0lEQVQoz2PQYBBBwZgCaHwNDAHCChgIWjPqjsHpDgDj8R4BQIulcgAAAABJRU5ErkJggg==");
environment.encoding = THREE.sRGBEncoding;
environment.mapping = THREE.EquirectangularReflectionMapping;
scene.object3D.environment = environment;
*/
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start').onclick = function() {startMusic();buildScene();};
});
