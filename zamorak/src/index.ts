//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as A1lib from "@alt1/base";
import * as ChatboxReader from "@alt1/chatbox";

import * as $ from "./jquery";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

const appColor = A1lib.mixColor(0, 255, 0);

var phase = A1lib.ImageDetect.webpackImages(
    {
        "p1": require("./images/edicts_1.data.png"),
        "p2": require("./images/edicts_2.data.png"),
        "p3": require("./images/edicts_3.data.png"),
        "p4": require("./images/edicts_4.data.png"),    
        "p5": require("./images/edicts_5.data.png"),
        "p6": require("./images/edicts_6.data.png")
	}
);


// Spec order:
// https://cdn.discordapp.com/attachments/992218608602189854/996933729933082784/K1u9v5j.png
const entry = {
    en: "But this is as far as you go",
    fr: "pas plus loin",
    // de: "Aber dies ist die letzte Stelle"
}

const channeler = "Zamorak begins to draw power and energy";  
const flames_of_zamorak = {
    name: "Flames of Zamorak",
    en: "world will burn",
    fr: "Que ce monde",
    // de: "welt wird zum brennen",
    tooltip: `   
- Zamorak will yell "The world will burn." and slam into the ground, 
  dealing 2 melee hits and spawning Flames of Zamorak between 
  the player with aggression and Zamorak
- To deal with this, all players walk under boss, :DeflectMelee: 
  and use defensives if low hp
- Black smoke (Flames of Zamorak) goes towards the a random player, 
  the more smoke that is absorbed by a player the higher the typeless hit on them will be.
  If not picked up Zamorak gets a damage reduction applied to him
`,
}
const infernal_tomb = {
    name: "Infernal Tomb",
    en: "into the dark",
    fr: "Avancez dans les",
    // de: "in den schwarzen Tiefen",
    tooltip: `
- Zamorak says "Step into the dark... meet your death.", 
  targets players, assigns a rune to them overhead and 
  transports them to Infernus where greater demons are marching 
  towards a portal to the main arena
- Most players elect to use a quick couple abilities to kill 
  the demons (ideally :caroming4: :gchain: → ability)
- Players must go to the pad with the same 
  corresponding rune they received overhead
    - At higher enrages, it is highly suggested to pre-stun 
      Zamorak and defeat all demons before exiting
`
}
const adrenaline_cage = {
    name: "Adrenaline Cage",
    en: "chaos, unfettered",
    fr: "LE CHAOS",
    // de: "chaos, ungefesselt",
    tooltip: `
- Zamorak will say "Chaos, unfettered!" then drop 
  the prayers of those affected by the attack, 
  preparing to bombard base with heavy magic attacks.
- Remain still, :DeflectMage: and use :debil: , :reflect: or :devo:
`
}
const chaos_blast = {
    name: "Chaos Blast",
    en: "will tear you",
    fr: "vais vous mettre",
    // de: "wird dich zerstören",
    tooltip: `
- Zamorak will charge up his attack shouting "I will tear you asunder!"
- To deal with the mechanic successfully stun him enough times, 
  after such a damage requirement will appear to force him 
  to launch the attack early
- He will yell Feel the rage of a god. and send a red projectile 
  that deals up to 25,000 soft typeless damage - this is 
  reduced based on how fast he is interrupted
- Use :vitality: / :res: / :disrupt: , at higher enrages you may need to use :immort:
`
}
const rune_dest = {
    name: "Rune of Destruction",
    en: "already dead",
    fr: "votre mort est",
    // de: "bereits tot",
    tooltip: `
- Zamorak will yell "You're already dead." and lay a massive 
  red rune around him, with a gap between two circles
- Black sludge will run clockwise or counterclockwise 
  sometimes changing direction and applies stuns to those caught in it
- Standing in the red areas will deal rapid soft typeless damage
- The player cannot teleport to Infernus and runes cannot 
  be charged for the duration of the attack
`
}
    	

var msg = {
    "p1": [flames_of_zamorak, infernal_tomb, rune_dest],
    "p2": [infernal_tomb, adrenaline_cage, flames_of_zamorak],
    "p3": [adrenaline_cage, chaos_blast, infernal_tomb],
    "p4": [chaos_blast, rune_dest, adrenaline_cage],
    "p5": [rune_dest, flames_of_zamorak, chaos_blast],
    "p6": [flames_of_zamorak, infernal_tomb, rune_dest],
}

let reader = new ChatboxReader.default();
reader.readargs = {
    colors: [
        A1lib.mixColor(255,255,255),    // White (Timestamp)
        A1lib.mixColor(127,169,255),    // Blue (Timestamp)
        A1lib.mixColor(153,255,153),    // Green (Zamorak's voice)
        A1lib.mixColor(232,4,4)         // Red (Zamorak)
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

    parseMessages(opts);
}

function compare(str1: string, str2: { en: string; fr: string; }) {
    // Compare all languages with the input string
    return str1.toLowerCase().includes(str2.en.toLowerCase()) ||
           str1.toLowerCase().includes(str2.fr.toLowerCase());
}

function getPhase() {
    var current_phase = 1;

    var img = A1lib.captureHoldFullRs();

    // Look for the current phase
    for (let key in phase) {
        var img_found = img.findSubimage(phase[key]).length > 0;
        if (img_found) {
            break;
        }
        current_phase++;
    }

    // No phase found
    if (current_phase > 6) {
        current_phase = -1;
    }

    return current_phase;
}

function updateUI(current_phase) {
    $("#phase").text("Phase " + current_phase);
    $("#spec tr > td").each(function( index ) {
        $(this).text(msg["p" + current_phase][index].name);
        $(this).attr('title', (msg["p" + current_phase][index].tooltip))
    });
}


var last_phase = 1;
var next_spec  = 0;
var has_increased = false;
function parseMessages(lines) {
    var new_phase = getPhase();
    var current_phase = new_phase == -1 ? last_phase : new_phase;    
    
    if(current_phase != last_phase) {
        last_phase = current_phase;

        // Spec skipped
        if (!has_increased) {
            // Go back and follow red arrow in the chart
            // Always goes to 3rd spec unless it was the second spec skipped
            next_spec--;
            next_spec = next_spec == 1 ? 0 : 2;
            console.log("Skipped a spec");
        } else {
            // Go back and down following the black arrow in the chart
            next_spec--; 
            if (next_spec < 0) next_spec = 2;
        }
        updateUI(current_phase);
        has_increased = false;
    }

    for (const a in lines) {
        for (let b = 0; b < msg["p" + current_phase].length; b++) {
            if (compare(lines[a].text, entry)) {
                console.log("New kill");
                has_increased = false;
                current_phase = 1;
                updateUI(current_phase);
                next_spec = 0;
            }
            if (compare(lines[a].text, msg["p" + current_phase][b])) {
                next_spec = b + 1;
                has_increased = true;

                if (next_spec > 2) next_spec = 0;

                console.log("Next spec: " +  next_spec + " Phase: " + current_phase);
                break;
            }
        }
    }

    $("#spec tr").removeClass("selected");
    $("#spec tr").eq(next_spec).addClass("selected");
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    updateUI(1);
}