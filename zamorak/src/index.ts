//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
import * as Chatbox from "@alt1/chatbox";

import * as $ from "./jquery";
import { _timer } from "./timer.js";

// https://github.com/MarkvsRs/BarrowsHelperSrc/blob/main/src/index.ts

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

// Status for timer 
var running = false;
var output = document.getElementById("output");

const appColor = A1lib.mixColor(0, 255, 0);

const channeler = "Zamorak begins to draw power and energy";    // Chaos witch spawned

const flames_of_zamorak = "world will burn";		// Flames of zamorak
const infernal_tomb 	= "Step into the dark";		// Infernal tomb
const adrenaline_cage 	= "chaos, unfettered";		// Adrenaline cage
const chaos_blast		= "will tear you asunder";	// Chaos blast
const rune_dest			= "You're already dead";	// Rune of destruction


var msg = {
    "p1": [flames_of_zamorak, infernal_tomb, rune_dest],
    "p2": [infernal_tomb, adrenaline_cage, flames_of_zamorak],
    "p3": [adrenaline_cage, chaos_blast, infernal_tomb],
    "p4": [chaos_blast, rune_dest, adrenaline_cage],
    "p5": [rune_dest, flames_of_zamorak, chaos_blast],
    "p6": [flames_of_zamorak, infernal_tomb, rune_dest],
}

let reader = new Chatbox.default();
reader.readargs = {
  colors: [
    A1lib.mixColor(255,255,255),    // White
    A1lib.mixColor(127,169,255)     // Blue
  ]
};

function showSelectedChat(chat) {
    //Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
    try {
      alt1.overLayRect(
        appColor,
        chat.mainbox.rect.x,
        chat.mainbox.rect.y,
        chat.mainbox.rect.width,
        chat.mainbox.rect.height,
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
  
      if (localStorage.ccChat) {
        reader.pos.mainbox = reader.pos.boxes[localStorage.ccChat];
      } else {
        //If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
        reader.pos.mainbox = reader.pos.boxes[0];
      }
      showSelectedChat(reader.pos);
      setInterval(function () {
        readChatbox();
      }, 600);
    }
  }, 1000);

function readChatbox() {
  var opts = reader.read() || [];
  var chat = "";

  for (const a in opts) {
    chat += opts[a].text + " ";
  }
  console.log(chat);
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    setInterval(function(time) {
        readChatbox()
    }, 100);
    alt1.identifyAppUrl("./appconfig.json");
}