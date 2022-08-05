//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as BuffReader from "@alt1/buffs";

let font = require("@alt1/ocr/fonts/pixel_digits_8px_shadow.js");

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

let imgs = A1lib.ImageDetect.webpackImages(
    {
        "bolg": require("./images/bolg.data.png"),
        "bolg_empty": require("./images/bolg_empty.data.png"),
        "bolg_small": require("./images/bolg_small.data.png"),
        "bolg_medium": require("./images/bolg_medium.data.png"),
        "bolg_large": require("./images/bolg_large.data.png"),
	}
);

// Search for bolg buff by using images. This is a slow method but does support medium and large buffs.
let buff_sizes = [ "bolg_small", "bolg_medium", "bolg_large" ];
function readBuffsByImage() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");

    // Clear the canvas and draw the empty buff icon
    ctx.drawImage(imgs.bolg_empty.toImage(), 0, 0, canvas.width, canvas.height);   

    let img = A1lib.captureHoldFullRs();
    
    let sizes = {
        "bolg_small": 27, 
        "bolg_medium": 32, 
        "bolg_large": 36
    }

    // Look for the current phase
    for (let key in buff_sizes) {
        let name = buff_sizes[key];
        let img_found = img.findSubimage(imgs[name]);
        if (img_found.length > 0) { 
            // At zamorak there is a mechanic with the same icon, the last one is always bolg.
            let last_item = img_found.length-1;
            let size = sizes[name];
            let buff = A1lib.capture(img_found[last_item].x, img_found[last_item].y, size, size);
            
            ctx.drawImage(buff.toDrawableData().toImage(), 0, 0, size, size, 0, 0, canvas.width, canvas.height);
            
            // Only look for this buff size from now on
            buff_sizes = [ buff_sizes[key] ];
            break;
        }
    }
}


let reader = new BuffReader.default();
function showSelectedBuffs(chat) {
    let buffsize = 27;
	let gridsize = 30;
    console.log(chat);
    // Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
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
    let opts = reader.read() || [];
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");

    // Clear the canvas and draw the empty buff icon
    ctx.drawImage(imgs.bolg_empty.toImage(), 0, 0, canvas.width, canvas.height);

    // At zamorak there is a mechanic with the same icon, the last one is always bolg
    // Reverse the order of the buffs so that the last one is the one we want.
    for (const a in opts.reverse()) {
        if (opts[a].compareBuffer(imgs.bolg)) {            
            let img = opts[a].buffer.toImage();

            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);        
            ctx.drawImage(img, opts[a].bufferx, opts[a].buffery, 27, 27, 0, 0, canvas.width, canvas.height);
            break;
        }
    }
}


document.getElementById("canvas").onclick = function () {
    // Toggle the image search setting
    if (localStorage["bolg_search"] == "true") {
        localStorage["bolg_search"] = "false";
    } else {
        localStorage["bolg_search"] = "true";
    }

    console.log("Using image search: " + localStorage["bolg_search"]);
    alt1.setTooltip("Using image search: " + localStorage["bolg_search"]);

    // Reload the window to apply changes
    setTimeout(function () {
        window.location.reload();
    }, 1000);
}

// check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");

    if (localStorage["bolg_search"] == "true") {
        setInterval(function () {
            readBuffsByImage();
        }, 100);
    } else {
        let findBuffBar = setInterval(function () {
            if (reader.pos === null)
                reader.find();
            else {
                clearInterval(findBuffBar);
                let square = reader.getCaptRect();
                showSelectedBuffs(square);
        
                setInterval(function () {
                    readBuffs();
                }, 100);
            }
        }, 1000);
    }

    if (!localStorage["bolg_search"]) {
        // Do not use the inefficient method that supports multiple sizes by default
        localStorage["bolg_search"] = "false";	
    }
}