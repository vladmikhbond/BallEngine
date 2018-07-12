class Box {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.balls = [];
        this.lines = [];
        this.links = [];
        this.border = [
            new Line(0, 0, w, 0), // top
            new Line(w, 0, w, h), // right
            new Line(w, h, 0, h), // bottom
            new Line(0, h, 0, 0), // left
        ];
    }

    // 0-stop, 1-play
    set mode(v) {
        if (v) {
            intervalId = setInterval(Box.step, INTERVAL, this);
        } else {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
    get mode() {
        return intervalId ? MODE_PLAY : MODE_STOP;
    }

    get SumEnergy() {
        let e = 0;
        this.balls.forEach( b => e += b.Energy);
        return e | 0;
    }

    get SumMomentum() {
        let e = 0;
        this.balls.forEach( b => e += b.Momentum);
        return e | 0;
    }

    //<editor-fold desc="Ball add & delete">

    addBall(b) {
        b.box = this;
        this.balls.push(b);
    }

    deleteBall(b) {
        let idx = this.balls.indexOf(b);
        if (idx === -1)
            return;
        this.balls.splice(idx, 1);
        if (this.balls.selected === b)
            this.balls.selected = null;
        // delete links
        for (let link of this.links.slice()) {
            if (link.b1 === b || link.b2 === b)
                this.deleteLink(link);
        }
    }

    deleteSelectedBall() {
        if (this.balls.selected) {
            this.deleteBall(this.balls.selected);
            this.balls.selected = null;
        }
    }


    // find a ball under a point
    ballUnderPoint(p) {
        for (let b of this.balls) {
            if (G.dist(p, b ) < b.radius) {
                return b;
            }
        }
        return null;
    }

    // find a ball which velocity is under a point
    ballVeloUnderPoint(p) {
        for (let b of this.balls) {
            let q = {x: b.x + b.vx * Kvelo, y: b.y + b.vy * Kvelo};
            if (G.dist(p, q ) < 3) {
                return b;
            }
        }
        return null;
    }

    //</editor-fold>

    //<editor-fold desc="Line add & delete">

    addLine(l) {
        this.lines.push(l);
    }

    deleteLine(l) {
        let idx = this.lines.indexOf(l);
        if (idx === -1)
            return;
        this.lines.splice(idx, 1);
        if (this.lines.selected === l)
            this.lines.selected = null;
    }

    deleteSelectedLine() {
        this.deleteLine(this.lines.selected);
    }

    //</editor-fold>

    //<editor-fold desc="Link add & delete">

    addLink(l) {
        this.links.push(l);
    }

    deleteLink(l) {
        let idx = this.links.indexOf(l);
        if (idx === -1)
            return;
        this.links.splice(idx, 1);
        if (this.links.selected === l)
            this.links.selected = null;
    }

    deleteSelectedLink() {
        this.deleteLink(this.links.selected);
    }

    //</editor-fold>


    static step(box) {
        for (let i = 0; i < REPEATER; i++) {

            //Box.dotsFromLinksMulty(box, 10);

            box.balls.forEach(b => b.dots = []);

            box.dotsFromLines();
            box.dotsFromBalls();
            box.dotsAboutLinks();
            box.dotsFromLinks();


            box.balls.forEach( b => b.move(0, g) )


        }
        canvas.dispatchEvent(new Event("drawAll"));
    }


    // собирает на шары точки касания с отрезками (в т.ч. с границами)
    //
    dotsFromLines() {
        for (let b of this.balls) {
            for (let l of this.lines.concat(this.border) ) {
                if (G.distToInfiniteLine(b, l) < b.radius) {
                    let p = G.cross(b, l);
                    if (p) {
                        // p - точка пересечения перпендикуляра в пределах отрезка
                        b.dots.push(p);
                    } else {
                        // точка пересечения за пределами отрезка
                        if (G.dist(b, l.p1) < b.radius) {
                            // касание 1-го конца отрезка
                            b.dots.push(l.p1);
                        }
                        if (G.dist(b, l.p2) < b.radius) {
                            // касание 2-го конца отрезка
                            b.dots.push(l.p2);
                        }
                    }
                }
             }
        }
    }

    // собирает на шары точки касания с шарами
    //
    dotsFromBalls() {
        for (let i = 0; i < this.balls.length - 1; i++ ) {
            for (let j = i + 1; j < this.balls.length; j++ ) {
                let b1 = this.balls[i], b2 = this.balls[j];
                let dot = this.touch(b1, b2);
                if (dot) {
                    b1.dots.push(dot);
                    b2.dots.push(dot);
                }
            }
        }


    }

    // деформация  шара тем больше, чем больше масса противоположного шара
    // деформации задают не силы (силы должны быть равны), а ускорения шаров
    //
    touch(b1, b2) {
        let d = G.dist(b1, b2);
        // шары далеко
        if (d > b1.radius + b2.radius )
            return;
        // ширина области деформации (области пересечения окружностей)
        let delta = b1.radius + b2.radius - d;
        // доля деформации для шара b2
        let delta2 = delta * b1.m / (b1.m + b2.m);

        // отношение расстояние от b1 до точки касания к расстоянию между шарами
        let k = (d - b2.radius + delta2) / d;

        // координаты точки касания
        let x = b1.x + (b2.x - b1.x) * k;
        let y = b1.y + (b2.y - b1.y) * k;
        return {x, y};
    }



    // собирает на шары виртуальные точки касания, обусловленные своей связью
    //
    dotsFromLinks() {
        for (let link of box.links) {
            let b1 = link.b1, b2 = link.b2, deX, deY;
            // придвинуть второй шар к первому
            let len = G.dist(b1, b2);
            let alpha = Math.atan2(b2.y - b1.y, b2.x - b1.x);

            let r = b1.radius + b2.radius;
            if (len < link.len0) {
                // compression
                deX = (link.len0 - r) * Math.cos(alpha);
                deY = (link.len0 - r) * Math.sin(alpha);
            } else if (len > link.len0){
                // extension
                deX = (link.len0 + r) * Math.cos(alpha);
                deY = (link.len0 + r) * Math.sin(alpha);
            } else {
                continue;
            }
            b2.x -= deX;
            b2.y -= deY;
            // найти точку касания
            let dot = this.touch(b1, b2);
            // вернуть на место второй шар
            b2.x += deX;
            b2.y += deY;
            if (dot) {
                dot.w = 1;
                // поместить точку касания на 1 шар
                b1.dots.push(dot);
                // отодвинуть точку касания и поместить на 2 шар
                let dot2 = {x: dot.x + deX, y: dot.y + deY, w: 1};
                b2.dots.push(dot2);
            }
        }
    }

    // собирает на шары виртуальные точки касания от ударов о чужие связи
    //
    dotsAboutLinks() {
        for (let b of this.balls) {
            for (let l of this.links) {
                if (b === l.b1 || b === l.b2)
                    continue;
                let line = new Line(l.x1, l.y1, l.x2, l.y2);
                let d = G.distToInfiniteLine(b, line);
                if (d > b.radius)
                    continue;
                let p = G.cross(b, line);  // на самом деле отрезок короче
                // точка пересечения за пределами связи
                if (!p)
                    continue;

                // общий размер области деформации
                let delta = b.radius - d;
                // доля деформации для шара и для гантели (dumbbell)
                let M = l.b1.m + l.b2.m;
                let deltaB = delta * M / (b.m + M);
                let deltaD = delta - deltaB;
                let len1 = G.dist(l.b1, p), len2 = l.len0 - len1;
                // распределение деформации гантели по шарам
                let delta1 = deltaD * len2 / l.len0;
                let delta2 = deltaD * len1 / l.len0;
                // точка касания для шара
                let k = d / (b.radius - deltaB);
                let x = (p.x - b.x) / k + b.x;
                let y = (p.y - b.y) / k + b.y;
                b.dots.push({x, y});

                // точки касания для шаров гантели
                // u - единичный векор перпедикуляра к связи
                let u = G.unit(p, b, d);
                // b1
                let r1 = l.b1.radius - delta1;
                let dot = {x: l.b1.x + r1 * u.x, y: l.b1.y + r1 * u.y};
                l.b1.dots.push(dot);
                // b2
                let r2 = l.b2.radius - delta2;
                dot = {x: l.b2.x + r2 * u.x, y: l.b2.y + r2 * u.y};
                l.b2.dots.push(dot);
            }

        }
    }

}
