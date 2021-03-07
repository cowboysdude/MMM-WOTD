/* Magic Mirror
 * Module: MMM-WOTD
 *
 * By cowboysdude  
 * 
 */
Module.register("MMM-WOTD", {

    // Module config defaults.
    defaults: {
        updateInterval: 1 * 720 * 1000, // how often to load... This is set at 12 hours right now
        fadeSpeed: 2500,
        initialLoadDelay: 40, // 0 seconds delay
        retryDelay: 250,
        style: 'narrow',   // select wide or narrow and choose position
        word: 'white',     // word font color
        definition: 'white', // definition color
        say: 'white',    // pronunciation color
        wbackground: '#52523D',   //word background color -- left hand side
        dbackground: 'lightgray'  //definition, pronounciation etc color -- right hand side
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function() {
        return ["MMM-WOTD.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.today = "";
        this.wotd = {};
        this.scheduleUpdate();
    },

    getDom: function() {

       if(this.loaded == true){
        var wotd = this.wotd[0]; 

        var wrapper = document.createElement("div");

        var wordTable = document.createElement('table');
        if (this.config.style == 'narrow') {
            wordTable.classList.add('narrow');
        } else {
            wordTable.classList.add('wide');
        }

        var wordTR = document.createElement('tr');

        var word = document.createElement('td');
        word.classList.add('bright', 'small');
        word.setAttribute('style', 'background:' + this.config.wbackground);
        word.innerHTML = "Word  ";
        wordTR.appendChild(word);

        var word2 = document.createElement('td');
        word2.classList.add('small');
        word2.setAttribute("style", "color:" + this.config.word + "; background-color: " + this.config.dbackground + ";"); 
		word2.innerHTML = wotd.word;
        wordTR.appendChild(word2);

        wordTable.appendChild(wordTR);

        var wordTR2 = document.createElement('tr');

        var wordd = document.createElement('td');
        wordd.classList.add('bright', 'small');
        wordd.setAttribute('style', 'background:' + this.config.wbackground);
        wordd.innerHTML = "Meaning  ";
        wordTR2.appendChild(wordd);

        var wordd2 = document.createElement('td');
        wordd2.classList.add('small');
        wordd2.setAttribute('style', 'color:' + this.config.definition + '; background-color: ' + this.config.dbackground + ';');
        wordd2.innerHTML = wotd.definition;
        wordTR2.appendChild(wordd2);
        wordTable.appendChild(wordTR2);

        var wordTR3 = document.createElement('tr');

        var wordf = document.createElement('td');
        wordf.classList.add('bright', 'small');
        wordf.setAttribute('style', 'background:' + this.config.wbackground);
        wordf.innerHTML = "Say  ";
        wordTR3.appendChild(wordf);

        var wordf2 = document.createElement('td');
        wordf2.setAttribute('style', 'color:' + this.config.say + '; background-color: ' + this.config.dbackground + ';');
        wordf2.classList.add('small');
        wordf2.innerHTML = wotd.pronunciation;
        wordTR3.appendChild(wordf2);

        wordTable.appendChild(wordTR3);

        wrapper.appendChild(wordTable); 
	   
        return wrapper;
	   }
    },

    processWOTD: function(data) { 
        this.wotd = data;
		this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getWOTD();
        }, this.config.updateInterval); 
        this.getWOTD(this.config.initialLoadDelay);
    },
	
    getWOTD: function() {
        this.sendSocketNotification('GET_WOTD');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WOTD_RESULT") {
            this.processWOTD(payload);
            this.updateDom(this.config.initialLoadDelay);
        }
        this.updateDom(this.config.fadeSpeed);
    },
});