export function l1tol2() { //city

    sound(soundNextLevel)

    const sky = sgobn('Sky');
    const skyMat2 = gradientMateriail("lightslategrey", "black");
    sky.material = skyMat2;

    world.flatZone = 10;

    removeOb('Ground', worldGroup);

    addTerrain('Two');

    removeOb('Trees', worldGroup);
    addTrees('Two');

    removeOb('Rock', worldGroup);
    removeOb('Rock2', worldGroup);
    removeOb('Rock3', worldGroup);

    addBuildings();

    addParticles();

    const light = sgobn('Light');
    light.intensity = 0.25;

    balloonStats.Level = 2;
    upDateHuds();

}


export function l2tol3() { //desert

    sound(soundNextLevel)

    const sky = sgobn('Sky');
    const skyMat2 = gradientMateriail("lightcyan", "lightskyblue");
    sky.material = skyMat2;

    world.flatZone = 5;

    removeOb('Ground', worldGroup);
    addTerrain('Three');

    removeOb('Trees', worldGroup);
    addTrees('Three');

    removeOb('Building', worldGroup);

    addCactusMountain();

    removeOb('star', scene);

    balloonStats.Level = 3;
    upDateHuds();

}
