
class Ball {
    constructor(x, y, r, c, vx, vy, m) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.vx = vx;
        this.vy = vy;
        this.m = m ? m * m : r * r;
        this.box = null;
    }

    get Energy() {
        let kinetic = this.m * (this.vx * this.vx + this.vy * this.vy) / 2;
        let potential = this.m * g * this.y;
        return kinetic - potential;
    }

    step() {
        let b = this;

        b.fx = 0;
        b.fy = b.m * g;  // тяготение

        // реакция нижней стенки
        // let x = b.box.height - b.y;
        // let k = b.vy > 0 ? K : K * W;
        //
        // if (x < b.radius) {
        //     b.fy += k * (x - b.radius);
        // }


        Ball.strikeBorders(b);

        // изменение скорости
        b.vx += b.fx / b.m;
        b.vy += b.fy / b.m;
        // изменение координат
        b.x += b.vx;
        b.y += b.vy;
    }


    static strikeBorders(b) {
        for (let i = 0; i < 4; i++) {
            let f = Ball.strikeLine(b, box.border[i]);
            if (f) {
                b.fx += f.x;
                b.fy += f.y;
            }
        }
    }

    static strikeLine(b, l) {
        // шар далеко от линии
        let dist = G.distToInfiniteLine(b, l);
        if ( dist >= b.radius)
            return;

        let alpha = G.angle(l.p1, l.p2);
        let fy = K * (b.radius - dist);
        let f = G.turn(0, fy, -alpha);
        return f;
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
        let avx = ((a.m - b.m) * a.vx + 2 * b.m* b.vx) / (a.m + b.m);
        let bvx = ((b.m - a.m) * b.vx + 2 * a.m * a.vx) / (a.m + b.m);
        a.vx = avx * W;
        b.vx = bvx * W;
        // обратный поворот скоростей
        G.turnV(a, -alpha);
        G.turnV(b, -alpha);
    }
}
