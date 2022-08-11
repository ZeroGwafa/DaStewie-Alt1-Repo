//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";

let font = require("@alt1/ocr/fonts/chat_13px.js");

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

let imgs = A1lib.ImageDetect.webpackImages({
    "red": require("./images/red_interface.data.png"),
});

function find() {
    let img = A1lib.captureHoldFullRs();

    var poslist = img.findSubimage(imgs["red"]);
    if (poslist.length != 0) {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");  

        let img = A1lib.capture(poslist[0].x - 10, poslist[0].y - 24, 90, 24);
        ctx.drawImage(img.toImage(), 0, 0);

        let img2 = A1lib.captureHold(poslist[0].x - 10, poslist[0].y - 24, 90, 24);
        for (let xos = 0; xos < img2.width; xos++) {
            for (let yos = 0; yos < img2.height; yos++) {
                var str = alt1.bindReadColorString(img2.handle, "chat", A1lib.mixColor(255, 255, 255), xos, yos);
                // xos = 10, yos = 12 for red
                if (str.match(/Enrage/)) {
                    console.log("str: " + str + " xos: " + xos + " yos: " + yos);
                }
            }
        }
    }
}

// check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    setTimeout(find, 1000);
}