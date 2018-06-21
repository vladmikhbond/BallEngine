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
        // изменение скорости при ударе о стенки
        if (this.x < this.radius || this.x > this.box.width - this.radius)
            this.vx = -this.vx;
        if (this.y < this.radius || this.y > this.box.height - this.radius)
            this.vy = -this.vy;

         // изменение координат
        this.x += this.vx;
        this.y += this.vy;
    }

}
