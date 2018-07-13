class Controller {
    constructor() {
        setListeners();
        this.g = g;
        this.W = W;
        this.K = K;
        this._createMode = null;
        this.createMode = CREATE_MODE_BALL;
    }


    // 0-stop, 1-play
    set mode(v) {
        box.mode = v;
        const classNames = ["glyphicon glyphicon-pause", "glyphicon glyphicon-play"];
        modeGlif.className = classNames[v];
        drawAll();
    }
    get mode() {
        return box.mode;
    }

    set createMode(v) {
        this._createMode = v;
        ballButton.className = lineButton.className = linkButton.className = "btn btn-default";
        // mouse handlers
        if (v === CREATE_MODE_BALL) {
            setBallHandlers();
            ballButton.className = "btn btn-info";
        } else if (v === CREATE_MODE_LINE) {
            setLneHandlers();
            lineButton.className = "btn btn-info";
        }  else if (v === CREATE_MODE_LINK) {
            setLinkHandlers();
            linkButton.className = "btn btn-info";
        }
    }
    get createMode() {
        return this._createMode;
    }


    set g(v) {
        g = +v;
        graviValue.innerHTML = "G = " + (v / 0.002).toFixed(2) + "g";
        //graviValue.innerHTML = "G = " + v;
        graviRange.value = v;
    }
    set W(v) {
        W = +v;
        waistValue.innerHTML = "W = " + v;
        waistRange.value = v;
    }
    set K(v) {
        K = +v;
        rigidValue.innerHTML = "K = " + v;
        rigidRange.value = v;
    }

}


function setListeners() {

    canvas.addEventListener("drawAll", function () {
        drawAll();
    });

    //------------------- buttons --------------------------------------

    // mode toggle
    modeButton.addEventListener("click", function ()
    {
        controller.mode = (controller.mode + 1) % 2;
        if (controller.mode === MODE_PLAY)
            curentScene = new Scene();
    });

    // start button
    startButton.addEventListener("click", function ()
    {
        if (curentScene) {
            curentScene.restore();
            controller.mode = MODE_STOP;
        }
    });


    // pretty toggle
    prettyButton.addEventListener("click", function ()
    {
        // const names = ["Ugly", "Pretty"];
        // this.innerHTML = names[PRETTY];
        PRETTY = (PRETTY + 1)  % 2;
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

    //------------------- input-range --------------------------------------

    graviRange.addEventListener("change", function ()
    {
        // g = +this.value;
        // graviValue.innerHTML = "G = " + this.value;
        controller.g = this.value;
    });

    waistRange.addEventListener("change", function ()
    {
        W = +this.value;
        waistValue.innerHTML = "W = " + this.value;
    });

    rigidRange.addEventListener("change", function ()
    {
        K = +this.value;
        rigidValue.innerHTML = "K = " + this.value;
    });

    //----------------------------- keyboard ----------------------------

    document.addEventListener("keydown", function (e) {
        switch(e.key) {
            case 's': case 'S': case 'ы': case 'Ы':
                box.mech.step(box);
                controller.mode = MODE_STOP;
                break;
            case 'Delete':
                if (controller.createMode === CREATE_MODE_BALL) {
                    box.deleteSelectedBall();
                } else if (controller.createMode === CREATE_MODE_LINE) {
                    box.deleteSelectedLine();
                } else if (controller.createMode === CREATE_MODE_LINK) {
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
            if (G.distToInfiniteLine(p, l) < 5 && G.cross(p, l)) {
                box.lines.selected = l;
                drawAll();
                break;
            }
        }
        // select link
        for (let link of box.links) {
            let l = new Line(link.x1, link.y1, link.x2, link.y2 );
            if (G.distToInfiniteLine(p, l) < 5 && G.cross(p, l)) {
                box.links.selected = link;
                drawAll();
                break;
            }
        }

    });

}

function setBallHandlers() {
    let p0 = null;
    let ball = null;
    let mode;  // "velo", "ball", "new"

    canvas.onmousedown = function(e) {
        p0 = {x: e.pageX - this.offsetLeft - box.x, y: e.pageY - this.offsetTop - box.y };
        ball = box.ballVeloUnderPoint(p0);
        if (ball) {
            mode = "velo";
            return;
        }
        ball = box.ballUnderPoint(p0);
        if (ball) {
            mode = "ball";
            // в p0 смещение курсора от центра шара
            p0 = {x: ball.x - p0.x, y: ball.y - p0.y};
            return;
        }
        mode = "new";
    };

    canvas.onmousemove = function(e) {
        let p = {x: e.pageX - this.offsetLeft - box.x, y: e.pageY - this.offsetTop - box.y };
        switch (mode) {
            case "velo":
                ball.vx = (p.x - ball.x) / Kvelo;
                ball.vy = (p.y - ball.y) / Kvelo;
                drawAll();
                break;
            case "ball":
                ball.x = p.x + p0.x;
                ball.y = p.y + p0.y;
                drawAll();
                break;
            case "new":
                drawAll();
                drawGrayCircle(p0, p);
                break;
        }
    };

    canvas.onmouseup = function(e) {
        if (mode === "new"){
            // create ball
            let p = {x: e.pageX - this.offsetLeft - box.x,
                y: e.pageY - this.offsetTop - box.y };
            let r = G.dist(p0, p);
            if (r > 2) {
                let b = new Ball(p0.x, p0.y, r);
                box.addBall(b);
                box.balls.selected = b;
                ballDefinition.value = b.toString();
            }
        }
        mode = null;
        drawAll();
    }
}

function setLneHandlers() {
    let p0 = null;

    canvas.onmousedown = function(e) {
        p0 = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
    };

    canvas.onmousemove = function(e) {
        if (!p0)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        drawAll();
        drawGrayLine(p0, p);
    };

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
    };
}

function setLinkHandlers() {
    let b0 = null;

    canvas.onmousedown = function(e) {

        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };

        let b = box.ballUnderPoint(p);
        if (!b)
            return;
        if (!b0) {
            b0 = b;
        } else if (b0 !== b){
            box.addLink(new Link(b0, b));
            b0 = null;
        }

    };

    canvas.onmousemove = function(e) {
    };

    canvas.onmouseup = function(e) {
    }
}
