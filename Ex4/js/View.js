function draw() {
    const ctx = canvas.getContext("2d");
    // ctx.lineWidth = 1;
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
        ctx.arc(x, y, b.radius + 1, 0, Math.PI * 2);
        // velo
        ctx.moveTo(x, y);
        ctx.lineTo(x + b.vx * k, y + b.vy * k );
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

    // draw links
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    for (let l of box.links) {
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
    }
    ctx.stroke();

    // print info
    ctx.fillText("t = " + khronos, 20, 20);
    ctx.fillText("Energy = " + box.SumEnergy, 120, 20);

}
