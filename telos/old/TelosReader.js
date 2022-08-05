ImageData.fromBase64(function(i) {
		TelosReader.phaseImg = i
	},
	'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC30lEQVRYR+2UX0hTcRTHv3PTa1HmKtGk4YsWlSnON1suayqZ9ZCbisR8sVVIJkQMhJ6CsL9mVlJaIMUm/smIwIdAwXRao0CICMUHUYjSzW3NP1PvbpzfuNeb2Fvgyz0v93d+5/zOOfdzzu+nSk1OEAQuFqrQEgS1Bip+FaKQHl4OISqGY/ukk6z3EW3i/kZx1vuIOVRUQE/ve6RnZEqJXR8GUFluZjrZai5WYWpyUrLLFxsVJf+BjQqW77EC+lxuFBTk4/vYODtbX1+PaLUazQ23IdoW/R62979FKsCUn49QIJJEl5KCF44O6A+nY/TrN3xyu1FijhDpffcWNReq2Jr82pxd7Evy7HET7ty8wdZElOiJQmfoLImt+jKu1V2PtFMkIC+AjLwQxpXaq5iYmMCMxwOjIQfBxRDTjYYjiFXxLMCevTqMfB7FCs/D6/UiOyMd6vAK2tq78KixAc7uN8xPq9WCAw+LxYLyc1acKS6CJzC/VoD4F+RMM1BcdJIdJAI2mw39/X3QJWhZS6jY1d9ziIpSsWCFp07DkGtk/mlpqQgH/TAYjWhsbsGTpka8bnfA7/chHBbwsqMbOUdzJTJ/ERgbj8wAyVYuBsm7dkgJg95fbE8sgNpVXVPLUDfcu4uh4Y8YGHKhtLQU/LyPtXIhtAzr+Uuw2+2sbcODA3j4tBUOZzteOZz/boF80OQJKahcd3T24HlrCzo6O5F56CAG3V9wYP8+0MAaj+UxkiS5pkJUWCthLTPDZDKh1l6HohN52LaFi7SAhqXEbJGGUF7Aeptcz8rSS4NG1zQufgf0+mxGgOiIg0bxCo8bMegaYVTPllXg1v0HawRoNTXrQ5J2u3TV2P3WaNgDRbbExN2IoceIi8X09A8k7Yxjvku8gOmfsywY6bwgQJcQD00MB58/wAZNFJohLlrDHrRAcAEzc36o5H+7GWulAIWAQkAhoBBQCCgEFAIKAYXAphP4Az52Y2lqTMyvAAAAAElFTkSuQmCC'
);
ImageData.fromBase64(function(i) {
		TelosReader.enrageImg = i
	},
	'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAPCAYAAAAs9AWDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC4SURBVChTY1hXpfd/ca7y/1mZsv9npkn/d1GU+8+wKEfqPwhPTRL9X+wl9d9JWhVVEKQKLDg/QwystdBJ8r+rjMZ/L1nt/wxzUkTAqpwUVcCCIAwWBJkFUwVX6aWiAhewllb6z1DjIwQ2HCyoqAOxqDcIqhIoAJIAm9npKwi3GYQh2l35/oNUw2wH6QALNvtAVMPMZgAJ1LoJ/AcZA1MNFgS5AERnO0Dcy9AUKPofhEESINpJUeU/AOcfg+dPddKjAAAAAElFTkSuQmCC'
);


function TelosReader() {
	var me = this;
	
	this.phase = 1;
	this.enrage = -1;

	this.lastAttack = ["1", "N/A"];
	this.nextAttack = "tendril";
	this.P5count = 0;

	// Beam changes in 1/10th of a second. First value is on phase start. The second value is every other beam after that
	// Maybe changing this to time until first beam
	this.beamchange = {
		"2": [320, 210],
		"3": [320, 210],
		"5": [331, 372]
	}
	
	// First number is last phase. Second number the current phase
	this.specialAttacks = {
		"1": {
			"N/A": {
				"1": "tendril",
				"2": "tendril",
				"3": "uppercut",
				"4": "uppercut",
				"5": "virus"
			},
			"tendril": {
				"1": "uppercut",
				"2": "stun",
				"3": "stun or virus",
				"4": "stun",
				"5": "virus"
			},
			"uppercut": {
				"1": "stun",
				"2": "stun",
				"3": "uppercut", 
				"4": "uppercut",
				"5": "virus"
			},
			"stun": {
				"1": "tendril",
				"2": "tendril",
				"3": "virus", 
				"4": "anima",
				"5": "virus"
			}
		},
		"2": {
			"tendril": {
				"2": "stun",
				"3": "stun or virus", 
				"4": "anima",
				"5": "virus"
			},
			"stun": {
				"2": "virus",
				"3": "uppercut", 
				"4": "stun",
				"5": "virus"
			},
			"virus": {
				"2": "uppercut",
				"3": "uppercut", 
				"4": "stun",
				"5": "virus"
			},
			"uppercut": {
				"2": "tendril",
				"3": "uppercut", 
				"4": "stun",
				"5": "virus"
			}
		},
		"3": {
			"uppercut": {
				"3": "stun", 
				"4": "uppercut",
				"5": "virus"
			},
			"stun": {
				"3": "virus", 
				"4": "anima",
				"5": "virus"
			},
			"virus": {
				"3": "uppercut", 
				"4": "stun",
				"5": "virus"
			}
		},
		"4": {
			"uppercut": {
				"4": "anima",
				"5": "virus"
			},
			"anima": {
				"4": "stun",
				"5": "virus"
			},
			"stun": {
				"4": "uppercut",
				"5": "virus"
			}
		},
		"5": {
			"virus": {
				"5": "Insta kill"
			},
			"N/A": {
				"1": "tendril",
				"5": "tendril"
			}
		}
	}


	// Freedom cooldown after freeing - Telos breaks free from its bindings.
	// Telos will be immune for 6 seconds after freeing on phase 5 at 250% enrage and above
	// Values are in 1/10th seconds (seconds * 10)
	this.freedomCooldown = function() {
		if (this.enrage < 250) {
			return 300;
		}
		if (this.enrage <= 999) {
			return 186; 
		}
		if (this.enrage >= 1000) {
			return 96;
		}
	}

	// Still unsure how this works but these values seem to work on different resolutions
	this.enrage_pos = null;
	this.phase_pos = null;
	this.find = function(img) {
		if (!img) img = a1lib.bindfullrs();
		if (!img) return null;
		
		var phaseImg = a1lib.findsubimg(img, TelosReader.phaseImg);
		if (phaseImg.length != 0) {
			this.phase_pos = {
				x: phaseImg[0].x - 5,
				y: phaseImg[0].y - 5,
				w: 60,
				h: 24,
				xos: 10,
				yos: 12
			}
			console.log(this.phase_pos);
		}

		var enrageImg = a1lib.findsubimg(img, TelosReader.enrageImg);
		if (enrageImg.length != 0) {
			this.enrage_pos = {
				x: enrageImg[0].x + 5,
				y: enrageImg[0].y + 1,
				w: 100,
				h: 40,
				xos: 11,
				yos: 13
			}
			console.log(this.enrage_pos);
		}
	}
	
	this.updateNextAttack = function() {
		if (!this.phase_pos) {
			this.find();
		}
		if (!this.phase_pos) {
			return null;
		}
		me.readPhase();
		var lastPhase = me.lastAttack[0];
		var lastAttack = me.lastAttack[1];
		if (lastPhase && lastAttack) {
			if (me.specialAttacks[lastPhase][lastAttack]) {
				me.nextAttack = me.specialAttacks[lastPhase][lastAttack][me.phase];
			} else {
				console.log("last phase: " + lastPhase + " Lastattack: " + lastAttack);
			}

		}
	}
	this.countP5 = function () {
		if (!this.phase_pos) {
			return null;
		}
		var pos = this.phase_pos;
		
		if (this.phase == 5) {
			var width = 160
			var buffer = a1lib.getregion(pos.x + pos.w + 30, pos.y - 4, 200, 5);
			
			var b;
			for (b = 0; b < 200; b++) {
				var i = buffer.pixelOffset(b + 7, 2);
				if (coldiff(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], 18, 22, 22) < 20) {
					break;
				}
			}
			// Removing minion spawn
			var atk = [0,4,10,/*17,*/ 23,30,36,42,49,55,62,68,74,81,87,94,100,106,113,119,126,132,138,145,151,158].indexOf(b);
			if (atk != -1) {
				this.P5count = atk;
				return this.P5count;
			}
			
		}
		return null;
	}

	this.readPhase = function() {
		if (!this.phase_pos) {
			return null;
		}
		var pos = this.phase_pos;
		var img = a1lib.bindregion(pos.x, pos.y, pos.w, pos.h);

		// Find the string in the region
		var str = alt1.bindReadColorString(img.handle, "chat", a1lib.mixcolor(255, 255, 255), pos.xos, pos.yos);
		var m = str.match(/Phase: (\d{1})/);
		
		if (!m) {
			return null;
		}
		this.phase = +m[1];
		
		return this.phase;
	}

	this.readEnrage = function() {
		if (!this.enrage_pos && !this.phase_pos) {
			this.find();
		}
		if (!this.enrage_pos) {
			return null;
		};
		var pos = this.enrage_pos;
		var img = a1lib.bindregion(pos.x, pos.y, pos.w, pos.h);
		//drawImg(a1lib.getregion(x, y, w, h)); // Debug info

		// Find the string in the region
		var str = alt1.bindReadColorString(img.handle, "chat", a1lib.mixcolor(255, 255, 255), pos.xos, pos.yos);
		console.log(str);
		var m = str.match(/Enrage: (\d{1,4})%/);
		if (!m) {
			m = str.match(/Rage: (\d{1,4})/);
		}
		if (!m) {
			return null;
		}
		this.enrage = +m[1];
		
		return this.enrage;
	}
}