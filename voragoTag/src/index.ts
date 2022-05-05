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



var zero_hp = A1lib.ImageDetect.webpackImages(
	{
		rago: require("./images/zero_hp.data.png"),
		scop: require("./images/scop_zero.data.png"),
		test: require("./images/test.data.png")
	}
);





const appColor = A1lib.mixColor(0, 255, 0);

let reader = new Chatbox.default();
reader.readargs = {
  colors: [
    A1lib.mixColor(255,255,255),
	A1lib.mixColor(127,169,255)
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

function findZeroHp() {
	var img = A1lib.captureHoldFullRs();
	var foundRago = img.findSubimage(zero_hp.scop);
	var foundScop = img.findSubimage(zero_hp.rago);	
	var foundTest = img.findSubimage(zero_hp.test);
	if (foundScop.length != 0 || foundRago.length != 0 || foundTest.length != 0)
	{
		return true;
	}
	return false;
}

function getColor(value) {
	var hue = (value * 1.2).toString(10);
	return "hsl(" + hue + ",75%,50%)";
}
function sanitisePercentage(i){
    return Math.min(100,Math.max(0,i));   
}

var beamTimer = new _timer(function(time) {
	let secs_left: number = parseFloat((Math.floor(time / 600) * 0.6 ).toFixed(1));
	$("#beam_timer").html(secs_left + "s");
	
	var percent = sanitisePercentage(secs_left / 246 * 1000);
	
	$("#beamBar").width(percent + "%");
	$("#beamBar").css('background-color', getColor(percent));
	if (time <= 0) {
		beamTimer.stop();
		running = false;
	}
});

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	setInterval(function(time) {
		if (!running && findZeroHp()) {
			running = true;
			beamTimer.reset(246);
			beamTimer.start(10);
		}
	}, 100);
	alt1.identifyAppUrl("./appconfig.json");
}