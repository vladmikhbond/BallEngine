class Ball {
    constructor(x, y, r, c, b) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.vx = Math.random() * 5;
        this.vy = Math.random() * 5;
        this.box = b;
    }

    move() {
        const K = 0.9;
        const g = 0.05;



        // изменение скорости при столновении с др.шарами
        let bs = this.box.balls;
        let i = bs.indexOf(this);
        for (let j = i + 1; j < bs.length; j++ )
            Ball.strike(this, bs[j]);

        // изменение скорости при ударе о стенки
        if (this.x < this.radius || this.x > this.box.width - this.radius)
            this.vx = -this.vx * K;
        if (this.y < this.radius || this.y > this.box.height - this.radius)
            this.vy = -this.vy * K;

        // тяготение
        this.vy += g;

        // изменение координат
        this.x += this.vx;
        this.y += this.vy;
    }


    static strike(a, b) {
        if (G.dist(a, b) < a.radius + b.radius ) {
            // stub
            const K = 1;
            a.vx = -a.vx  * K;
            a.vy = -a.vy * K;
            b.vx = -b.vx * K;
            b.vy = -b.vy * K;
        }
    }
}
