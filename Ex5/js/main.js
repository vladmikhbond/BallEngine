// главная программа
const box = new Box(100, 100, 600, 400);
//box.addBall(new Ball(100, 150, 50, 'red', 3.3, 0 ));
box.addBall(new Ball(300, 100, 50, 'black', 5, 3));
box.start(draw);

const ctx = canvas.getContext("2d");

function draw() {
    // ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw box
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // draw balls
    for (let b of box.balls) {
        drawBall(b);
    }
    // print sum energy
    ctx.fillText("E = " + box.SumEnergy, 20, 20 );
}

function drawBall(b) {
    let Kv = 20;

    ctx.beginPath();
    ctx.save();

    let x = b.x + b.box.x, y = b.y + b.box.y;

    if (b.dot) {
        // показываем деформацию
        let alpha = Math.atan2(b.dot.y - b.y, b.dot.x - b.x);
        let k =  1 - G.dist(b.dot, b) / b.radius;

        ctx.translate(x, y);
        ctx.rotate(alpha);
        ctx.scale(k, 1/k);
        ctx.rotate(-alpha);

        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    }
    else
    {
        ctx.arc(x, y, b.radius, 0, Math.PI * 2);
    }
    ctx.restore();

    ctx.moveTo(x, y);
    ctx.lineTo(x + b.vx * Kv, y + b.vy * Kv );
    ctx.stroke();

}