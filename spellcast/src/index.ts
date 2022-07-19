//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as Chatbox from "@alt1/chatbox";

import * as $ from "./jquery";

// https://github.com/MarkvsRs/BarrowsHelperSrc/blob/main/src/index.ts

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

var spells = {
	shadow: {
		en: "set to: Shadow Barrage",
		fr: "Deluge d'ombre",
		de: "eingestellt: Schatten-Donner",
		url: "images/Shadow_Barrage.data.png"
	},
	blood: {
		en: "set to: Blood Barrage",
		fr: "Deluge de sang",
		de: "eingestellt: Blut-Donner",
		url: "images/Blood_Barrage.data.png",
	},
	ice: {
		en: "set to: Ice Barrage",
		fr: "Deluge de glace",
		de: "eingestellt: Eis-Donner",
		url: "images/Ice_Barrage.data.png",
	},
	incite: {
		en: "set to: Incite",
		fr: "du sort Incitation",
		de: "eingestellt: Furchterregung",
		url: "images/Incite_Fear.data.png",
	},
	exsang: {
		en: "set to: Exsang",
		fr: "du sort Exsanguination",
		de: "eingestellt: Ausblutung",
		url: "images/Exsanguinate.data.png",
	},
	ruby: {
		en: "set to: Ruby",
		fr: "du sort Aurore de rubis",
		de: "eingestellt: Rubin-Aurora",
		url: "images/Ruby_Aurora.data.png",
	}

};


const appColor = A1lib.mixColor(0, 255, 0);

let reader = new Chatbox.default();
reader.readargs = {
  colors: [
    A1lib.mixColor(255,255,255),	// White
	A1lib.mixColor(127,169,255)		// Blue
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

function compare(str1: string, str2: { en: string; fr: string; de: string; }) {
    // Compare all languages with the input string
    return str1.toLowerCase().includes(str2.en.toLowerCase()) ||
           str1.toLowerCase().includes(str2.fr.toLowerCase()) ||
           str1.toLowerCase().includes(str2.de.toLowerCase());
}

function readChatbox() {
	var opts = reader.read() || [];
	var chat = "";

	for (const a in opts) {
		chat += opts[a].text + " ";
	}	
	console.log(chat);

	for (const idx in opts) {
		for (const spell in spells) {
			if (compare(opts[idx].text, spells[spell])) {
				console.log(spell);
				$("#spell_img").attr("src", spells[spell].url);
			}
		}
	}
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	console.log("Starting Alt1 Spellcast");
	alt1.identifyAppUrl("./appconfig.json");
}