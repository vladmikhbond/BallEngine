const MODE_STOP = 0;
const MODE_PLAY = 1;

const CREATE_MODE_BALL = 0;
const CREATE_MODE_LINE = 1;
const CREATE_MODE_LINK = 2;


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
        this.createMode = CREATE_MODE_BALL;  // 0-create ball, 1-create line,
    }

    // 0-stop, 1-play
    set mode(v) {
        if (v) {
            intervalId = setInterval(Box.step, INTERVAL, this);
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

    addBall(b) {
        b.box = this;
        this.balls.push(b);
    }

    deleteBall(b) {
        let idx = this.balls.indexOf(b);
        if (idx !== -1) {
            this.balls.splice(idx, 1);
            // delete link
            for (let link of this.links.slice()) {
                if (link.b1 === b || link.b2 === b)
                    this.deleteLink(link);
            }
        }
    }

    deleteSelectedBall() {
        if (this.balls.selected) {
            this.deleteBall(this.balls.selected);
            this.balls.selected = null;
        }
    }


    addLine(l) {
        this.lines.push(l);
    }

    deleteLine(l) {
        let idx = this.lines.indexOf(l);
        if (idx !== -1)
            this.lines.splice(idx, 1);
    }

    deleteSelectedLine() {
        if (this.lines.selected) {
            this.deleteLine(this.lines.selected);
            this.lines.selected = null;
        }
    }


    addLink(l) {
        this.links.push(l);
    }

    deleteLink(l) {
        let idx = this.links.indexOf(l);
        if (idx !== -1)
            this.links.splice(idx, 1);
    }

    deleteSelectedLink() {
        if (this.links.selected) {
            this.deleteLink(this.links.selected);
            this.links.selected = null;
        }
    }


    static step(box) {
        let event = new Event("drawAll");
        canvas.dispatchEvent(event);
        for (let i = 0; i < REPEAT; i++) {
            box.touchLines();
            box.touchBalls();
            box.balls.forEach( b => b.move() )
        }
    }

    // собирает на шары точки касания с отрезками (в т.ч. с границами)
    touchLines() {
        for (let b of this.balls) {
            b.dots = [];
            for (let l of this.lines.concat(this.border) ) {
                if (G.distToInfiniteLine(b, l) < b.radius) {
                    let p = G.cross(b, l);
                    if (p) {
                        // точка пересечения перпендикуляра в пределах отрезка
                        b.dots.push(p);
                    } else {
                        // точка пересечения за пределами отрезка
                        if (G.dist(b, l.p1) < b.radius)
                            b.dots.push(l.p1);
                        if (G.dist(b, l.p2) < b.radius)
                            b.dots.push(l.p2);
                    }
                }
             }
        }
    }


    // собирает на шары точки касания с шарами
    touchBalls() {
        for (let i = 0; i < this.balls.length - 1; i++ ) {
            for (let j = i + 1; j < this.balls.length; j++ ) {
                let b1 = this.balls[i], b2 = this.balls[j];
                let dot = touch(b1, b2);
                if (dot) {
                    b1.dots.push(dot);
                    b2.dots.push(dot);
                }
            }
        }

        // деформация шара (т.е. сила реакции) пропорциональна массе
        // (компенсирует обратную пропорциональность массе модуля упругости)
        function touch(b1, b2) {
            let d = G.dist(b1, b2);
            // шары далеко
            if (d > b1.radius + b2.radius )
                return;
            // ширина области деформации (области пересечения окружностей)
            let delta = b1.radius + b2.radius - d;
            // доля деформации для шара b1
            let delta1 = delta * b1.m / (b1.m + b2.m);

            // отношение расстояние от b1 до точки касания к расстоянию между шарами
            let k = (d - b2.radius + delta1) / d;

            // координаты точки касания
            let x = b1.x + (b2.x - b1.x) * k;
            let y = b1.y + (b2.y - b1.y) * k;
            return {x, y};
        }

    }



}
