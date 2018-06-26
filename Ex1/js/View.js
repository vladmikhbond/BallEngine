
function drawAll() {
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw box
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // draw balls
    for (let b of box.balls) {
        ctx.beginPath();
        ctx.strokeStyle = b.color;
        ctx.arc(box.x + b.x, box.y + b.y, b.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}
