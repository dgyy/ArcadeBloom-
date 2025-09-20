messages = [];

showMessage = (text, x, y, size = 50, duration = 1000000, delay = 0) => messages.push({ text, x, y, size, duration, delay, counter: 0, ySpeed: Math.max(random(3), 1) });

updateMessages = () => {
    messages.forEach((message, i) => {
        if (message.delay-- > 0) return;
        message.counter += 1;
        context.font = `${message.size}px ${font}`;
        context.textAlign = 'center'
        context.textBaseline = "middle";
        if (message.duration < 100) message.y -= message.ySpeed;

        if (message.counter <= 20) context.fillStyle = `rgba(255,255,255,${message.counter / 20})`;
        if (message.counter > 20 && message.counter <= message.duration - 60) context.fillStyle = "white";
        if (message.counter > message.duration - 60) context.fillStyle = `rgba(255,255,255,${(-(message.counter - message.duration) / 60)})`;

        context.fillText(message.text, message.x, message.y);
        if (message.counter > message.duration) messages.splice(i, 1);
    });
}

const font = '"Chalkboard", "ChalkboardSE-Regular", "Marker Felt", "Bradley Hand",  "Ink Free","Segoe Script",cursive, "Comic Sans MS", sans-serif';

