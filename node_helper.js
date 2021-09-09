/* Magic Mirror
 * Module: MMM-WOTD V2
 * Revised: 9/9/2021 - to use Axios
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting module: " + this.name);
		this.path = "modules/MMM-WOTD/wotd.json";
		this.wotd = {};
	},

	getDate: function() {
		return (new Date()).toLocaleDateString();
	},

	fileWrite: function() {
		fs.writeFile(this.path, JSON.stringify(this.wotd, null, '\t'), function(err) {
			if (err) {
				return console.log(err);
			}
		});
	},

	getWORD: function() {
		if (fs.existsSync("modules/MMM-WOTD/wotd.json")) {
			var temp = JSON.parse(fs.readFileSync("modules/MMM-WOTD/wotd.json", "utf8"));
			if (temp.timestamp === this.getDate()) {
				console.log("File already exists and date is right, sending data now [MMM-WOTD]");
				console.log("Enjoy Word of the Day! [MMM-WOTD] message end");
				this.sendSocketNotification('WORD_RESULT', temp);
			} else {
				var self = this;
				axios.get('https://www.dictionary.com/e/word-of-the-day/')
					.then(function(response) {
						const $ = cheerio.load(response.data);
						$('body').each(function(i, elem) {
							self.wotd.data = {
								day: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__date > div").text(),
								word: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__word > h1").text(),
								pronounce: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__pronunciation > div").text().replace(/\n/g, ''),
								grammar: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__pos-blocks > div > p:nth-child(1) > span > span").text(),
								definition: $(elem).find("div.otd-item-headword__pos-blocks > div > p:nth-child(2)").text(),
								mp3: $(elem).find("div.otd-item-headword__pronunciation > div > a").attr("href")
							};
							self.wotd.timestamp = self.getDate();
							self.fileWrite();
							self.sendSocketNotification('WORD_RESULT', self.wotd);
						});
					})
					.catch(function(error) {
						// handle error
						console.log(error);
					})
					.then(function() {
						// always executed
						console.log("File DOES NOT exist getting the data now [MMM-WOTD]1");
					});
			}
		} else {
			console.log("File DOES NOT exist sending to right function for data [MMM-WOTD] Step 1");
			var self = this;
			axios.get('https://www.dictionary.com/e/word-of-the-day/')
				.then(function(response) {
					const $ = cheerio.load(response.data);
					$('body').each(function(i, elem) {
						self.wotd.data = {
							day: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__date > div").text(),
							word: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__word > h1").text(),
							pronounce: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__pronunciation > div").text().replace(/\n/g, ''),
							grammar: $(elem).find("div:nth-child(1) > div.otd-item-wrapper-content > div.wotd-item > div > div.otd-item-headword__pos-blocks > div > p:nth-child(1) > span > span").text(),
							definition: $(elem).find("div.otd-item-headword__pos-blocks > div > p:nth-child(2)").text(),
							mp3: $(elem).find("div.otd-item-headword__pronunciation > div > a").attr("href")
						};
						self.wotd.timestamp = self.getDate();
						self.fileWrite();
						self.sendSocketNotification('WORD_RESULT', self.wotd);
					});
				})
				.catch(function(error) {
					// handle error
					console.log(error);
				})
				.then(function() {
					// always executed
					console.log("New file has been written [MMM-WOTD] Step 2");
					console.log("Enjoy Word of the Day! [MMM-WOTD] message end");
				});
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_WORD') {
			this.getWORD(payload);
		}
	}
});
