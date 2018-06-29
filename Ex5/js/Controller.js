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
    });

    createButton.addEventListener("click", function ()
    {
        const names = ["None", "Ball", "Line"];
        box.createMode = (box.createMode + 1) % names.length;
        this.innerHTML = names[box.createMode];

        // mouse handlers
        if (box.createMode === 1) {
            canvas.onmousedown = ballMouseDown;
            canvas.onmousemove = ballMouseMove;
            canvas.onmouseup = ballMouseUp;
        } else if (box.createMode === 2) {
            canvas.onmousedown = lineMouseDown;
            canvas.onmousemove = lineMouseMove;
            canvas.onmouseup = lineMouseUp;
        }
    });

    //----------------------------- keyboard ----------------------------

    document.addEventListener("keydown", function (e) {
        switch(e.key) {
            case 's':
                if (box.mode === 0) {
                    Box.step(box);
                } else {
                    box.mode = 0
                }
                break;
        }

    });


    //---------------------------------------------------------

    let p0 = null;

    function ballMouseDown(e) {
        p0 = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
    }

    function ballMouseMove(e) {
        if (!p0)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        drawAll();
        drawCircle(p0, p);
    }

    function ballMouseUp(e) {
        if (p0 === null)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        let r = G.dist(p0, p);
        if (r > 2) {
            box.addBall(new Ball(p0.x, p0.y, r));
        }
        p0 = null;
        drawAll();
    }

    //---------------------------------------------------------
    function lineMouseDown(e) {
        p0 = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
    }

    function lineMouseMove(e) {
        if (!p0)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        drawAll();
        drawLine(p0, p);
    }

    function lineMouseUp(e) {
        if (p0 === null)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        if (G.dist(p0, p) > 2) {
            box.addLine(new Line(p0.x, p0.y, p.x, p.y));
        }
        p0 = null;
        drawAll();
    }

}