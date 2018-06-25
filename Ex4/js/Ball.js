
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
        let kin = this.m * (this.vx * this.vx + this.vy * this.vy) / 2;
        let pot = this.m * g * this.y;
        return kin - pot;
    }

    move() {
        // тяготение
        this.vy += g;

        // учет реакции связей
        for (let l of this.box.links) {
            Link.link(l)
        }

        // изменение скорости при столновении с линиями
        for(let i = 0; i < 2; i++)
        for (let l of this.box.lines) {
            if (Ball.strikeLine(this, l))
                break;
        }

        // изменение скорости при столновении с др.шарами
        let bs = this.box.balls;
        let i = bs.indexOf(this);
        for (let j = i + 1; j < bs.length; j++ ) {
            Ball.strikeBall(this, bs[j]);
        }

         // изменение скорости при столновении с границей
        for (let l of this.box.border) {
            Ball.strikeLine(this, l);
        }

        // --- изменение координат
        this.x += this.vx;
        this.y += this.vy;
    }

    static strikeLine(b, l) {
        // линия далеко
        let d = G.distToInfiniteLine(b, l);
        if (d > b.radius)
            return;

        // точка касания за пределами отрезока
        if (!G.crossPerpen(b, l)) {
            return Ball.strikeEnds(b, l);
        }

        // линия близко, но удаляется
        let b1 = {x: b.x + b.vx, y: b.y + b.vy};
        if (G.distToInfiniteLine(b1, l) >= d )
            return;

        // --- Соударение с отрезком ---

        // угол между линией и осью Ox
        let alpha = G.angle(l.p1, l.p2);
        // поворот скорости, теперь b.vy нормальна к линии
        G.turnV(b, alpha);

        // обмен скоростей
        b.vy = -b.vy * W;
        b.vx *= W;

        // обратный поворот скорости
        G.turnV(b, -alpha);
        return true;
    }

    static strikeEnds(b, l) {
        let p = null;
        let d = G.dist(b, l.p1);
        if (d < b.radius) {
            p = l.p1;
        } else {
            d = G.dist(b, l.p2);
            if (d < b.radius) {
                p = l.p2;
            } else {
                return;
            }
        }

        let a = new Ball(p.x, p.y, 1, null, 0, 0);
        a.m = 1e100;
        Ball.strikeBall(a, b);
        return true;
    }

    static strikeBall(a, b) {
        // шары далеко
        let d = G.dist(a, b);
        if (d > a.radius + b.radius )
            return;
        // шары близко, но расходятся
        let a1 = {x: a.x + a.vx, y: a.y + a.vy};
        let b1 = {x: b.x + b.vx, y: b.y + b.vy};
        if (G.dist(a1, b1) >= d )
            return;

        // угол между прямой через центры шаров и осью Ox
        let alpha = G.angle(a, b);

        // поворот скоростей
        G.turnV(a, alpha);
        G.turnV(b, alpha);

        // обмен скоростей вдоль Оx
        let M = a.m + b.m, m = a.m - b.m;
        let avx = ( m * a.vx + 2 * b.m * b.vx) / M;
        let bvx = (-m * b.vx + 2 * a.m * a.vx) / M;
        a.vx = avx ;
        b.vx = bvx ;

        // обратный поворот скоростей
        G.turnV(a, -alpha);
        G.turnV(b, -alpha);
    }
}
