class Box {
    static get INTERVAL() {
        return 30;
    }

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.links = [];
        this.border = [new Line(0, 0, w, 0), new Line(0, 0, 0, h), new Line(0, h, w, h), new Line(w, 0, w, h), ];
        this.zeroEnergy = 0;
    }

    get SumEnergy() {
        let e = -this.zeroEnergy;
        this.balls.forEach( b => e += b.Energy);
        return e | 0;
    }

    addBall(b) {
        b.box = this;
        this.balls.push(b);
        this.zeroEnergy += b.Energy;
    }

    addLine(l) {
        this.lines.push(l);
    }

    addLink(l) {
        this.links.push(l);
    }

    start(draw) {
        const balls = this.balls;
        khronos = 0;
        timer = setInterval( function () {
            draw();
            balls.forEach( b => b.move() );
            khronos++;
        }, Box.INTERVAL);
    }

}
