
class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
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

    start(draw) {
        let me = this;
        setInterval( function () {
            draw();
            me.balls.forEach( b => b.step() );
        }, INTERVAL);
    }

}
