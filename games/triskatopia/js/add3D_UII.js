
let altVar, tiltVar, levelsVar;
let hudsPlane
const hudVarsArr = []

export function addXR_UI() {

  const geometry = new THREE.PlaneGeometry(0.01, 0.01);
  const geometryHuds = new THREE.PlaneGeometry(1.5, 2.2);

  const material = new THREE.MeshStandardMaterial({
    color: 'grey',
    side: THREE.DoubleSide
  });
  const materialHuds = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });

  const UIplane = new THREE.Mesh(geometry, material);
  UIplane.name = "UI_UIplane";


  ///////////Controls/////////////////
  const cntrlPlane = new THREE.Mesh(geometry, material);
  cntrlPlane.position.set(-1.5, 0.1, 0);
  UIplane.add(cntrlPlane);

  //https://emojis.wiki/microsoft/
  // ➡️  ⬅️  ⬇️  ⏫  ⏬⭐ 😧 🏠  ↩️  ↪️
  // //🥱 😄 🤩 😵
  //❤️ ❤️ ❤️
  //emoji license - https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE

  const emoji1 = createText('🏠', 0.4, 'Courier New', true);
  emoji1.position.set(0, 0, 0);
  emoji1.name = "home";
  cntrlPlane.add(emoji1);
  clickable_3D.push(emoji1);

  const emoji2 = createText('⏫', 0.4, 'Courier New', true);
  emoji2.position.set(0, 0.5, 0);
  emoji2.name = "altUp";
  cntrlPlane.add(emoji2);
  clickable_3D.push(emoji2);

  const emoji3 = createText('⏬', 0.4, 'Courier New', true);
  emoji3.position.set(0, -0.5, 0);
  emoji3.name = "altDown";
  cntrlPlane.add(emoji3);
  clickable_3D.push(emoji3);

  const emoji4 = createText('↪️', 0.4, 'Courier New', true);
  emoji4.position.set(0, 1, 0);
  emoji4.rotation.set(0, 0, - Math.PI / 2);
  emoji4.name = "tiltUp";
  cntrlPlane.add(emoji4);
  clickable_3D.push(emoji4);

  const emoji5 = createText('↩️', 0.4, 'Courier New', true);
  emoji5.position.set(0, -1, 0);
  emoji5.rotation.set(0, 0, -Math.PI / 2);
  emoji5.name = "tiltDown";
  cntrlPlane.add(emoji5);
  clickable_3D.push(emoji5);

  //Launch
  const geoCirc = new THREE.CircleGeometry(0.3, 32, 0, 3.14 * 2);
  const matCirc = new THREE.MeshStandardMaterial({ color: 'orange' });
  const meshCirc = new THREE.Mesh(geoCirc, matCirc);
  meshCirc.position.set(-0.8, 0, 0);
  meshCirc.name = "Launch";
  cntrlPlane.add(meshCirc);
  clickable_3D.push(meshCirc);
  const launchWord = createText('Launch', 0.15, 'Courier New', false);
  launchWord.position.set(-0.8, 0, 0.01);
  cntrlPlane.add(launchWord);



  ////////////////HUDS//////////////
  hudsPlane = new THREE.Mesh(geometryHuds, materialHuds);
  hudsPlane.position.set(1.5, 0, 0);
  UIplane.add(hudsPlane);

  //altitude read out
  const altWord = createText('Altitude (m)', 0.2, 'Courier New', false);
  altWord.position.set(0, 0.9, 0.01);
  hudsPlane.add(altWord);

  altVar = createText(`${balloonStats.Altitude}`, 0.2, 'Courier New', false);
  altVar.position.set(0, 0.6, 0.01);
  altVar.name = "altVar"
  hudsPlane.add(altVar);

  //tilt read out
  const tiltWord = createText('Tilt (deg)', 0.2, 'Courier New', false);
  tiltWord.position.set(0, 0.15, 0.01);
  hudsPlane.add(tiltWord);

  tiltVar = createText(`${( THREE.MathUtils.radToDeg(balloonStats.Tilt))}`, 0.2, 'Courier New', false);
  tiltVar.position.set(0, -0.150, 0.01);
  tiltVar.name = "tiltVar"
  hudsPlane.add(tiltVar);

  //level read out
  const livesWord = createText('Level', 0.2, 'Courier New', false);
  livesWord.position.set(0, -0.6, 0.01);
  hudsPlane.add(livesWord);


  levelsVar = createText(`${balloonStats.Level}`, 0.2, 'Courier New', true);
  levelsVar.position.set(0, -0.9, 0.01);
  levelsVar.name = "levelsVar"
  hudsPlane.add(levelsVar);

  hudVarsArr.push(altVar, tiltVar, levelsVar);//TODO altVarEmoj, 


  ////Exit/////////////
  const exit = createText('Exit', 0.2, 'Courier New', false);
  exit.position.set(2.75, 0, 0.01);
  exit.name = "exitVR";
  UIplane.add(exit);
  clickable_3D.push(exit);

  ////////////////////////////////
  UIplane.position.set(0, 0, -3.5);
  vehicle.add(UIplane)

}

let newAngle 
export function upDateHuds() {

  if (renderer.xr.isPresenting == false) { return }

  newAngle = THREE.MathUtils.radToDeg(balloonStats.Tilt).toFixed(1);
 // console.log(balloonStats.Tilt, newAngle)

  switcheroo(altVar, balloonStats.Altitude.toFixed(0), altVar.position, "altVar");
  switcheroo(tiltVar, newAngle, tiltVar.position, "tiltVar");
  switcheroo(levelsVar, balloonStats.Level, levelsVar.position, "levelsVar");

}

function switcheroo(a, b, c, d) {  //tiltVar, balloonStats.Tilt, position, name

  removeOb(d, hudsPlane)
  a = createText(`${b}`, 0.2, 'Courier New', false);
  a.position.set(c.x, c.y, c.z);
  a.name = d

  hudsPlane.add(a)

}










