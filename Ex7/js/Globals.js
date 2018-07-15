const MODE_STOP = 0;
const MODE_PLAY = 1;

const CREATE_MODE_BALL = 0;
const CREATE_MODE_LINE = 1;
const CREATE_MODE_LINK = 2;

let W = 0.5;    // к.п.д. при соударении (1 - без потерь)
let K = 0.1;    // модуль упругости (1 - твердый)
let g = 0.001;  // 0.002 = 1g;
const Wl = 0.99;  // 0.96 потери на связях

const INTERVAL = 20;
let intervalId;

const REPEATER = 10;
let PRETTY = 0;  // false

// for velocity drawing
const Kvelo = 100;
let pixInMeter = 1000;


//-------------------------------------------------------------------

let world = {
    toString() {
        let w = {W, K, g};
        return JSON.stringify(w);
    },

    fromString(s) {
        let o = JSON.parse(s);
        W = o.W;
        K = o.K;
        g = o.g;
     }
};

//-------------------------------------------------------------------

let canvas = document.getElementById("canvas");
let modeButton = document.getElementById("modeButton");
let restartButton = document.getElementById("restartButton");
let createButton = document.getElementById("createButton");
let prettyButton = document.getElementById("prettyButton");
let updateButton = document.getElementById("updateButton");
let eraseButton = document.getElementById("eraseButton");
let saveSceneButton = document.getElementById("saveSceneButton");
let graviRange = document.getElementById("graviRange");
let waistRange = document.getElementById("waistRange");
let rigidRange = document.getElementById("rigidRange");
let graviValue = document.getElementById("graviValue");
let waistValue = document.getElementById("waistValue");
let rigidValue = document.getElementById("rigidValue");
let ballDefinition = document.getElementById("ballDefinition");
let scenesDiv = document.getElementById("scenesDiv");
let redBallImg = document.getElementById("redBallImg");
let blueBallImg = document.getElementById("blueBallImg");
