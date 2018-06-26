const W = 0.8;  // потеря энергии при соударении
const K = 1000;  // модуль упругости

const g = 0.05;
const INTERVAL = 30;

const G = function () {
    // ------------- закрытые члены --------------------------------------

    // Расстояние между точками
    function _distance (a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Скалярное произведение векторов
    function _scalar(a, b)
    {
        return a.x * b.x + a.y * b.y;
    }

    // Угол вектора (a, b) по отношению к оси Ox.
    function _angle(a, b)
    {
        let dx = b.x - a.x;
        let dy = b.y - a.y; // ось Oy вниз
        return Math.atan2(dy, dx);
    }

    // поворот вектора (x, y) на угол alpha
    function _turn(x, y, alpha) {
        let x1 = x * Math.cos(alpha) + y * Math.sin(alpha)
        let y1 =-x * Math.sin(alpha) + y * Math.cos(alpha)
        return {x: x1, y: y1};
    }


    return {
        // ------------- открытые члены --------------------------------------
        //
        dist: _distance,
        angle: _angle,
        turn: _turn,

        // поворот скорости шара a на угол alpha
        turnV(a, alpha) {
            let va = _turn(a.vx, a.vy, alpha)
            a.vx = va.x;
            a.vy = va.y;
        },

        //
        scalarV(a, b)
        {
            return a.vx * b.vx + a.vy * b.vy;
        },


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
res = G.turn(1, 0,  Math.PI / 2)
console.log(near(res.x, 0) && near(res.y, -1));
res = G.turn(1, 0,  Math.PI)
console.log(near(res.x, -1) && near(res.y, 0));
res = G.turn(1, 0,  -Math.PI / 2)
console.log(near(res.x, 0) && near(res.y, 1));
