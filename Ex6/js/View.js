function drawAll(lineWidth=0.5)
{
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

    // draw dots (for debug)
    for (let b of box.balls) {
        if (!b.dots) continue;
        for (let d of b.dots) {
            if (!d) continue;
            ctx.strokeStyle = 'black';
            let x = box.x + d.x, y = box.y + d.y;
            ctx.strokeRect(x-1, y-1, 3, 3);
        }
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


    // print sum energy
    ctx.fillText("E = " + box.SumEnergy, 20, 20 );

    // draw selected objects
    if (box.balls.selected)
        drawSelectedBall(ctx);
    if (box.lines.selected)
        drawSelectedLine(ctx);
    if (box.links.selected)
        drawSelectedLink(ctx);

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
    ctx.strokeStyle = 'blue';
    ctx.moveTo(box.x + l.x1, box.y + l.y1);
    ctx.lineTo(box.x + l.x2, box.y + l.y2);
    ctx.stroke();
    ctx.restore();
}

function drawSelectedLink(ctx) {
    ctx.save();
    ctx.beginPath();
    let l = box.links.selected;
    ctx.strokeStyle = 'gray';
    ctx.moveTo(box.x + l.x1, box.y + l.y1);
    ctx.lineTo(box.x + l.x2, box.y + l.y2);
    ctx.stroke();
    ctx.restore();
}


function drawGrayCircle(p0, p) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    let x = box.x + p0.x, y = box.y + p0.y;
    let r = Math.round(G.dist(p0, p));
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    // print radius value
    ctx.fillText("R = " + r, box.x + p.x, box.y + p.y );

}

function drawGrayLine(p0, p) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(box.x + p0.x, box.y + p0.y);
    ctx.lineTo(box.x + p.x, box.y + p.y);
    ctx.stroke();
}

// иконка удаления на уменьшенном изображении
function drawRedCross() {
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(canvas.width, 10);
    ctx.lineTo(canvas.width - 100, 100);
    ctx.moveTo(canvas.width - 100, 10);
    ctx.lineTo(canvas.width, 100);
    ctx.stroke();
}

