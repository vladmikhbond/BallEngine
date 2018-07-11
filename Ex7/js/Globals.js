const MODE_STOP = 0;
const MODE_PLAY = 1;

const CREATE_MODE_BALL = 0;
const CREATE_MODE_LINE = 1;
const CREATE_MODE_LINK = 2;

let W = 0.5;  // к.п.д. при соударении (1 - без потерь)
let K = 0.1;  // модуль упругости (1 - твердый)
let g = 0.05;  // 0.05;

let INTERVAL = 20;
let intervalId;

let REPEATER = 10;
let PRETTY = 0;  // false

// for velocity drawing
const Kvelo = 100;

//-------------------------------------------------------------------

let world = {
    toString() {
        let w = {W, K, g}; //, INTERVAL, REPEATER};
        return JSON.stringify(w);
    },

    fromString(s) {
        let o = JSON.parse(s);
        W = o.W;
        K = o.K;
        g = o.g;
        // INTERVAL = o.INTERVAL;
        // REPEATER = o.REPEATER;
    }
};

//-------------------------------------------------------------------

let canvas = document.getElementById("canvas");
let modeButton = document.getElementById("modeButton");
let startButton = document.getElementById("startButton");
let createButton = document.getElementById("createButton");
let prettyButton = document.getElementById("prettyButton");
let updateButton = document.getElementById("updateButton");
let graviRange = document.getElementById("graviRange");
let waistRange = document.getElementById("waistRange");
let rigidRange = document.getElementById("rigidRange");
let graviValue = document.getElementById("graviValue");
let waistValue = document.getElementById("waistValue");
let rigidValue = document.getElementById("rigidValue");
let ballDefinition = document.getElementById("ballDefinition");
let scenesDiv = document.getElementById("scenesDiv");
let redBallImg = document.getElementById("redBallImg");
