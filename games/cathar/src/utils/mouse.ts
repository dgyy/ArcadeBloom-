function getElementPosition(el: any) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }

    return {
        x: xPos,
        y: yPos
    };
}

let mouseX = 0;
let mouseY = 0;
let buttonPressed = -1;

function initMouse(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX - getElementPosition(canvas).x;
        mouseY = e.clientY - getElementPosition(canvas).y;

    }, false);

    canvas.addEventListener("mousedown", (e) => {
        buttonPressed = e.button;
    }, false);

    canvas.addEventListener("mouseup", () => {
        buttonPressed = -1;
    }, false);
}

function mousePosition() {
    return {x: mouseX, y: mouseY}
}

function mousePressed(button: number) {
    return buttonPressed === button;
}

export {mousePressed};
export {mousePosition};
export {initMouse};
export {getElementPosition};
