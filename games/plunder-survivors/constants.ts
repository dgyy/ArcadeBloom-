import Boat from "./boat";

export const PIXEL_SIZE = 5;
export const GLOBAL:{
   time: number,
    timeLeft: number,
    absoluteTime: number,
    nextWaveInTime: number,
    player: Boat
}=  {
    time: 0,
    timeLeft: 0,
    absoluteTime: 0,
    nextWaveInTime: 0,
    player: null
}