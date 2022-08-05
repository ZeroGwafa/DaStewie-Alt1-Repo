/* TODO LIST
 * Beamtimer keeps running after kill
 * Use buff bar for virus attack
 */
 
 // Get HSL color (red/orange/green) - input 0-100%
 function getColor(value) {
	var hue = (value * 1.2).toString(10);
	return "hsl(" + hue + ",75%,50%)";
}

function sanitisePercentage(i){
    return Math.min(100,Math.max(0,i));   
}

// Draw img for debuff
function drawImg(buf) {
	var size, rawcapture, image, ctx, cnv, capturex, capturey, color, pixelindex, red, green, blue;
	cnv = elid("capturecnv");
	ctx = cnv.getContext("2d");
	image = buf.toImage();

	//reset the canvas and draw the image
	cnv.style.width = image.width + "px";
	cnv.style.height = image.height + "px";
	cnv.width = image.width;
	cnv.height = image.height;
	ctx.drawImage(image, 0, 0);
}

function docapture() {
	readTelos.find();
}

 
var UI = new telosInterface();
var oldphase, newphase, beam_time;

function start() {
	if (true || window.alt1) {
		localStorage.removeItem('settings');
		UI.init();
		UI.telosMenu();

		var chatboxFinder = setInterval(function () {
			var found = reader.find();
			if (found != null) {
				console.log("Found chatbox ");
				clearInterval(chatboxFinder);
			}
		}, 600);
		
		readTelos.find();
		setInterval(function(time) {
			readChatbox();
			// Check for phase transitions.
			newphase = readTelos.readPhase();
			if (newphase != null && newphase != oldphase) {
				oldphase = newphase;
				if (newphase in readTelos.beamchange) {
					beamTimer.reset(beam_time = readTelos.beamchange[newphase][0]);
					beamTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
				} else {
					beamTimer.reset(0);
					beamTimer.stop();
				}
				readTelos.updateNextAttack();
				//$("#last_attack").html("Last attack: P" + readTelos.lastAttack[0] + " " + readTelos.lastAttack[1]);
				//$("#next_attack").html("Next attack: P" + readTelos.phase + " " + readTelos.nextAttack);
				$("#last_attack > td:first").html("Last attack: ");
				$("#last_attack > td:last").html("P" + readTelos.lastAttack[0] + " " + readTelos.lastAttack[1].replace(/^\w/, c => c.toUpperCase()));
				$("#next_attack > td:first").html("Next attack: ");
				$("#next_attack > td:last").html("P" + readTelos.phase + " " + readTelos.nextAttack.replace(/^\w/, c => c.toUpperCase()));
			}
			if (readTelos.phase == 5 && UI.settings['showP5'] == 1) {
				var atk = readTelos.countP5() || readTelos.P5count;
				$(".crty-header").text("Telos attacks: " + atk);
			}
		}, UI.settings['refreshRate']);
	} else {
		$("#telosMenu").html('<a href="alt1://addapp/http://holycoil.nl/alt1/telosApp/appconfig.json">Click here to add this app</a>'); 
	}
}

var readTelos = new TelosReader();
var FreedomTimer = new _timer(function(time) {
	// Why was this here?
	// if (readTelos.enrage == -1) return;
	
	var secs_left = (Math.floor(time / 600) * 0.6 ).toFixed(1);
	var telos_cd = readTelos.freedomCooldown();
	
	var percent = sanitisePercentage(secs_left / telos_cd * 1000);
	if (UI.settings['stepless'] == 1) percent = sanitisePercentage(time / telos_cd);
	
	$("#freedom_timer").html("Time until freedom: <br>" + secs_left + " seconds.");
	$("#freedomBar").width(percent + "%");
	
	if (readTelos.phase == 5 && ((telos_cd / 10) - secs_left) <= 6) {
		$("#freedomBar").css('background-color', '#6600cc');
	} else {
		$("#freedomBar").css('background-color', getColor(percent));
	}
	
	if (time <= 0) {
		FreedomTimer.stop();
	}
});


var beamTimer = new _timer(function(time) {
	var secs_left = (Math.floor(time / 600) * 0.6 ).toFixed(1);
	$("#beam_timer").html("Time until change: <br>" + secs_left + " seconds.");
	
	var percent = sanitisePercentage(secs_left / beam_time * 1000);
	if (UI.settings['stepless'] == 1) percent = sanitisePercentage(time / beam_time);
	
	$("#beamBar").width(percent + "%");
	$("#beamBar").css('background-color', getColor(percent));
	
	if (secs_left <= 0) {
		if (oldphase in readTelos.beamchange) {
			beamTimer.reset(beam_time = readTelos.beamchange[oldphase][1]);
		}
	}
});

var vulnTimer = new _timer(function(time) {
	var vuln_time = 600; // 60 seconds
	var secs_left = (Math.floor(time / 600) * 0.6 ).toFixed(1);
	$("#vuln_timer").html("Time until vuln wears off: <br>" + secs_left + " seconds.");
	
	var percent = sanitisePercentage(secs_left / vuln_time * 1000);
	if (UI.settings['stepless'] == 1) percent = sanitisePercentage(time / vuln_time);
	
	$("#vulnBar").width(percent + "%");
	$("#vulnBar").css('background-color', getColor(percent));
	
	if (time <= 0) {
		vulnTimer.stop();
	}
});


var instaTimer = new _timer(function(time) {
	var insta_time = 126; // 60 seconds
	var secs_left = (Math.floor(time / 600) * 0.6 ).toFixed(1);
	$("#insta_timer").html("Time until insta kill: <br>" + secs_left + " seconds.");
	
	var percent = sanitisePercentage(secs_left / insta_time * 1000);
	if (UI.settings['stepless'] == 1) percent = sanitisePercentage(time / insta_time);
	
	$("#instaBar").width(percent + "%");
	$("#instaBar").css('background-color', getColor(percent));
	
	if (time <= 0) {
		instaTimer.stop();
	}
});

var reader = new window.Chatbox.default();
var old_freedom = [];
var old_vuln 	= [];
var old_insta   = [];
var old_attacks = [];
var old_lines 	= [];
var stamps_used = false;
function readChatbox() {
	reader.diffRead = !stamps_used;
	reader.readargs = {
		colors: [
		a1lib.mixcolor(132,212,119),
		a1lib.mixcolor(255,255,255),
		a1lib.mixcolor(127,169,255),
		a1lib.mixcolor(119,159,240),
		a1lib.mixcolor(127,169,255),
		a1lib.mixcolor(195,16,16),
		a1lib.mixcolor(0,255,0),
		a1lib.mixcolor(255,0,0)
		
		//	[132, 212, 119],
		//	[255, 255, 255]
		],
		backwards: true
	};
	var minoverlap 	= 50;
	var new_lines 	= [];
	var opts 		= reader.read() 		|| [];
	var phase 		= readTelos.readPhase() || readTelos.phase;
	
	// Filter old readings
	if (stamps_used) {
		//console.log('stamps found!');
		for (var a = 0; a < opts.length; a++) {
			//console.log("unfiltered: " + opts[a].text);
			var match = false;
			for (var i = 0; i < old_lines.length; i++) {
				if (reader.matchLines(opts[a].text, old_lines[i].text)) {
					match = true;
					break;
				}
			}
			if (!match) {
				old_lines.push(opts[a]);
				new_lines.push(opts[a]);
			}
		}
		if (old_lines.length > minoverlap) old_lines.splice(0, old_lines.length - minoverlap); 
		opts = new_lines;
	}
	for (var a = 0; a < opts.length; a++) {
		// Get the timestamp of the line
		console.log(opts[a].text);
		var stamp = opts[a].text.match(/(\d\d:\d\d:\d\d)/);
		if (stamp) stamps_used = true;
		// Instance made
		if (opts[a].text.indexOf("Telos, the Warden") !== -1) {
			readTelos.phase = 1;
			readTelos.lastAttack = ["1", "N/A"];
			readTelos.nextAttack = "tendril";
			beamTimer.reset(0);
			beamTimer.stop();
		}
		
		// Get enrage
		var m = opts[a].text.match(/(\d{1,4})% enrage/);
		if (m) {
			readTelos.enrage = +m[1];
			console.log("Enrage: " + readTelos.enrage);
		}
		
		// Update attack, if stamps are used, check if not an old attack
		function update(attack) {
			if (stamp) {
				if (old_attacks.indexOf(stamp[1]) == -1) {
					readTelos.lastAttack = [phase, attack];
					readTelos.updateNextAttack();
					old_attacks.push(stamp[1]);
				}
			} else {
				readTelos.lastAttack = [phase, attack];
				readTelos.updateNextAttack();
			}
		}
		/*********
		// Special attacks
		if (opts[a].text.indexOf("me strength") !== -1) {
			update("uppercut");
		}
		if (opts[a].text.indexOf("to the source") !== -1) {
			update("tendril");
		}
		if (opts[a].text.indexOf("invader") !== -1) {
			update("stun");
		}
		if (opts[a].text.indexOf("cleanses you") !== -1) {
			update("virus");
		}
		if (opts[a].text.indexOf("consume you") !== -1) {
			update("anima");
		}
		
		// Telos used Freedom
		if (opts[a].text.indexOf("free from its bindings") !== -1) {
			
			readTelos.readEnrage(); // Update enrage
			if (stamp) {
				if (old_freedom.indexOf(stamp[1]) == -1) {
					FreedomTimer.reset(readTelos.freedomCooldown());
					FreedomTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
					old_freedom.push(stamp[1]);
				}
			} else {
				FreedomTimer.reset(readTelos.freedomCooldown());
				FreedomTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
			}
		}
		
		// Vuln has been used
		if (opts[a].text.indexOf("hex to your target") !== -1) {
			if (stamp) {
				if (old_freedom.indexOf(stamp[1]) == -1) {
					vulnTimer.reset(600);
					vulnTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
					old_vuln.push(stamp[1]);
				}
			} else {
				vulnTimer.reset(600);
				vulnTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
			}
		}		
		**********/
		
	
		// Special attacks
		if (opts[a].text.indexOf("Gielinor, give me strength") !== -1) {
			update("uppercut");
		}
		if (opts[a].text.indexOf("Your anima will return to the source") !== -1) {
			update("tendril");
		}
		if (opts[a].text.indexOf("Hold still, invader") !== -1) {
			update("stun");
		}
		if (opts[a].text.indexOf("The anima stream cleanses you") !== -1) {
			update("virus");
		}
		if (opts[a].text.indexOf("the anima consume you") !== -1) {
			update("anima");
		}
		
		// Telos used Freedom
		if (	opts[a].text.indexOf("Telos breaks free from its bindings") !== -1
			 || opts[a].text.indexOf("Telos entkommt") !== -1 ) {
			
			readTelos.readEnrage(); // Update enrage
			if (stamp) {
				if (old_freedom.indexOf(stamp[1]) == -1) {
					FreedomTimer.reset(readTelos.freedomCooldown());
					FreedomTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
					old_freedom.push(stamp[1]);
				}
			} else {
				FreedomTimer.reset(readTelos.freedomCooldown());
				FreedomTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
			}
		}
		
		// Vuln has been used
		if (opts[a].text.indexOf("hex to your target") !== -1) {
			if (stamp) {
				if (old_freedom.indexOf(stamp[1]) == -1) {
					vulnTimer.reset(600);
					vulnTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
					old_vuln.push(stamp[1]);
				}
			} else {
				vulnTimer.reset(600);
				vulnTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
			}
		}
		
		// Insta kill 
		if (opts[a].text.indexOf("font to interrupt") !== -1) {
			if (stamp) {
				if (old_insta.indexOf(stamp[1]) == -1) {
					instaTimer.reset(132);
					instaTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
					old_insta.push(stamp[1]);
				}
			} else {
				instaTimer.reset(132);
				instaTimer.start(UI.settings['stepless'] == 1 ? 10 : 100);
			}
		}
		
		//$("#last_attack").html("Last attack: P" + readTelos.lastAttack[0] + " " + readTelos.lastAttack[1]);
		//$("#next_attack").html("Next attack: P" + readTelos.phase + " " + readTelos.nextAttack);
		$("#last_attack > td:first").html("Last attack: ");
		$("#last_attack > td:last").html("P" + readTelos.lastAttack[0] + " " + readTelos.lastAttack[1].replace(/^\w/, c => c.toUpperCase()));
		$("#next_attack > td:first").html("Next attack: ");
		$("#next_attack > td:last").html("P" + readTelos.phase + " " + readTelos.nextAttack.replace(/^\w/, c => c.toUpperCase()));
	}
}