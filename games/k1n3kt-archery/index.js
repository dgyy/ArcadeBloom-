// MIT License - Copyright 2023 Artur Augusto Martins

// order matters for pixel colision detection
// we first need arrows than monsters, so 
// we can check if arrow pixel is on monster
let entities = arrows.concat(monsters)

let bowAngle;
let stream;

// game state
let gs = {
    pts: 0,
    time: 0,
    time0: 0,
    showHighScore: false,
    maxTime: 60
}

let newGame = () => {
    msgsTxt.splice(0)
    gs.pts = 0
    gs.time0 = Math.floor(performance.now()/1000)
    gs.showHighScore = false
}

let msgsTxt = []

let buildTxtEntities = (x, y, txt) => {
    // console.log(txt)
    let textSpc = 0
    return txt.split("").reverse().map(l => {
        let sprite = letters[l.toUpperCase()]
        let o = {
            sprite: sprite,
            life: 1,
            x: x+textSpc,
            y: y,
            speed: 0,
            theta: 0
        }
        textSpc += sprite[0].length + 1
        return o
    })
}


// let do_nms = true;

// Function to handle getUserMedia API
async function getCameraStream(constraints) {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (err) {
        console.error("Error accessing webcam: ", err);
    }
}

// Populate the dropdown list with available cameras
async function populateCameraList() {
    const cameraSelect = document.getElementById("cameraSelect");
    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
        if (device.kind === "videoinput") {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.text = device.label || `Camera ${cameraSelect.length + 1}`;
            cameraSelect.appendChild(option);
        }
    }
}

// Start the webcam stream and apply blur and edge detection
function startWebcam() {
    newGame()


    const cameraSelect = document.getElementById("cameraSelect");
    const deviceId = cameraSelect.value;
    const constraints = { video: { deviceId: { exact: deviceId } } };
    const canvas = document.getElementById("cvCanvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    getCameraStream(constraints).then(() => {
        document.getElementById('cameraSelectContainer').remove()
        // hold state of keys
        let keysState = {
            "space": null
        }

        let bowTension = 0
        let arrowStringX = 0
        let arrowStringY = 0

        window.addEventListener("keypress", (e) => {
            // charge on space keypress
            if (e.code === "Enter") {
                newGame()
            } else if (e.code === "Space") {
                keysState.space = true
            } else e.preventDefault()
        })

        
        window.addEventListener("keyup", (e) => {
            // shot on space keypress
            if (e.code === "Space") {
                if (keysState.space && bowTension > 10) {

                    let arrow = arrows
                    .filter(a => !a.life)[0]
                    if (arrow && bowAngle !== undefined) {
                        // xcorrection is due the displacement of sprite inside its rotation matrix (?!)
                        let xcorrection = (arrowsSprite[0].length*Math.cos(bowAngle+Math.PI))
                        
                        arrow.x = arrowStringX - arrowsSprite[0].length/2 + xcorrection
                        arrow.y = arrowStringY-arrowsSprite.length-3
                        arrow.theta = bowAngle
                        arrow.sprite = rotateMat(arrowsSprite, bowAngle+Math.PI/2)
                        arrow.life = 1
                        arrow.speed = (bowTension*bowTension)/40
                    }
                    // console.log('shot!', arrow.speed)
                    if (arrow.speed > 15) {
                        monsters.filter(monster => monster.life > 0).forEach(entity => entity.speed += randomInteger(0, 1))
                        zzfx(...[1.9,,178,.02,.14,.16,,.8,-6.7,-0.2,,,,,,,.22,.74,.05,.38]);
                    } else {
                        zzfx(...[2.07,,97,.02,.08,.09,,.92,-6.7,.2,,,,,,,.22,.74,.04,.38]);
                    }
                }
                keysState.space = false
            } else e.preventDefault()
        })


        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();


        function captureFrame() {
            gs.time = Math.floor(performance.now()/1000) - gs.time0

            if (gs.time > gs.maxTime && !gs.showHighScore) {
                gs.showHighScore = true
                msgsTxt.splice(0)
                msgsTxt.splice(msgsTxt.length, 0, ...buildTxtEntities(40, 40, 'time out !'))
                window.setTimeout(() => {
                    let lsHighscore = window.localStorage.getItem('highscore')
                    if (!lsHighscore || gs.pts > parseFloat(lsHighscore)) {
                        window.localStorage.setItem('highscore', gs.pts)
                        msgsTxt.splice(msgsTxt.length, 0, ...buildTxtEntities(40, 50, `new high score!`))
                    } else {
                        msgsTxt.splice(msgsTxt.length, 0, ...buildTxtEntities(40, 50, `actual high score: ${lsHighscore}`))
                    }
                    msgsTxt.splice(msgsTxt.length, 0, ...buildTxtEntities(40, 60, 'press enter to play again'))
                }, 1500)
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Apply blur
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applyGaussianBlur(imageData);
            // applyGaussianBlur(imageData);

            // Apply edge detection
            applyEdgeDetection(imageData);

            nms(imageData)

            // Apply Otsu's thresholding
            applyOtsuThreshold(imageData);

            let psize = 8 
            for (let i = 0; i < imageData.height; i++) {
                for (let j = 0; j < imageData.width; j++) {

                    // set cam image color
                    let val = getFlatlc(imageData.data, i, j*4, imageData.width*4);
                    if (val) {
                        setFlatlc(imageData.data, i, j*4+3,   imageData.width*4, 60)
                    }

                    // pad image
                    if (i<psize || j<psize || i>imageData.height-psize || j>imageData.width-psize) {
                        setFlatlc(imageData.data, i, j*4,   imageData.width*4, 0)
                        setFlatlc(imageData.data, i, j*4+1, imageData.width*4, 0)
                        setFlatlc(imageData.data, i, j*4+2, imageData.width*4, 0)
                    }
                }
            }

            // increment arc tension if space is pressed
            if (keysState.space) {
                bowTension = Math.min(bowTension+1, 25)
                if (bowTension === 5) {
                    zzfx(...[.25,,138,.05,.17,.14,1,.5,,.3,100,,,,,,,.8,.1,.27]);
                }
            } else {
                bowTension = Math.max(bowTension-10, 0)
            }
            

            let arcx, arcy, string1y, string2y
            let lines = houghLines(imageData)

            // draw grass
            let rnd = seedRand(123)
            for (let i = imageData.height - 1; i >= 0; i--) {
                for (let j = imageData.width - 1; j >= 0; j--) {
                    let val = Math.floor(rnd() * (90 - 100 + 1)) + 90;
                    if (j < 2 || j > imageData.width-3) {
                        setFlatlcRgba(imageData.data, Math.ceil(i), Math.ceil(j)*4+0, imageData.width*4, val, val/2, val/3, 255)
                        continue
                    }
                    if (!getFlatlc(imageData.data, i, j*4, imageData.width*4)) {
                        // if (val < 82) {
                        //     setFlatlcRgba(imageData.data, Math.ceil(i), Math.ceil(j)*4+0, imageData.width*4, val, 0, 0, 255)
                        // } else {
                        //     setFlatlcRgba(imageData.data, Math.ceil(i), Math.ceil(j)*4+0, imageData.width*4, 0, val, 0, 255)
                        // }

                        setFlatlcRgba(imageData.data, Math.ceil(i), Math.ceil(j)*4+0, imageData.width*4, 0, val, 0, 255)
                    }
                }
            }


            if (lines.length) {
                lines
                .filter(l => l.theta > 0.4 && l.theta < 2.6)
                // .sort((a, b) => b.theta - a.theta)
                .slice(0, 2)
                .sort((a, b) => b.p - a.p)
                .slice(0, 1)
                // .filter(l => l.score > 10)
                .forEach(line => {
                    // console.log(line.p, line.score)
                    // if (line.score < 20) {
                    //     console.log('aqui')
                    //     do_nms = !do_nms
                    // }
                    // console.log(line.score)
                    // console.log(line.theta)
                    
                    bowAngle = line.theta
                    // bowAngle = Math.PI/2 // for testing
                    
                    // draw detected line
                    for (let x = 0; x < imageData.width-1; x+=0.02) {
                        let theta = bowAngle
                        if (theta === 0) theta += 0.01
                        let p = line.p
                        let y = Math.ceil((p-x*Math.cos(theta))/Math.sin(theta))
                        let x2 = x
                        let y2 = y
                        if (getFlatlc(imageData.data, y2, Math.ceil(x2)*4, imageData.width*4) !== undefined) {
                            setFlatlcRgba(imageData.data, y2, Math.ceil(x2)*4+0, imageData.width*4, 0, 255, 0, 40)
                        }
                    }

                    // intersection

                    // get bow line points
                    let p = line.p + bowTension
                    let theta = bowAngle
                    
                    let x1 = 0
                    let y1 = Math.ceil((p-x1*Math.cos(theta))/Math.sin(theta))

                    let x2 = canvas.width
                    let y2 = Math.ceil((p-x2*Math.cos(theta))/Math.sin(theta))

                    string1y = y1
                    string2y = y2
                    
                    // get aim line points
                    let x3 = canvas.width/2
                    let y3 = canvas.height-10

                    let x4 = x3 - 10 * Math.cos(bowAngle)
                    let y4 = y3 - 10 * Math.sin(bowAngle)

                    // compute intersection
                    ;[arcx, arcy] = intersection(x1, y1, x2, y2, x3, y3, x4, y4)

                    
                    // draw intersection
                    // setFlatlcRgba(imageData.data, Math.ceil(arcy), Math.ceil(arcx)*4+0, imageData.width*4, 0, 0, 255, 255)

                })
            }

            // summon chickens
            monsters
            .filter(monster => monster.life === 0 && !gs.showHighScore).slice(0, 2)
            .forEach(monster => {
                // revive a monster
                if (!randomInteger(0, 80)) {
                    zzfx(...[2,,464,,.15,.13,,2.81,-15,,,,,,,,.14,.09,.08]);
                    monster.life = 1
                    monster.x = randomInteger(0, canvas.width - monster.sprite[0].length)
                    monster.y = 0
                    monster.t = 0
                    monster.theta = -Math.PI/2 + randomInteger(-(Math.PI/4)*100, (Math.PI/4)*100)/100
                    monster.speed = randomInteger(1, 2)/2
                }
            })

            // draw points
            let textSpc = 0
            let ptsTxtEntities = `${gs.pts} pts`.split("").reverse().map(l => {
                let sprite = letters[l.toUpperCase()]
                let o = {
                    sprite: sprite,
                    life: 1,
                    x: 20+textSpc,
                    y: 10
                }
                textSpc += sprite[0].length + 1
                return o
            })

            let ptsTxtEntitiesRed = ptsTxtEntities.map(o => {
                return Object.assign({}, 
                o,
                {
                    // turn font color red
                    sprite: o.sprite.map(row => row.map(c => c ? 'd' : c)),
                    y: o.y-1,
                    // x: o.x-1
                })
            })                        

            // draw time
            textSpc = 0
            let timeTxtEntities = `${Math.min(gs.maxTime, gs.time)}`.split("").reverse().map(l => {
                let sprite = letters[l.toUpperCase()]
                let o = {
                    sprite: sprite,
                    life: 1,
                    x: 20+textSpc,
                    y: 20
                }
                textSpc += sprite[0].length + 1
                return o
            })



            // draw entities
            entities.concat(ptsTxtEntitiesRed, ptsTxtEntities, timeTxtEntities, msgsTxt)
            // .filter(entity => entity.life > 0)
            .filter(entity => entity.life !== 0)
            .forEach(entity => {
                entity.t += 1
                let sprite = entity.sprite
                
                if (entity.type === 'monster') {
                    // random change direction only if is not going back
                    if (entity.life > 0 && !randomInteger(0, 40)) {
                        entity.theta = -Math.PI/2 + randomInteger(-(Math.PI/3)*100, (Math.PI/3)*100)/100
                    }
                    let isRev = entity.theta > -Math.PI/2 ? true : false
                    
                    if (entity.t < 3*(1/entity.speed*4)) {
                        sprite = isRev ? monstersSprites2 : monstersSprites2Rev
                    } else if (entity.t < 3*(1/entity.speed*8)) {
                        sprite = isRev ? monstersSprites3 : monstersSprites3Rev
                    } else {
                        entity.t = 0
                        sprite = isRev ? monstersSprites : monstersSpritesRev
                    }
                                                
                    if (entity.x < 0) entity.theta -= Math.PI/3
                    if ((entity.x+sprite[0].length) > canvas.width) entity.theta += Math.PI/3

                }
                sprite.forEach((row, y) => {
                    row.forEach((col, x) => {
                        let offsetx = entity.x
                        let offsety = entity.y
                        
                        // draw pixels
                        let rgba = colorPallete[col]
                        let x2 = Math.ceil(offsetx+x)
                        let y2 = Math.ceil(offsety+y)
                        
                        // paint only if on stage
                        if (x2 < canvas.width && y2 < canvas.height && x2 >= 0 && y2 >= 0) {
                            setFlatlcRgba(imageData.data, y2, x2*4, imageData.width*4, ...rgba)
                        }
                        
                        if (entity.type === 'monster') {
                            // detect colision with point of arrow or wood of arrow
                            let redChOnStage = getFlatlc(imageData.data, y2, x2*4, imageData.width*4)
                            if (redChOnStage === colorPallete['s'][0] || redChOnStage === colorPallete['m'][0]) {
                                // entity.life -= 10000
                                // entity.x = Math(x2)
                                // entity.y = (y2-5)
                                entity.theta = Math.abs(entity.theta)
                                entity.speed = 10
                                entity.life = -1
                                zzfx(...[0.4,,entity.y,,.02,.02,1,1.32,-49,,,,,.1,5.3,,,.86,.01]); // Blip 79
                                if (!gs.showHighScore) {
                                    gs.pts += 5;
                                }
                                // console.log('ouch!')
                            }
                        }
                    })
                })

                // entity.life === -1 when chicken is going back
                if (entity.type === 'monster') {
                    
                    if (entity.y > canvas.height || (entity.y+sprite.length-1) < -2) {
                        entity.life = 0
                    }
                    
                    // life === -1 chicken is going back. Dont allow a angle to go foward
                    if (entity.life === -1) entity.theta = Math.abs(entity.theta)
                }
                
                // move entity
                entity.x -= entity.speed * Math.cos(entity.theta)
                entity.y -= entity.speed * Math.sin(entity.theta)
            })


            // radius parameter to draw the bhow arc
            let radiusX = 10+bowTension
            let radiusY = 40-bowTension

            // point of arrow and bow string contact
            arrowStringX = arcx + bowTension*Math.cos(bowAngle)
            arrowStringY = arcy + bowTension*Math.sin(bowAngle)

            // draw aim line
            let xaim = canvas.width/2
            let yaim = canvas.height-10
            
            // alternative, draw from arrow and string point
            // let xaim = arrowStringX
            // let yaim = arrowStringX
            
            for (let i = 0; i < 500; i++) {
                xaim -= 4 * Math.cos(bowAngle)
                yaim -= 4 * Math.sin(bowAngle)
                if (xaim < canvas.width-1 && yaim < canvas.height-1 && xaim >= 0 && yaim >= 0) {
                    setFlatlcRgba(imageData.data, Math.ceil(yaim), Math.ceil(xaim)*4+0, imageData.width*4, 254, 0, 0, 255)
                } else break
            }


            // put computed data on canvas
            ctx.putImageData(imageData, 0, 0);

            // the arc
            ;["#c6a141", "#7f6116"].forEach((color, i) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(arcx+i, arcy+i, radiusX, radiusY, bowAngle,  Math.PI/2, -Math.PI/2);
                ctx.stroke();
            })

            // the bow string bs
            ctx.strokeStyle = "white"
            ;[Math.PI/2, -Math.PI/2].forEach(rad => {
                let bsx = radiusX * Math.cos(rad)
                let bsy = radiusY * Math.sin(rad)
                let bsx2 = bsx * Math.cos(bowAngle) - bsy * Math.sin(bowAngle)
                let bsy2 = bsx * Math.sin(bowAngle) + bsy * Math.cos(bowAngle)

                ctx.lineWidth = 1

                ctx.beginPath()
                // the limb of bow
                ctx.moveTo(bsx2+arcx, bsy2+arcy)
                // the center of string
                ctx.lineTo(arrowStringX, arrowStringY)
                ctx.stroke()
            })


            requestAnimationFrame(captureFrame);
        }
        gs.time0 = Math.floor(performance.now()/1000)
        captureFrame();
    });
}

// Event listener for the camera selection
document.getElementById("cameraSelect").addEventListener("change", () => {
    const startButton = document.getElementById("startButton");
    startButton.disabled = false;
});

// Event listener for the start button
document.getElementById("startButton").addEventListener("click", () => {
    const startButton = document.getElementById("startButton");
    startButton.disabled = true;
    startWebcam();
});

// Populate the camera list when the page loads
populateCameraList();