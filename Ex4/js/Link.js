class Link {
    constructor(b1, b2) {
        this.b1 = b1;
        this.b2 = b2;
        this.len0 = G.dist(b1, b2);
    }

    get x1() {return this.b1.x}
    get y1() {return this.b1.y}
    get x2() {return this.b2.x}
    get y2() {return this.b2.y}
    get len() {return G.dist(this.b1, this.b2) }

    static link(l) {
        let b1 = l.b1, b2 = l.b2;
        // угол между линией и осью Ox
        let alpha = G.angle(b1, b2);
        // поворот связи до параллельности с Ox
        G.turnV(b1, alpha);
        G.turnV(b2, alpha);
        // пересчет скоростей шаров
        let M = b1.m + b2.m;
        b1.vx = b2.vx =
            (b1.m * b1.vx + b2.m * b2.vx) / M;
        // коррекция длины связи
        let dv = (l.len - l.len0) * 0.03;
        b1.vx += dv * b2.m / M;
        b2.vx -= dv * b1.m / M;

        // обратный поворот
        G.turnV(b1, -alpha);
        G.turnV(b2, -alpha);
    }
}





