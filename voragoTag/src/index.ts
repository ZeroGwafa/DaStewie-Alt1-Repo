//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
import * as Chatbox from "@alt1/chatbox";

// https://github.com/MarkvsRs/BarrowsHelperSrc/blob/main/src/index.ts

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");


var output = document.getElementById("output");

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

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {

	alt1.identifyAppUrl("./appconfig.json");
}