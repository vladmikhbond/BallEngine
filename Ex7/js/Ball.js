
class Ball {
    constructor(x, y, r, c='red', vx=0, vy=0, m=0) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.vx = vx;
        this.vy = vy;
        // если масса не задана, она равна квадрату радиуса
        this.m = m ? m : r * r;
    }

    get Energy() {
        let b = this;
        let kinetic = b.m * (b.vx * b.vx + b.vy * b.vy) / 2;
        let potential = b.m * g * (b.y - b.box.height + b.radius);
        return kinetic + potential;
    }

    get Momentum() {
        let b = this;
        return b.m * Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    }

    toString() {
        let b = this;
        return JSON.stringify({ x: +(b.x.toFixed(2)), y: +(b.y.toFixed(2)),
            vx: +(b.vx.toFixed(2)), vy: +(b.vy.toFixed(2)),
            radius: +(b.radius.toFixed(2)), color:b.color, m: +(b.m.toFixed(2))}, null, ' ');
    }

    static fromString(s) {
        let o = JSON.parse(s);
        return new Ball(o.x, o.y, o.radius, o.color, o.vx, o.vy, o.m);
    }

    // вызывается, когда собраны точки касания
    move() {
        let b = this;

        // вычисляем равнодействующее ускорение
        let ax = 0;
        let ay = g;    // тяготение

        // суммируем ускорения от реакций точек касания
        for (let p of b.dots) {
            let d = G.dist(b, p);
            let r = b.radius - d;
            // единичный вектор
            let u = G.unit(p, b, d);
            //{x: (b.x - p.x) / d, y: (b.y - p.y) / d };

            // модуль упругости зависит от фазы - сжатие или расжатие шара
            let scalar = G.scalar({x: b.vx, y: b.vy}, u);
            let k = scalar > 0 ? K * W: K;

            ax += k * r * u.x;
            ay += k * r * u.y;
        }

        // изменение скорости
        b.vx += ax;
        b.vy += ay;
        // изменение координат
        b.x += b.vx;
        b.y += b.vy;
    }

}