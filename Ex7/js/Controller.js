function setListeners() {

    canvas.addEventListener("drawAll", function (e) {
        drawAll();
    });

    //------------------- buttons --------------------------------------

    // mode toggle
    modeButton.addEventListener("click", function ()
    {
        const names = ["Stop", "Play"];
        this.innerHTML = names[box.mode];
        box.mode = (box.mode + 1) % names.length;
        drawAll();
    });

    // create mode toggle
    createButton.addEventListener("click", function ()
    {
        const names = ["Ball", "Line", "Link"];
        box.createMode = (box.createMode + 1) % names.length;
        this.innerHTML = names[box.createMode];

        // mouse handlers
        if (box.createMode === CREATE_MODE_BALL) {
            ballHandlers();
        } else if (box.createMode === CREATE_MODE_LINE) {
            lineHandlers();
        }  else if (box.createMode === CREATE_MODE_LINK) {
            linkHandlers();
        }
    });

    // update world constants
    updateWorldButton.addEventListener("click", function ()
    {
        Box.worldFromString(worldDefinition.value);
        drawAll();
    });

    // update selected ball
    updateButton.addEventListener("click", function ()
    {
        if (box.balls.selected) {
            let o = JSON.parse(ballDefinition.value);
            Object.assign(box.balls.selected, o);
            drawAll();
        }
    });


    //----------------------------- keyboard ----------------------------

    document.addEventListener("keydown", function (e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                if (box.mode === MODE_STOP) {
                    Box.step(box);
                } else {
                    // to toggle mode
                    modeButton.dispatchEvent(new Event("click"));
                }
                break;
            case 'Delete':
                if (box.createMode === CREATE_MODE_BALL) {
                    box.deleteSelectedBall();
                } else if (box.createMode === CREATE_MODE_LINE) {
                    box.deleteSelectedLine();
                } else if (box.createMode === CREATE_MODE_LINK) {
                    box.deleteSelectedLink();
                }
                drawAll();
                break;
        }

    });

    //------------------------------ mouse ---------------------------

    // select object
    canvas.addEventListener("click", function (e) {
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };

        // select ball
        for (let b of box.balls) {
            if (G.dist(p, b ) < b.radius) {
                box.balls.selected = b;
                drawAll();
                ballDefinition.value = b.toString();
                break;
            }
        }
        // select line
        for (let l of box.lines) {
            if (G.distToInfiniteLine(p, l) < 5) {
                box.lines.selected = l;
                drawAll();
                break;
            }
        }
        // select link
        for (let link of box.links) {
            let l = new Line(link.x1, link.y1, link.x2, link.y2 );
            if (G.distToInfiniteLine(p, l) < 5) {
                box.links.selected = link;
                drawAll();
                break;
            }
        }

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
            drawGrayCircle(p0, p);
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
                ballDefinition.value = b.toString();
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
            drawGrayLine(p0, p);
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

    function linkHandlers() {
        let b0 = null;

        canvas.onmousedown = function(e) {

            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };

            let b = box.ballUnderPoint(p);
            if (!b)
                return;
            if (!b0) {
                b0 = b;
            } else {
                box.addLink(new Link(b0, b));
                b0 = null;
            }

            // // find a ball under mouse
            // function ballUnderPoint(p) {
            //     for (let b of box.balls) {
            //         if (G.dist(p, b ) < b.radius) {
            //             return b;
            //         }
            //     }
            //     return null;
            // }
        }

        canvas.onmousemove = function(e) {
        }

        canvas.onmouseup = function(e) {
        }
    }

    ballHandlers();
}
