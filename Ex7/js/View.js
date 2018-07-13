function drawAll(lineWidth=0.5)
{
    if (PRETTY)
        return drawPretty();

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = lineWidth;

    // draw box
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // draw scale
    ctx.beginPath();
    for (let y = 0, n = 0; y < box.height; y += pixInMeter) {
        ctx.moveTo(1, y + box.y);
        ctx.lineTo(5, y + box.y );
    }
    ctx.stroke();

    // draw balls
    for (let b of box.balls) {
        ctx.lineWidth = box.balls.selected === b ? 3 * lineWidth : lineWidth;
        ctx.strokeStyle = b.color;
        ctx.beginPath();
        let x = box.x + b.x, y = box.y + b.y;
        if (b.dots && b.dots.length > 0) {
            let dot = b.dots[0];
            // показываем деформацию
            let alpha = Math.atan2(dot.y - b.y, dot.x - b.x);
            let kr = G.dist(dot, b) / b.radius;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(alpha);
            ctx.scale(kr, 1/kr);
            ctx.rotate(-alpha);
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.restore();        }
        else
        {
            ctx.arc(x, y, b.radius, 0, Math.PI * 2);
        }
        // draw velocity
        ctx.strokeRect(x + b.vx * Kvelo - 0.5, y + b.vy * Kvelo - 0.5, 1, 1)
        ctx.moveTo(x, y);
        ctx.lineTo(x + b.vx * Kvelo, y + b.vy * Kvelo );
        ctx.stroke();
    }

    // draw dots (for debug)
    for (let b of box.balls) {
        if (!b.dots) continue;
        for (let d of b.dots) {
            if (!d) continue;
            ctx.strokeStyle = 'black';
            let x = box.x + d.x, y = box.y + d.y;
            ctx.strokeRect(x-0.5, y-0.5, 1, 1);
        }
    }

    // draw lines
    ctx.strokeStyle = "blue";
    for (let l of box.lines) {
        ctx.beginPath();
        ctx.lineWidth = box.lines.selected === l ? 3 * lineWidth : lineWidth;
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
        ctx.stroke();
    }

    // draw links
    ctx.strokeStyle = "gray";
    for (let l of box.links) {
        ctx.beginPath();
        ctx.lineWidth = box.links.selected === l ? 3 * lineWidth : lineWidth;
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
        ctx.stroke();
    }

    // print sum energy
    ctx.fillText("E = " + box.SumEnergy, 20, 20 );
    ctx.fillText("MV = " + box.SumMomentum, 120, 20 );
}


function drawPretty() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw box
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // draw links
    ctx.lineWidth = 3;
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    for (let l of box.links) {
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
    }
    ctx.stroke();


    // draw balls
    for (let b of box.balls) {
        ctx.save();
        let img = redBallImg;
        let x = box.x + b.x, y = box.y + b.y;

        if (b.dots && b.dots.length > 0) {
            let dot = b.dots[0];
            // показываем деформацию
            let alpha = Math.atan2(dot.y - b.y, dot.x - b.x);
            let kr = G.dist(dot, b) / b.radius;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(alpha);
            ctx.scale(kr, 1 / kr);
            ctx.rotate(-alpha);

            ctx.translate(-b.radius, -b.radius);
            let k = 2 * b.radius / img.width;
            ctx.scale(k, k);
        }
        else
        {
            ctx.translate(x - b.radius, y - b.radius);
            let k = 2 * b.radius / img.height;
            ctx.scale(k, k);
        }
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    // draw lines
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (let l of box.lines) {
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
    }
    ctx.stroke();

}

//<editor-fold desc="Gray objects drawing">

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

//</editor-fold>

// иконка удаления на уменьшенном изображении
//
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

