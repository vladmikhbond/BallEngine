let G = Geometry();

class Ball {
    constructor(x, y, r, c, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.vx = vx;
        this.vy = vy;
    }

    move() {
        const K = 1; // 0.8
        const g = 0; // 0.05;



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


    // static strike(a, b) {
    //     if (G.dist(a, b) < a.radius + b.radius ) {
    //         // stub
    //         const K = 1;
    //         a.vx = -a.vx  * K;
    //         a.vy = -a.vy * K;
    //         b.vx = -b.vx * K;
    //         b.vy = -b.vy * K;
    //     }
    // }

    static strike(a, b) {
        if (G.dist(a, b) > a.radius + b.radius )
            return;

        let a1 = {x: a.x + a.vx, y: a.y + a.vy}
        let b1 = {x: b.x + b.vx, y: b.y + b.vy}
        let d = G.dist(a1, b1) - G.dist(a, b);
        if (d >= 0  )
            return;

        //
        let alpha = G.angle(a, b);
        // поворот скоростей
        G.turnV(a, alpha);
        G.turnV(b, alpha);
        //
        // if (a.vx - b.vx > 0) {
        //     G.turnV(a, -alpha);
        //     G.turnV(b, -alpha);
        //     return;
        // }
        //
        // обмен скоростей вдоль Оx
        let ma = a.radius * a.radius;
        let mb = b.radius * b.radius;
        let avx = ((ma - mb) * a.vx + 2 * mb * b.vx) / (ma + mb);
        let bvx = ((mb - ma) * b.vx + 2 * ma * a.vx) / (ma + mb);
        avx = b.vx;
        bvx = a.vx;
        a.vx = avx;
        b.vx = bvx;
        // поворот скоростей
        G.turnV(a, -alpha);
        G.turnV(b, -alpha);
    }
}
