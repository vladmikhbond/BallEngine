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
    for (let y = box.height, n = 0; y >= 0; y -= pixInMeter, n++) {
        ctx.fillText(n.toString(), 0, y + box.y );
    }
    //ctx.stroke();

    // draw balls
    for (let b of box.balls) {
        ctx.lineWidth = controller.selected === b ? 3 * lineWidth : lineWidth;
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
        ctx.strokeRect(x + b.vx * Kvelo - 0.5, y + b.vy * Kvelo - 0.5, 1, 1);
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
        ctx.lineWidth = controller.selected === l ? 3 * lineWidth : lineWidth;
        ctx.beginPath();
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
        ctx.stroke();
    }

    // draw links
    for (let l of box.links) {
        ctx.lineWidth = controller.selected === l ? 3 * lineWidth : lineWidth;
        ctx.strokeStyle = l.transparent ? "lightgray" : "gray";
        ctx.beginPath();
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
        ctx.stroke();
    }

    // print info
    let sec = (chronos/ 1000 * INTERVAL).toFixed(2);
    ctx.fillText("T = " + sec, 20, 20 );
    ctx.fillText("E = " + box.SumEnergy, 120, 20 );
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
        if (l.transparent)
            continue;
        ctx.moveTo(box.x + l.x1, box.y + l.y1);
        ctx.lineTo(box.x + l.x2, box.y + l.y2);
    }
    ctx.stroke();


    // draw balls
    for (let b of box.balls) {
        ctx.save();
        let img = b.color === "red" ? redBallImg : b.color === "blue" ? blueBallImg : greenBallImg;
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

    // print info
    let sec = chronos / 1000 * INTERVAL | 0;
    ctx.fillText("T = " + sec, 20, 20 );
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
    // иконка удаления
    let w = 150, x = canvas.width - w - box.x, y = box.y;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 5;
    ctx.clearRect(x, y, w, w);
    ctx.strokeRect(x, y, w, w);

    let d = 30;
    x += d, y += d, w -= 2 * d;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + w);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x, y + w);
    ctx.stroke();

    // иконка подписи
    w = 150, x = canvas.width - w - box.x, y = canvas.height - w;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "gray";
    ctx.clearRect(x, y, w, w);
    ctx.strokeRect(x, y, w, w);

    d = 20, x += d, y += d, w -= 2 * d;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x + d, y + d);
    ctx.lineTo(x + w, y + d);
    ctx.moveTo(x + (d + w)/2, y + d);
    ctx.lineTo(x + (d + w)/2, y + w);
    ctx.stroke();

}

