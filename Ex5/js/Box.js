class Box {
    static get INTERVAL() {
        return 50;
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

            balls.forEach( b => b.forses() );

            balls.forEach( b => {
                b.vx += b.fx / b.m;
                b.vy += b.fy / b.m;
                b.x += b.vx;
                b.y += b.vy;
            } );

            draw();

        }, Box.INTERVAL);
    }

}
