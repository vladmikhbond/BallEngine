
class Ball {
    constructor(x, y, r, c, vx, vy, m) {
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

    step() {
        let b = this;

        b.fx = 0;
        b.fy = b.m * g;  // тяготение

        // собираем на шар точки касания
        b.dots = [];
        for (let l of b.box.lines.concat(b.box.border) ) {
            let p = G.cross(b, l);
            if (G.dist(p, b) < b.radius) {
                b.dots.push(p);
            }
        }

        // вычисляем силу
        for (let p of b.dots) {
            let d = G.dist(b, p);
            let r = b.radius - d;
            let u = {x: (b.x - p.x) / d, y: (b.y - p.y) / d }; // ед.вектор
            // модуль упругости зависит от фазы - сжатие или расжатие шара
            let k = G.scalar({x: b.vx, y: b.vy}, u) > 0 ? K * W: K;
            let fx = k * r * u.x;
            let fy = k * r * u.y;
            b.fx += fx;
            b.fy += fy;
        }


        // изменение скорости
        b.vx += b.fx / b.m;
        b.vy += b.fy / b.m;
        // изменение координат
        b.x += b.vx;
        b.y += b.vy;
    }

}