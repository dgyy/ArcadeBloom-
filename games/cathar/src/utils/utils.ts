import {Vector} from "kontra";
import {PenColor} from "./colorize";

function getRandomVecDir() {
    return Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
}

let canvasWidth: number;
const getCanvasWidth: () => number = () => canvasWidth;

let canvasHeight: number = 0;
const getCanvasHeight: () => number = () => canvasHeight;

const getCanvasCenter: () => Vector = () => Vector(canvasWidth/2, canvasHeight/2)

function setCanvasBoundaries(canvas: HTMLCanvasElement){
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

const wallHeight = 60;

const randNumber = (num: number) => 0.9 * num + Math.random() * 0.1 * num;

function levelToColor(lvl: number){
    if(lvl <= 3) return PenColor.Green;
    if(lvl <= 6) return PenColor.Blue;
    return PenColor.Red;
}

const imageSrc = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEtJREFUWIXNV19MW1Uc/g7yYNSmZEmTUdDiIkyiGNvGDGYXKCYmg7Bo1rDMNJmVtS/Mf8sG0T2YiNMACU42JbYi8MS2tNlDM/swGSxgZrJQjGwpDLN1iFSzZHLFwYNZfj7Uczj39t5bij74JeT8+c4533d+53fOLUABWJlL0Mpcgoz4nvZa6mmvNeT1wHglHe1UTazwdTO5HTmoXjg4+r2K72mvpTd9TTgd/QYA0PG5ms+3PtLRTnLYbcRLrdOFsVFy2G3ES614T3stOew2Wh//UHe+0fqbjsDC2KiKr3zpoOD9fj9F2qoAQDcCfr+fPnqlTGWIr88AoKGhgcrLy1UDlpaWMDExwQAgEAjQ2dg1LM59gZXULyipLkPHiSEMDQ2J+RaLBVarFQDwnPUnTC7aEI/HGQC0tLQQ5zgURUE8HmdF2lAZ4djbr6J/4BJKqsvQP3DJdOyPylO6/Yqi4MveY1AURfQVAcDwkV05g+W+9/0vizoXl/sSHzRidXUViqKIv/NHX8gRPxvuwtr6Gr7+7D3RL87JYbfRneW7TFsHsiG+ffMGnqx6BgBw++YNyDwfY7FYRJuHn+N+5gdaW18TbduO3Rs5AGQzmde1V0gLR302Ye9c6TYdtxkUyeJN3lY0eVtxPdpn+Jg46jtpK8L0G3TXFEnY5G1F81ufAIAoZWyvP0nb609uSRwAwsPHdfuLgI2QX+zPJgcvtfj1ygld8TM+0Bkf6FYqSbdSyYKe4mIAaPQGqOvcHwCATGYZpaV2NHoDdHl8SFewpGqfSuRIFOwdL2g5kwEATF2+SJ7GZtXcv671GhuQcbrvNXzcO5HXuZJJqdqnxsFOjTfnnacFA4Dr0T568IQLALD6531YHnsUDy0m8azvKAOyO364dJfhEfwncNhtNJa4QGOJCzkfk5KqfaQN+/8KRLRlc5v6FrRFiKIuF0VdLgKAqMtF8wfaSBYnIl1exr3JMN2bDBNfE5BeQjNxXu/49jBmF2YEV1PpxM5zg4yIKOZ2o6bSqcvLBgDg+Fxw8xEYDDIGAHsH3JhdmEFNpVNwXCzmdou2lpd3vW1PiAFA79MRsTYDsg8JADR1JQEAO6pdOZHh4ZXhSyaZGb9/ehq/T0VEe9ueENOaKehaySKyuBnPBbXgBgqG3k6BjWQ04vlRGBkqGP/m6skoPjS9JBYacZdvOiyHvzLn2yJEg0HGXJ46U6MqQTMzoTqn4B68kRT9g0HGQnVOCl+dEePlqzszstvUKOOiWkHe/3z3AQBA6ueNn1PhqzOM71A2pzVhFIEK612kFVvWAO+MxBI0VVGTs/tPW18kPQOm25KQ7wiK5odDND8cIgDwpGfhSc8iEktQJGb8P2CozknykehlvtFt0KJ45+thdmh6iTzpWQT3793y5zafoBx2lQEgG/IRDSES8p8cqH78EcG9e/67HKPah0lrSE8ckJJQi0KupBny5cDfcNU6ps0rXLoAAAAASUVORK5CYII="
const img = document.createElement("img");
img.src = imageSrc;

const imageSrc2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAACVJREFUGJVjYKAPKHBk+I9LjmVKCETy3vVzGIqUNI0YCZpAOQAAe4QJTDUodxAAAAAASUVORK5CYII="
const img2 = document.createElement("img");
img2.src = imageSrc2;
export {getRandomVecDir, randNumber, setCanvasBoundaries, getCanvasWidth, getCanvasHeight, getCanvasCenter, wallHeight, levelToColor, img, img2}