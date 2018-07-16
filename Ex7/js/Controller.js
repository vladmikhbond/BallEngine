class Controller {
    constructor() {
        setListeners(this);
        this.g = g;
        this.W = W;
        this.K = K;
        this._createMode = CREATE_MODE_BALL;
        this.createMode = CREATE_MODE_BALL;
        this.selected = null;
        this._mousePos = {x: 0, y: 0}; // relative to the box
    }


    // mode property
    set mode(v) {
        box.mode = v;
        const classNames = ["glyphicon glyphicon-pause", "glyphicon glyphicon-play"];
        modeGlif.className = classNames[v];
        drawAll();
    }
    get mode() {
        return box.mode;
    }

    // createMode property
    set createMode(v) {
        this._createMode = v;
        ballButton.className = lineButton.className = linkButton.className = "btn btn-default";
        // mouse handlers
        if (v === CREATE_MODE_BALL) {
            setBallHandlers();
            ballButton.className = "btn btn-info";
        } else if (v === CREATE_MODE_LINE) {
            setLineHandlers();
            lineButton.className = "btn btn-info";
        }  else if (v === CREATE_MODE_LINK) {
            setLinkHandlers();
            linkButton.className = "btn btn-info";
        }
    }
    get createMode() {
        return this._createMode;
    }

    // mousePos property
    set mousePos(v) {
        this._mousePos = v;
        mousePosSpan.innerHTML = `x=${v.x} y=${v.y}`;
    }
    get mousePos() {
        return this._mousePos;
    }

    // g property
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


function setListeners(controller) {

    canvas.addEventListener("changed", function () {
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

    // restart button
    restartButton.addEventListener("click", function ()
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
        if (controller.selected && controller.selected.constructor === Ball) {
            let o = JSON.parse(ballDefinition.value);
            Object.assign(controller.selected, o);
            drawAll();
        }
    });

    // clear screen
    eraseButton.addEventListener("click", function ()
    {
        box.balls = [];
        box.lines = [];
        box.links = [];
        controller.W = 0.5;    // к.п.д. при соударении (1 - без потерь)
        controller.K = 0.1;    // модуль упругости (1 - твердый)
        controller.g = 0.002;  // 0.002 = 1g;
        controller.mode = MODE_STOP;
        controller.createMode = CREATE_MODE_BALL;
        drawAll();
    });

    //------------------- input-range --------------------------------------

    graviRange.addEventListener("change", function ()
    {
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
            // step execution
            case 's': case 'S':
                box.mech.step(box);
                controller.mode = MODE_STOP;
                if (controller.selected)
                    ballDefinition.value = controller.selected.toString();
                break;

            // copy selected ball
            case 'c': case 'C':
                if (controller.selected && controller.selected.constructor === Ball) {
                    let s = controller.selected;
                    let p = controller.mousePos;
                    let b = new Ball(p.x, p.y, s.radius, s.color, s.vx, s.vy, s.m);
                    box.addBall(b);
                    controller.selected = b;
                    drawAll();
                }
                break;

            // toggle ball color
            case 'b': case 'B':
                let b = controller.selected;
                if (b && b.constructor === Ball) {
                    b.color = b.color === "red" ? "blue" : "red";
                    drawAll();
                }
                break;

            // delete selected object
            case 'Delete':
                if (!controller.selected)
                    break;
                if (controller.selected.constructor === Ball)
                    box.deleteBall(controller.selected);
                else if (controller.selected.constructor === Line)
                    box.deleteLine(controller.selected);
                else if (controller.selected.constructor === Link)
                    box.deleteLink(controller.selected);
                controller.selected = null;
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
                controller.selected = b;
                if (controller.createMode !== CREATE_MODE_LINK) {
                    controller.createMode = CREATE_MODE_BALL;
                }
                drawAll();
                ballDefinition.value = b.toString();
                break;
            }
        }
        // select line
        for (let l of box.lines) {
            if (G.distToInfiniteLine(p, l) < 5 && G.cross(p, l)) {
                controller.selected = l;
                controller.createMode = CREATE_MODE_LINE;
                drawAll();
                break;
            }
        }
        // select link
        for (let link of box.links) {
            let l = new Line(link.x1, link.y1, link.x2, link.y2 );
            if (G.distToInfiniteLine(p, l) < 5 && G.cross(p, l)) {
                controller.selected = link;
                controller.createMode = CREATE_MODE_LINK;
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

        // change mouse cursor
        canvas.style.cursor = box.ballVeloUnderPoint(p) ? "pointer" : "auto";

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
        controller.mousePos = p;
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
                controller.selected = b;
                ballDefinition.value = b.toString();
            }
        }
        mode = null;
        drawAll();
    }
}

function setLineHandlers() {
    let p0 = null;

    canvas.onmousedown = function(e) {
        p0 = {x: e.pageX - this.offsetLeft - box.x,
              y: e.pageY - this.offsetTop - box.y };
    };

    canvas.onmousemove = function(e) {
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        if (p0) {
            drawAll();
            drawGrayLine(p0, p);
        }
        controller.mousePos = p;
    };

    canvas.onmouseup = function(e) {
        if (p0 === null)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        if (G.dist(p0, p) > 2) {

            let l = new Line(p0.x, p0.y, p.x, p.y);
            box.addLine(l);
            controller.selected = l;
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
            let l = new Link(b0, b);
            box.addLink(l);
            controller.selected = l;
            b0 = null;
        }

    };

    canvas.onmousemove = function(e) {
        controller.mousePos = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
    };

    canvas.onmouseup = function(e) {
    }
}
