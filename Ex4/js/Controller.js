function setListeners(box) {

    canvas.addEventListener("click", function (e) {
        let p = {x: e.pageX - this.offsetLeft - box.x,
                 y: e.pageY - this.offsetTop - box.y };

        box.selected = null;

        // select ball
        for (let b of box.balls) {
            if (G.dist(p, b ) < b.radius) {
                box.selected = b;
                return;
            }
        }
        // select line
        for (let l of box.lines) {
            if (G.distToInfiniteLine(p, l) < 5) {
                box.selected = l;
                return;
            }
        }
        // select link
        for (let link of box.links) {
            let l = new Line(link.x1, link.y1, link.x2, link.y2 );
            if (G.distToInfiniteLine(p, l) < 5) {
                box.selected = link;
                return;
            }
        }
    })



}