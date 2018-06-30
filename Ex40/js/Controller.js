function setListeners(box) {

    canvas.addEventListener("click", function (e) {
        let p = {x: e.pageX - this.offsetLeft - box.x,
                 y: e.pageY - this.offsetTop - box.y };

        let sel = null

        // select ball
        for (let b of box.balls) {
            if (G.dist(p, b ) < b.radius) {
                sel = b;
                break;
            }
        }
        // select line
        for (let l of box.lines) {
            if (G.distToInfiniteLine(p, l) < 5) {
                sel = l;
                break;
            }
        }
        // select link
        for (let link of box.links) {
            let l = new Line(link.x1, link.y1, link.x2, link.y2 );
            if (G.distToInfiniteLine(p, l) < 5) {
                sel = link;
                break;
            }
        }

        if (!sel) {
            // let o = JSON.parse(prompt("", box.selected.toString()));
            // if (o.name === "Ball") {
            //     let b = box.selected;
            //     b.x = o.x; b.y = o.y; b.vx = o.vx; b.vy = o.vy;
            // }
        } else {
            box.selected = sel;
            drawAll();
        }

    })



}