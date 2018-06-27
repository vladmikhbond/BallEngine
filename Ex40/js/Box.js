class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.links = [];
        this.border = [new Line(0, 0, w, 0), new Line(0, 0, 0, h),
            new Line(0, h, w, h), new Line(w, 0, w, h), ];
        this.selected = null;
    }

    get SumEnergy() {
        let e = 0;
        this.balls.forEach( b => e += b.Energy);
        return e | 0;
    }

    addBall(b) {
        b.box = this;
        this.balls.push(b);
        this.selected = b;
    }

    addLine(l) {
        this.lines.push(l);
        this.selected = l;
    }

    addLink(l) {
        l.box = this;
        this.links.push(l);
        this.selected = l;
    }

    start(draw) {
        const balls = this.balls;
        khronos = 0;
        timer = setInterval( function () {
            draw();
            balls.forEach( b => b.move() );
            khronos++;
        }, INTERVAL);
    }

}
