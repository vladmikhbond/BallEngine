let INTERVAL = 30;

class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
    }

    addBall(b) {
        b.box = this;
        this.balls.push(b);
    }

    start(draw) {
        let me = this;
        setInterval( function () {
            drawAll();
            me.balls.forEach( b => b.step() );
        }, INTERVAL);
    }

}


