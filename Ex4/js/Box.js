
class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.border = [
            new Line(0, 0, w, 0), // top
            new Line(w, 0, w, h), // right
            new Line(w, h, 0, h), // bottom
            new Line(0, h, 0, 0), // left
        ];
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

    addLine(l) {
        this.lines.push(l);
    }

    start(draw) {
        setInterval(Box.step, INTERVAL, this, draw);
    }

    static step(box, draw) {
        draw();
        box.touchLines();
        box.touchBalls();

        box.balls.forEach( b => b.move() )
    }

    // собирает на шары точки касания с  (в т.ч. с границами)
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
                let dot = b1.dotWith(b2);
                if (dot) {
                    b1.dots.push(dot);
                    b2.dots.push(dot);
                }
            }
        }
    }



}
