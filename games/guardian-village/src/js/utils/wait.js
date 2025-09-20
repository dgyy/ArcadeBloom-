export default (times, s, stepCall) => {
    return new Promise((resolve, reject) => {
        let rtimes = 0;
        let si = setInterval(async () => {
            rtimes += 1;
            await stepCall(rtimes / times);
            if (rtimes > times) {
                clearInterval(si);
                resolve();
            }
        }, s);
    });
};

export const increaseStep = (initialSpeed, outStep,stepCallBack, endCallBack) => {
    let step = 0;
    let speed = initialSpeed;
    let intervalId;
    function incrementStep() {
        step += speed;
        if (step >= outStep) {
            clearInterval(intervalId);
            endCallBack()
            
        } else {
            stepCallBack(step/outStep);
        }
        console.log(step)
    }
    function startIncreasing() {
        intervalId = setInterval(incrementStep, 50);
    }
    function setSpeed(newSpeed) {
        speed += newSpeed;
    }
    return {
        start: startIncreasing,
        addSpeed: setSpeed
    };
}