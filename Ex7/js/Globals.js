let W = 0.5;  // потеря энергии при соударении  0.5
let K = 0.1;  // модуль упругости

let g = 0.05;  // 0.05;
let INTERVAL = 30;
let intervalId;

let REPEATER = 10;
let PRETTY = 0;  // false

let world = {
    toString() {
        let w = {W, K, g, INTERVAL, REPEATER};
        return JSON.stringify(w, null, '  ');
    },

    fromString(s) {
        let o = JSON.parse(s);
        W = o.W;
        K = o.K;
        g = o.g;
        INTERVAL = o.INTERVAL;
        REPEATER = o.REPEATER;
    }
}

