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
    }

    addBall(b) {
        b.box = this;
        this.balls.push(b);
    }

    start(draw) {
        const balls = this.balls;
        setInterval( function () {
            draw();
            balls.forEach( b => b.move() );
        }, Box.INTERVAL);
    }

}
