/* Magic Mirror
 * Module: MMM-WOTD
 *
 * By Cowboysdude
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    getWOTD: function() {
        var self = this;
        request({
            url: "https://random-words-api.vercel.app/word",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var apiResponse = JSON.parse(body);
                console.log(apiResponse);
                this.sendSocketNotification("WOTD_RESULT", apiResponse); 
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WOTD') {
            this.getWOTD(payload);
        }
    }
});