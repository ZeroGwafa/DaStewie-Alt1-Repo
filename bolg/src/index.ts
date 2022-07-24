//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as BuffReader from "@alt1/buffs";
import * as OCR from "@alt1/ocr";
import { Canvas } from "canvas";

import * as $ from "./jquery";

var font = require("@alt1/ocr/fonts/pixel_digits_8px_shadow.js");

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

var imgs = A1lib.ImageDetect.webpackImages(
    {
        "bolg": require("./images/bolg.data.png"),
        "bolg_large": require("./images/bolg_large.data.png"),
	}
);


let reader = new BuffReader.default();


function showSelectedBuffs(chat) {
    var buffsize = 27;
	var gridsize = 30;
    console.log(chat);
    //Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
    try {
      alt1.overLayRect(
        A1lib.mixColor(0, 255, 0),
        chat.x,
        chat.y,
        chat.width,
        chat.height,
        2000,
        5
      );
    } catch { }
}

//Find all visible chatboxes on screen
let findChat = setInterval(function () {
    if (reader.pos === null)
        reader.find();
    else {
        clearInterval(findChat);
        var square = reader.getCaptRect();
        showSelectedBuffs(square);

        setInterval(function () {
            readBuffs();
        }, 100);
    }
}, 1000);

function readBuff(buffer: ImageData, ox: number, oy: number) {
    var lines: string[] = [];
    // For numbers without brackets dx, dy = [2, 10]
    // For numbers with brackets    dx, dy = [1, 20]

    for (var dx = 1; dx <= 2; dx++) {
        for (var dy = 10; dy <= 20; dy += 10) {
            var result = OCR.readLine(buffer, font, [255, 255, 255], ox + dx, oy + dy, true);
            if (result.text) { 
                lines.push(result.text); 
            }
        }
    } 
    return lines;
}

function readBuffs() {
    var opts = reader.read() || [];
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgs.bolg_large.toImage(), 0, 0, canvas.width, canvas.height);

    for (const a in opts) {
        if (opts[a].compareBuffer(imgs.bolg)) {            
            let img = opts[a].buffer.toImage();

            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);        
            ctx.drawImage(img, opts[a].bufferx, opts[a].buffery, 27, 27, 0, 0, canvas.width, canvas.height);
        }
    }
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
}