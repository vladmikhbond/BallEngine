

function drawAll(lineWidth=0.5) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = lineWidth;
    let velo = 50;

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
        ctx.lineTo(x + b.vx * velo, y + b.vy * velo );
        ctx.stroke();
    }

    // draw lines
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (let l of box.lines) {
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
    }
    ctx.stroke();

    // print sum energy
    ctx.fillText("E = " + box.SumEnergy, 20, 20 );

    if (box.balls.selected)
        drawSelectedBall(ctx);
    if (box.lines.selected)
        drawSelectedLine(ctx);

}

function drawSelectedBall(ctx) {
    ctx.save();
    ctx.beginPath();
        let b = box.balls.selected;
        ctx.strokeStyle = b.color;
        let x = box.x + b.x, y = box.y + b.y;
        ctx.arc(x, y, b.radius + 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function drawSelectedLine(ctx) {
    ctx.save();
    ctx.beginPath();
    let l = box.lines.selected;
    //ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.moveTo(box.x + l.x1, box.y + l.y1);
    ctx.lineTo(box.x + l.x2, box.y + l.y2);
    ctx.stroke();
    ctx.restore();
}


function drawCircle(p0, p) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    let x = box.x + p0.x, y = box.y + p0.y;
    let r = Math.round(G.dist(p0, p));
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    // print sum energy
    ctx.fillText("R = " + r, box.x + p.x, box.y + p.y );

}

function drawLine(p0, p) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(box.x + p0.x, box.y + p0.y);
    ctx.lineTo(box.x + p.x, box.y + p.y);
    ctx.stroke();
}

