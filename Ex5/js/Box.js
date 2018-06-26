
class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.border = [
            new Line(0, 0, w, 0), // up
            new Line(w, 0, w, h), // right
            new Line(w, h, 0, h), // down
            new Line(0+100, h+100, 0, 0), // left
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
        let me = this;
        setInterval( function () {
            draw();
            me.balls.forEach( b => b.step() );
        }, INTERVAL);
    }

}
