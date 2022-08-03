//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as BuffReader from "@alt1/buffs";

var font = require("@alt1/ocr/fonts/pixel_digits_8px_shadow.js");

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

var imgs = A1lib.ImageDetect.webpackImages(
    {
        "black": require("./images/black.data.png"),
        "bright": require("./images/bright.data.png"),
        "trans": require("./images/bright.data.png"),
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

function readBuffs() {
    var opts = reader.read() || [];
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgs.trans.toImage(), 0, 0, canvas.width, canvas.height);
    

    for (const a in opts) {
        if (opts[a].compareBuffer(imgs.trans)) {    
            let img = opts[a].buffer.toImage();

            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);        
            ctx.drawImage(img, opts[a].bufferx, opts[a].buffery, 27, 27, 0, 0, canvas.width, canvas.height);
            break;
        }
    }
}

// check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");

    let findBuffBar = setInterval(function () {
        if (reader.pos === null)
            reader.find();
        else {
            let black_img = imgs.black;
            let bright_img = imgs.bright;
        
            console.log(black_img);
            
            for (let i = 0; i < black_img.width; i++) {
                for (let j = 0; j < black_img.height; j++) {
                    let pixel1 = bright_img.getPixel(i, j);
                    let pixel2 = black_img.getPixel(i, j);
                    for (let k = 0; k < 4; k++) {  
                        if (pixel1[k] != pixel2[k]) {
                            // No match 
                            bright_img.setPixel(i, j, [0, 0, 0, 0]);
                        }
                    }
                }
            }
        
            imgs.trans = bright_img;


            clearInterval(findBuffBar);
            var square = reader.getCaptRect();
            showSelectedBuffs(square);
    
            setInterval(function () {
                readBuffs();
            }, 100);
        }
    }, 1000);


}