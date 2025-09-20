export function addLicense() {

  const licenseGroup = new THREE.Group();

  const geometry = new THREE.PlaneGeometry(1.7, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xDEB887, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  licenseGroup.add(plane);

  const jasonGeo = addJason();

  const jasonMatl = new THREE.MeshStandardMaterial({

    color: new THREE.Color(0xccccb3),//'khaki',
    flatShading: true,

  });

  const jason = new THREE.Mesh(jasonGeo, jasonMatl);
  const jason2 = jason.clone();
  jason2.scale.set(-1, 1, 1,);

  jason.add(jason2);
  jason.position.set(-0.5, -0.4, 0)

  licenseGroup.add(jason);

  const line1 = createText('Triskatopia', 0.1, 'Courier New', false);
  line1.position.set(0, 0.4, 0.01);
  licenseGroup.add(line1);

  const line2 = createText('Balloon Driver License', 0.1, 'Courier New', false);
  line2.position.set(0, 0.26, 0.01);
  licenseGroup.add(line2);

  const line3 = createText('Number: 123456', 0.1, 'Courier New', false);
  line3.position.set(0.22, 0, 0.01);
  licenseGroup.add(line3);

  const line4 = createText('Date: Friday', 0.1, 'Courier New', false);
  line4.position.set(0.22, -0.2, 0.01);
  licenseGroup.add(line4);

  const line5 = createText('XXth 2024', 0.1, 'Courier New', false);
  line5.position.set(0.22, -0.32, 0.01);
  licenseGroup.add(line5);

  licenseGroup.position.set(-0.25, 0, 0);
  licenseGroup.visible = false;

  licenseGroup.name = "license";

  let plane2 = sgobn("UI_UIplane");
  plane2.add(licenseGroup);

}










