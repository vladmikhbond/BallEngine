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

    start(draw) {
        const balls = this.balls;
        setInterval( function () {
            draw();
            balls.forEach( b => b.move() );
        }, Box.INTERVAL);
    }

}
