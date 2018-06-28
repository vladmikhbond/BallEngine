function setListeners(box) {

    //---------------------------------------------------------
    modeButton.addEventListener("click", function ()
    {
        const names = ["Stop", "Start"];
        box.mode = (box.mode + 1) % names.length;
        this.innerHTML = names[box.mode];
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

    //---------------------------------------------------------
    canvas.addEventListener("drawAll", function (e) {
        drawAll();
    })

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
    }

    function ballMouseUp(e) {
        if (p0 === null)
            return;
        let p = {x: e.pageX - this.offsetLeft - box.x,
            y: e.pageY - this.offsetTop - box.y };
        let r = G.dist(p0, p);
        if (r < 2)
            return;
        let b = new Ball(p0.x, p0.y, r);
        box.addBall(b);
        p0 = null;
        drawAll();
    }

    //---------------------------------------------------------
    function lineMouseDown(e) {
        alert("lineMouseDown")
    }

    function lineMouseMove(e) {

    }

    function lineMouseUp(e) {

    }

}