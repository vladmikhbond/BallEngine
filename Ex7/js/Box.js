class Box {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.links = [];
        this.border = [
            new Line(0, 0, w, 0), // top
            new Line(w, 0, w, h), // right
            new Line(w, h, 0, h), // bottom
            new Line(0, h, 0, 0), // left
        ];
        this.mech = Mechanics(this);
    }

    // 0-stop, 1-play
    set mode(v) {
        if (v) {
            intervalId = setInterval(this.mech.step, INTERVAL);
        } else {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
    get mode() {
        return intervalId ? MODE_PLAY : MODE_STOP;
    }

    get SumEnergy() {
        let e = 0;
        this.balls.forEach( b => e += b.Energy);
        return e | 0;
    }

    get SumMomentum() {
        let e = 0;
        this.balls.forEach( b => e += b.Momentum);
        return e | 0;
    }

    //<editor-fold desc="Ball add & delete">

    addBall(b) {
        b.box = this;
        this.balls.push(b);
    }

    deleteBall(b) {
        let idx = this.balls.indexOf(b);
        if (idx === -1)
            return;
        this.balls.splice(idx, 1);
        if (this.balls.selected === b)
            this.balls.selected = null;
        // delete links
        for (let link of this.links.slice()) {
            if (link.b1 === b || link.b2 === b)
                this.deleteLink(link);
        }
    }

    // find a ball under a point
    ballUnderPoint(p) {
        for (let b of this.balls) {
            if (G.dist(p, b ) < b.radius) {
                return b;
            }
        }
        return null;
    }

    // find a ball which velocity is under a point
    ballVeloUnderPoint(p) {
        for (let b of this.balls) {
            let q = {x: b.x + b.vx * Kvelo, y: b.y + b.vy * Kvelo};
            if (G.dist(p, q ) < 3) {
                return b;
            }
        }
        return null;
    }

    //</editor-fold>

    //<editor-fold desc="Line add & delete">

    addLine(l) {
        this.lines.push(l);
    }

    deleteLine(l) {
        let idx = this.lines.indexOf(l);
        if (idx === -1)
            return;
        this.lines.splice(idx, 1);
        if (this.lines.selected === l)
            this.lines.selected = null;
    }

    //</editor-fold>

    //<editor-fold desc="Link add & delete">

    addLink(l) {
        this.links.push(l);
    }

    deleteLink(l) {
        let idx = this.links.indexOf(l);
        if (idx === -1)
            return;
        this.links.splice(idx, 1);
        if (this.links.selected === l)
            this.links.selected = null;
    }

    //</editor-fold>

    
    calibration(f) {
        // создать шар вверху ящика
        let b = new Ball(2, 10, 1, "red", 0, 0, 1 );
        this.addBall(b);

        // запустить setInterval и засечь время
        let me = this;
        let t = Date.now();
        controller.g = g;
        let id = setInterval(function () {
            me.mech.step();
            if (b.y > me.height - 10) {
                t = Date.now() - t;
                let h = b.y - 10;
                let hm = t * t * 9.8 / 2000000

                pixInMeter = h / hm;
                clearInterval(id);
                me.deleteBall(b);
                drawAll();
                f();
                //canvas.dispatchEvent(new Event("calibrated"));
            }
            }, INTERVAL);
    }

}
