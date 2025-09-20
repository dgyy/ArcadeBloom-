var npcs = [];

Npc = (mesh, position, rotation = vector3()) => {
    let body = createNpcPart(mesh[0], position, rotation),
        leftArm = createNpcPart(mesh[1], position, rotation),
        rightArm = createNpcPart(mesh[2], position, rotation),
        leftFoot = createNpcPart(mesh[3], position, rotation),
        rightFoot = createNpcPart(mesh[4], position, rotation),
        healthBar = Mesh([-50.0, 50.0, 0.0, -50.0, -50.0, 0.0, 50.0, -50.0, 0.0, 50.0, 50.0, 0.0], [0, 1, 2, 0, 2, 3], makeColors({ i: [0, 1, 2, 0, 2, 3] }, '#ff0000'), vector3(0, 0, 0), vector3(0, 0, 0), vector3(1, .1, 1));

    healthBar.offset = vector3(0, 1.5, 0);
    meshes.push(body, leftArm, rightArm, leftFoot, rightFoot, healthBar);
    return ({ body, leftArm, rightArm, leftFoot, rightFoot, healthBar, spawnPosition: clone(position), id: Math.random(), position, rotation, damage: 10, health: 100, isPatrolling: true, counter: 0.0, parts: [body, leftArm, rightArm, leftFoot, rightFoot, healthBar] })
}


updateNpcs = deltaTime => {
    npcs.forEach(npc => {
        npcs.forEach(npc2 => {
            if (npc2.id != npc.id) {
                if (distanceTo(npc2.position, npc.position) < 4) {
                    let angleToNpc2 = angleBetween(npc2.position, npc.position);
                    npc2.position.x += -Math.cos(angleToNpc2) / 20;
                    npc2.position.z += -Math.sin(angleToNpc2) / 20;
                }
            }
        });

        npc.counter += deltaTime;

        let distanceToCamera = distanceTo(camera.position, npc.position),
            patrollingAngle = (-npc.counter * .05) % 360,
            walkingCounter = (npc.counter * 2) % 360,
            angleToCamera = angleBetween(camera.position, npc.position);

        if (distanceToCamera < 10) npc.isPatrolling = false; else npc.isPatrolling = true;
        npc.position.y = Math.cos(walkingCounter) * .1 + 1.2;
        npc.leftFoot.rotation.x = npc.position.y - Math.PI * .4;
        npc.leftFoot.offset.y = Math.cos(npc.counter) * .05;
        npc.rightFoot.offset.y = -npc.leftFoot.offset.y;
        npc.rightFoot.rotation.x = -npc.leftFoot.rotation.x;

        if (npc.isPatrolling) {
            let xOffset = 3 * Math.cos(patrollingAngle), zOffset = 3 * Math.sin(patrollingAngle);
            npc.rotation.y = Math.atan2(xOffset, zOffset) + Math.PI * .5;
            npc.position.x = npc.spawnPosition.x + xOffset;
            npc.position.z = npc.spawnPosition.z + zOffset;
            npc.rightArm.rotation.x = 0;
        } else {
            let attackTime = (npc.counter % 4) / 4;
            npc.rotation.y = angleToCamera;
            if (distanceToCamera > 2) { npc.position.x += Math.sin(angleToCamera) * .1; npc.position.z += Math.cos(angleToCamera) * .1; }
            if (distanceToCamera < 3) npc.rightArm.rotation.x = (1 - easeInOutCubic(attackTime)) * 2.2;
            if (distanceToCamera <= 2 && attackTime > .9) {
                playerTargetHealth -= (3 - distanceToCamera) * 10 * deltaTime;
                playerHitFx();
                let newCameraPosition = add(camera.position, rotY(vector3(-.1, 0, -.1), angleToCamera));
                if (pointIsOnMap(newCameraPosition.x, newCameraPosition.z)) camera.position = newCameraPosition;
            }
            npc.spawnPosition = substract(npc.position, vector3(3 * Math.cos(patrollingAngle), npc.position.y, 3 * Math.sin(patrollingAngle)));
        }

        npc.parts.forEach(part => {
            part.rotation.y = npc.rotation.y;
            part.position = add(npc.position, part.offset);
        });

        npc.healthBar.scale.x = npc.health / 100;
        npc.healthBar.rotation.y = angleToCamera;

        if (npc.health <= 0) {
            npcKilledFx();
            SpawnPotionGlass(npc.position);
            for (let npcPart of npc.parts) meshes.splice(meshes.indexOf(npcPart), 1);
            showMessage('KILLED!', halfWidth + randomBetween(100), halfHeight + randomBetween(100), 80, 90);
            npcs.splice(npcs.indexOf(npc), 1);
        }
    });
}

createNpcPart = (meshPart, position, rotation, offset = vector3()) => { let part = Mesh(meshPart.v, meshPart.i, meshPart.c, clone(position), clone(rotation), vector3(1, 1, 1)); part.offset = offset; return part; }