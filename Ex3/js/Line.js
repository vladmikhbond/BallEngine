class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.len = G.dist({x: x1, y: y1}, {x: x2, y: y2});
    }

    // вспомогательные параметры линии для разных формул
    get A() { return this.y2 - this.y1; }
    get B() { return this.x1 - this.x2; }
    get C() { return this.x2 * this.y1 - this.x1 * this.y2; }
    get k() { return (this.y1 - this.y2) / (this.x1 - this.x2); }
    get b() { return this.y1 + this.x1 * (this.y2 - this.y1) / (this.x1 - this.x2); }

    get p1() { return { x: this.x1, y: this.y1 } }
    get p2() { return { x: this.x2, y: this.y2 } }

    // shift(dx, dy) {
    //     this.x1 += dx;
    //     this.y1 += dy;
    //     this.x2 += dx;
    //     this.y2 += dy;
    // };

}





