
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


    forses() {
        let b = this;

        // фиксируем точку останова
        if (b.x < b.radius || b.x > b.box.width - b.radius ||
            b.y < b.radius || b.y > b.box.height - b.radius)
        {
            if (!b.dot) b.dot = {x: b.x, y: b.y};
        } else {
            b.dot = null;
        }


        b.fx = b.fy = 0;
        // сила деформации
        if (b.dot) {
            let defX = b.dot.x - b.x;
            let defY = b.dot.y - b.y;
            b.fx += defX * K;
            b.fy += defY * K;
        }

        // сила тяжести
        b.fy += g * b.m;

        // потери на сопротивление воздуха
        b.fx -= b.vx * AIR;
        b.fy -= b.vy * AIR;
    }


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
        avx = b.vx;
        bvx = a.vx;
        a.vx = avx;
        b.vx = bvx;
        // обратный поворот скоростей
        G.turnV(a, -alpha);
        G.turnV(b, -alpha);
    }
}
