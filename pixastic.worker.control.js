importScripts("pixastic.js");
importScripts("pixastic.effects.js");

var worker = new Pixastic.Worker();

worker.onmessage = function(message) {
    postMessage(message.data);
}

onmessage = function(message) {
    worker.postMessage(message.data);
}

