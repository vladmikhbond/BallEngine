
class Ball {
    constructor(x, y, r, c, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.vx = vx;
        this.vy = vy;
        this.m = r * r;
        this.box = null;
    }

    get Energy() {
        let kin = this.m * (this.vx * this.vx + this.vy * this.vy) / 2;
        let pot = this.m * g * this.y;
        return kin - pot;
    }

    move() {

        // тяготение (шар подпрыгивает)
        this.vy += g;

        // изменение скорости при столновении с др.шарами
        let bs = this.box.balls;
        let i = bs.indexOf(this);
        for (let j = i + 1; j < bs.length; j++ )
            Ball.strike(this, bs[j]);

        // изменение скорости при ударе о стенки
        if (this.x < this.radius && this.vx < 0)
            this.vx = -this.vx * W;
        if (this.x > this.box.width - this.radius && this.vx > 0)
            this.vx = -this.vx * W;

        if (this.y < this.radius && this.vy < 0)
            this.vy = -this.vy * W;
        if (this.y > this.box.height - this.radius && this.vy > 0)
            this.vy = -this.vy * W;

        // тяготение (шар проваливается)
        //this.vy += g/2;

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
        // шары далеко
        if (G.dist(a, b) > a.radius + b.radius )
            return;
        // шары близко, но расходятся
        let a1 = {x: a.x + a.vx, y: a.y + a.vy}
        let b1 = {x: b.x + b.vx, y: b.y + b.vy}
        let d = G.dist(a1, b1) - G.dist(a, b);
        if (d >= 0  )
            return;

        // угол между прямой через центры шаров и осью Ox
        let alpha = G.angle(a, b);
        // поворот скоростей
        G.turnV(a, alpha);
        G.turnV(b, alpha);

         // обмен скоростей вдоль Оx
        let ma = a.radius * a.radius;
        let mb = b.radius * b.radius;
        let avx = ((ma - mb) * a.vx + 2 * mb * b.vx) / (ma + mb);
        let bvx = ((mb - ma) * b.vx + 2 * ma * a.vx) / (ma + mb);
        a.vx = avx * W;
        b.vx = bvx * W;
        // обратный поворот скоростей
        G.turnV(a, -alpha);
        G.turnV(b, -alpha);
    }
}
