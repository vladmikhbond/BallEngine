// главная программа
const box = new Box(100, 100, 600, 400);
box.addBall(new Ball(100, 150, 50, 'red', 3.3, 0 ));
box.addBall(new Ball(300, 100, 50, 'black', 0, 0));
box.start(draw);

const ctx = canvas.getContext("2d");

function draw() {
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let k = 20;

    // draw box
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // draw balls
    for (let b of box.balls) {
        ctx.beginPath();
        ctx.strokeStyle = b.color;
        let x = box.x + b.x, y = box.y + b.y;
        ctx.arc(x, y, b.radius, 0, Math.PI * 2);
        ctx.moveTo(x, y);
        ctx.lineTo(x + b.vx * k, y + b.vy * k );
        ctx.stroke();
    }
}
