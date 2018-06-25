// time
let khronos;
let timer;
let INTERVAL = 30;

// world constants
const W = 1;   //0.9;
const g = 0.05;  // 0.05;


const G = function () {
    // ------------- закрытые члены --------------------------------------

    // Расстояние между точками
    function _distance (a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Скалярное произведение векторов
    // function _scalar(a, b)
    // {
    //     return a.x * b.x + a.y * b.y;
    // }

    // Угол вектора (a, b) по отношению к оси Ox.
    function _angle(a, b)
    {
        let dx = b.x - a.x;
        let dy = b.y - a.y; // ось Oy вниз
        return Math.atan2(dy, dx);
    }

    // поворот вектора (x, y) на угол alpha
    function _turn(x, y, alpha) {
        let x1 = x * Math.cos(alpha) + y * Math.sin(alpha);
        let y1 =-x * Math.sin(alpha) + y * Math.cos(alpha);
        return {x: x1, y: y1};
    }


    return {
        // ------------- открытые члены --------------------------------------
        //
        dist: _distance,
        angle: _angle,
        turn: _turn,

        // поворот скорости шара a на угол alpha
        //
        turnV(a, alpha) {
            let va = _turn(a.vx, a.vy, alpha);
            a.vx = va.x;
            a.vy = va.y;
        },


        // расстояние от точки до бесконечной прямой
        //
        distToInfiniteLine(p, line) {
            let a = line.A, b = line.B, c = line.C;
            return Math.abs(a * p.x + b * p.y + c) /  Math.sqrt(a * a + b * b);
        },

        // точка пересечения прямой line и перпендикуляра к ней, опущенного из точки p
        //
        crossPerpen(p, line) {
            let k = line.k;
            let b = line.b;
            let p1 = line.p1;
            let p2 = line.p2;

            // прямая вертикальна
            if (line.x1 === line.x2)
                return { x: line.x1, y: p.y };
            // прямая горизонтальна
            if (line.y1 === line.y2)
                return { x: p.x, y: line.y1 };
            // уравнение перпендикуляра, проходящего через точку p: y = k1 * x + b1
            let k1 = -1 / k;
            let b1 = p.y - k1 * p.x;
            // уравнение прямой: y = k2 * x + b2
            let k2 = k;
            let b2 = b;

            // точка пересечения перепендикуляра и прямой
            let dot = { x: (b1 - b2) / (k2 - k1), y: (k2 * b1 - k1 * b2) / (k2 - k1) };

            // точка пересечения лежит в пределах отрезка
            if ((p1.x <= dot.x && dot.x <= p2.x || p2.x <= dot.x && dot.x <= p1.x) &&
                (p1.y <= dot.y && dot.y <= p2.y || p2.y <= dot.y && dot.y <= p1.y) )
                return dot;
            return null;
        },



    //
        // scalarV(a, b)
        // {
        //     return a.vx * b.vx + a.vy * b.vy;
        // },


    }
}();

///////////////////////////////////////////////////////////////
function near(a, b) {
    return Math.abs(a - b) < 0.00000001;
}




// angle tests
// let res = _G.angle({x: 0, y: 0}, {x: 1, y: 0} )
// console.log(res == 0)
// res = G.angle({x: 0, y: 0}, {x: 0, y: 1} )
// console.log(res == - Math.PI / 2)
// res = G.angle({x: 0, y: 0}, {x: -1, y: 0} )
// console.log(res == Math.PI)
// res = G.angle({x: 0, y: 0}, {x: 0, y: -1} )
// console.log(res == Math.PI / 2)


// turn tests
res = G.turn(1, 0,  Math.PI / 2);
console.log(near(res.x, 0) && near(res.y, -1));
res = G.turn(1, 0,  Math.PI);
console.log(near(res.x, -1) && near(res.y, 0));
res = G.turn(1, 0,  -Math.PI / 2);
console.log(near(res.x, 0) && near(res.y, 1));
