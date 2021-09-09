/* Magic Mirror
 * Module: MMM-WOTD
 *
 *
 * Cowboysdude
 */
Module.register("MMM-WOTD", {

	defaults: {
		updateInterval: 5 * 60 * 1000,
		loaddelay: 5000,
		word: 'black',
		definition: '#669966',
		pronounce: '#fff',
		gram: 'black',
		wbackground: '#996',
		dbackground: 'lightgray',
		did: false
	},

	getStyles: function() {
		return ["MMM-WOTD.css"]
	},
	getScripts: function() {
		return ["moment.js"]
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.word = {};
		this.scheduleUpdate();
	},

	getDom: function() {


		var wotd = this.wotd;

		var wrapper = document.createElement("div");

		var date_word = document.createElement("div");
		date_word.classList.add("bright", "small", "center");
		date_word.innerHTML = wotd.day;
		wrapper.appendChild(date_word);

		var wordTable = document.createElement('table');
		wordTable.classList.add('narrow');

		var wordTR = document.createElement('tr');

		var word = document.createElement('td');
		word.classList.add('bright', 'small');
		word.setAttribute('style', 'background:' + this.config.wbackground + ';');
		word.innerHTML = "Word     ";
		wordTR.appendChild(word);


		function play() {
			var audio = document.getElementById("audio");
			audio.play();
		};

		var play = `<input type="image" id="myimage" style="height:20px;width:20px;"src="modules/MMM-WOTD/images/headphones.png" onclick="play()">
                    <audio id="audio" src="${wotd.mp3}"></audio>`

		var word2 = document.createElement('td');
		word2.classList.add('small');
		word2.setAttribute("style", "color:" + this.config.word + "; background-color: " + this.config.dbackground + "; padding: 3px 3px 3px 3px;");
		word2.innerHTML = wotd.word;
		wordTR.appendChild(word2);

		wordTable.appendChild(wordTR);

		var wordTR22 = document.createElement('tr');

		var wordsay = document.createElement('td');
		wordsay.classList.add('bright', 'small');
		wordsay.setAttribute('style', 'background:' + this.config.wbackground + ';');
		wordsay.innerHTML = "Say     ";
		wordTR22.appendChild(wordsay);

		var wordsay2 = document.createElement('td');
		wordsay2.classList.add('small');
		wordsay2.setAttribute('style', 'color:' + this.config.pronounce + '; background-color: ' + this.config.dbackground + '; padding: 3px 3px 3px 3px;');
		wordsay2.innerHTML = wotd.pronounce + "   " + play;
		wordTR22.appendChild(wordsay2);

		wordTable.appendChild(wordTR22);

		var wordTR2 = document.createElement('tr');

		var wordd = document.createElement('td');
		wordd.classList.add('bright', 'small');
		wordd.setAttribute('style', 'background:' + this.config.wbackground + ';');
		wordd.innerHTML = "Meaning    ";
		wordTR2.appendChild(wordd);

		var wordd2 = document.createElement('td');
		wordd2.classList.add('small');
		wordd2.setAttribute('style', 'color:' + this.config.definition + '; background-color: ' + this.config.dbackground + '; padding: 3px 3px 3px 3px;');
		wordd2.innerHTML = wotd.definition;
		wordTR2.appendChild(wordd2);
		wordTable.appendChild(wordTR2);

		var wordTR3 = document.createElement('tr');

		var wordf = document.createElement('td');
		wordf.classList.add('bright', 'small');
		wordf.setAttribute('style', 'background:' + this.config.wbackground + ';');
		wordf.innerHTML = "Grammar    ";
		wordTR3.appendChild(wordf);

		var wordf2 = document.createElement('td');
		wordf2.setAttribute('style', 'color:' + this.config.gram + '; background-color: ' + this.config.dbackground + '; padding: 3px 3px 3px 3px;');
		wordf2.classList.add('small');
		wordf2.innerHTML = wotd.grammar;
		wordTR3.appendChild(wordf2);

		wordTable.appendChild(wordTR3);

		wrapper.appendChild(wordTable);

		if (this.config.did == true) {

			function cutString(s, n) {
				var cut = s.indexOf(' ', n);
				if (cut == -1) return s;
				return s.substring(0, cut)
			}
			var s = wotd.know;

			var did_you_know = document.createElement('div');
			did_you_know.classList.add("bright", "xsmall");
			did_you_know.innerHTML = cutString(s, 300);
			wrapper.appendChild(did_you_know);
		}

		return wrapper;


	},

	processWORD: function(data) {
		this.today = data.Today;
		this.wotd = data.data;
		console.log(this.wotd);

	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getWORD();
		}, this.config.updateInterval);
		this.getWORD();
	},

	getWORD: function() {
		console.log("GO get word!");
		this.sendSocketNotification('GET_WORD');
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "WORD_RESULT") {
			this.processWORD(payload);
		} else {
			this.updateDom(this.config.loaddelay);
		}
		this.updateDom();
	}

});
