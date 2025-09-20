import { createBox, createSdf, createSphere } from "../sdfBuilder";
import { sdfBakeToTexture } from "../sdfMapper";
import { drawSdfSprite, initRenderer, renderGameFrame, viewMatrix } from "../renderer";
import * as SdfBuilderOps from "../sdfBuilderOps";
import { identityQuaternion, mat4LookAt, quat, quatFromAxisAngle, quatMul, vec3, vecClone, vecCopy, vecLength, vecMulK, vecNormalize, vecNormalizeSafe, yAxis, zAxis } from "../juvec";
import * as MaterialIds from "../materialIds";
import { Deg } from "../aliasedFunctions";
import { buildCalliSlab, buildKukulHead, buildNahuiOllinBody } from "~sdfSprites";

let lastTimestamp = -1;
let ts = 0;

let mouseDownPos: (number[] | null);
let mouseDelta = [0, 0];

let finalQuat = quat();
let viewQuat = vecClone(identityQuaternion);
let movementViewQuat = vecClone(identityQuaternion);

const mainLoop = (timestamp: number) => {
    let dts = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    ts += dts;

    if (mouseDownPos) {
        const alpha = Math.sqrt(mouseDelta[0] * mouseDelta[0] + mouseDelta[1] * mouseDelta[1]) / 300;
        const axis = vec3(-mouseDelta[1], mouseDelta[0], 0);
        const len = vecLength(axis);
        if (len > 0) {
            vecMulK(axis, 1 / len, axis);
            quatFromAxisAngle(axis, alpha, movementViewQuat);
        }
    }

    quatMul(movementViewQuat, viewQuat, finalQuat);

    drawSdfSprite(0, vec3(0, 0, 0), 2, finalQuat);

    mat4LookAt(vec3(0, 0, 5), vec3(0, 0, 0), yAxis, viewMatrix);
    renderGameFrame(ts);

    window.requestAnimationFrame(mainLoop);
};

const bakeSdf = () => {
    let model = buildCalliSlab();
    return sdfBakeToTexture(model, 0);
};

window.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('mousemove', (event: MouseEvent) => {
        if (mouseDownPos) {
            mouseDelta[0] = event.clientX - mouseDownPos[0];
            mouseDelta[1] = mouseDownPos[1] - event.clientY;
        }
    }, true);

    window.addEventListener('mouseup', (event: MouseEvent) => {
        mouseDownPos = null;
        quatMul(movementViewQuat, viewQuat, finalQuat);
        vecCopy(viewQuat, finalQuat);
        vecCopy(movementViewQuat, identityQuaternion);
        localStorage.setItem("viewQuat", viewQuat.join(","));
    }, true);


    window.addEventListener('mousedown', (event: MouseEvent) => {
        mouseDownPos = [event.clientX, event.clientY];
        mouseDelta[0] = 0;
        mouseDelta[1] = 0;
    }, true);


    initRenderer().then(() => {
        const viewQuatStr = localStorage.getItem("viewQuat");
        if (viewQuatStr) {
            vecCopy(viewQuat, viewQuatStr.split(",").map(x => parseFloat(x)) as any);
        }
        bakeSdf().then(() => {
            window.requestAnimationFrame(mainLoop);
        });
    });
});