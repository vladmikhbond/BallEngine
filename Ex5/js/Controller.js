function setListeners(box) {

    //---------------------------------------------------------
    canvas.addEventListener("drawAll", function (e) {
        drawAll();
    });

    //------------------- buttons --------------------------------------
    modeButton.addEventListener("click", function ()
    {
        const names = ["Stop", "Start"];
        this.innerHTML = names[box.mode];
        box.mode = (box.mode + 1) % names.length;
        drawAll();
    });

    createButton.addEventListener("click", function ()
    {
        const names = ["None", "Ball", "Line"];
        box.createMode = (box.createMode + 1) % names.length;
        this.innerHTML = names[box.createMode];

        // mouse handlers
        if (box.createMode === 1) {
            ballHandlers();
        } else if (box.createMode === 2) {
            lineHandlers();
        }
    });

    updateButton.addEventListener("click", function ()
    {
        let o = JSON.parse(ballDefinition.value);
        Object.assign(box.balls.selected, o);
        drawAll();
    });

    let saved;

    saveSceneButton.addEventListener("click", function ()
    {
        saved = {
            balls: box.balls.map(b => b.toString(), box),
            lines: box.lines.map(l => l.toString()),
        };
    });

    loadSceneButton.addEventListener("click", function ()
    {
        box.balls = [];
        saved.balls.forEach(s => box.addBall(Ball.fromString(s)));
        box.lines = [];
        saved.lines.forEach(s => box.addLine(Line.fromString(s)));
        drawAll();
    });

    //----------------------------- keyboard ----------------------------

    document.addEventListener("keydown", function (e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                if (box.mode === 0) {
                    Box.step(box);
                } else {
                    box.mode = 0
                }
                break;
            case 'Delete':
                if (box.createMode === 1) {
                    box.deleteSelectedBall();
                } else if (box.createMode === 2) {
                    box.deleteSelectedLine();
                }
                drawAll();
                break;
        }

    });

    //------------------------------ mouse ---------------------------

    canvas.addEventListener("click", function (e) {
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };

        // select ball
        //box.balls.selected = null;
        for (let b of box.balls) {
            if (G.dist(p, b ) < b.radius) {
                box.balls.selected = b;
                drawAll();
                ballDefinition.value = b.toString();
                break;
            }
        }
        // select line
        //box.lines.selected = null;
        for (let l of box.lines) {
            if (G.distToInfiniteLine(p, l) < 5) {
                box.lines.selected = l;
                drawAll();
                break;
            }
        }
        // // select link
        // for (let link of box.links) {
        //     let l = new Line(link.x1, link.y1, link.x2, link.y2 );
        //     if (G.distToInfiniteLine(p, l) < 5) {
        //         sel = link;
        //         break;
        //     }
        // }


    });


    function ballHandlers() {
        let p0 = null;

        canvas.onmousedown = function(e) {
            p0 = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
        }

        canvas.onmousemove = function(e) {
            if (!p0)
                return;
            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
            drawAll();
            drawCircle(p0, p);
        }

        canvas.onmouseup = function(e) {
            if (p0 === null)
                return;
            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
            let r = G.dist(p0, p);
            if (r > 2) {
                let b = new Ball(p0.x, p0.y, r);
                box.addBall(b);
                box.balls.selected = b;
            }
            p0 = null;
            drawAll();
        }
    }

    function lineHandlers() {
        let p0 = null;

        canvas.onmousedown = function(e) {
            p0 = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
        }

        canvas.onmousemove = function(e) {
            if (!p0)
                return;
            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
            drawAll();
            drawLine(p0, p);
        }

        canvas.onmouseup = function(e) {
            if (p0 === null)
                return;
            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
            if (G.dist(p0, p) > 2) {

                let l = new Line(p0.x, p0.y, p.x, p.y);
                box.addLine(l);
                box.lines.selected = l;
            }
            p0 = null;
            drawAll();
        }
    }

}