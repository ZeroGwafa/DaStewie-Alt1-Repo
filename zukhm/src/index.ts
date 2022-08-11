//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import { findChar } from "@alt1/ocr/dist";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

let imgs = A1lib.ImageDetect.webpackImages({
    "wave": require("./images/wave_interface.data.png"),
});

function debug() {
    let img = A1lib.captureHoldFullRs();

    let pos = {};
    var poslist = img.findSubimage(imgs["wave"]);
    if (poslist.length != 0) {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");  

        let img = A1lib.capture(poslist[0].x - 10, poslist[0].y - 24, 90, 24);
        ctx.drawImage(img.toImage(), 0, 0);

        pos = {
            x: poslist[0].x - 10,
            y: poslist[0].y - 24,
            w: 90,
            h: 24,
            xos: 59,
            yos: 12,
        }

        let img2 = A1lib.captureHold(poslist[0].x - 10, poslist[0].y - 24, 90, 24);
        for (let xos = 0; xos < img2.width; xos++) {
            for (let yos = 0; yos < img2.height; yos++) {
                var str = alt1.bindReadColorString(img2.handle, "chat", A1lib.mixColor(255, 255, 255), xos, yos);
                // xos: 59 yos: 12 to get the number (only)
                if (str.match(/Wave/)) {
                    console.log("str: " + str + " xos: " + xos + " yos: " + yos);
                }
                if (str.match(/\d+/)) {
                    console.log("str: " + str + " xos: " + xos + " yos: " + yos);
                }
            }
        }
    }
}

function find() {
    let img = A1lib.captureHoldFullRs();

    var poslist = img.findSubimage(imgs["wave"]);
    if (poslist.length == 0) return null;

    let pos = {
        x: poslist[0].x - 10,
        y: poslist[0].y - 24,
        w: 90,
        h: 24,
        xos: 24,
        yos: 12,
    };
    console.log(pos);
    return pos;
}

function read(pos) {
    let img2 = A1lib.captureHold(pos.x, pos.y, pos.w, pos.h);

    var str = alt1.bindReadColorString(img2.handle, "chat", A1lib.mixColor(255, 255, 255), pos.xos, pos.yos);
    var match = str.match(/(\d+)/);
    if (match) {
        console.log(+match[1]);
        return +match[1];
    }

    return null;
}

function slideShow(wave) {   
    if (wave == null) return;

    if (wave >= 1 && wave <= 5) {
        // Section 1
    } else 
    if (wave >= 6 && wave <= 10) {
        // Section 2
    } else 
    if (wave >= 11 && wave <= 15) {
        // Section 3
    }
}

// check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    let findInterface = setInterval(function () {
        let pos = find();
        if (pos) {
            clearInterval(findInterface);
            setInterval(function () {
                let wave = read(pos);
                slideShow(wave);
            }, 600);
        }
    }, 1000);

    // setInterval(debug, 1000);
}