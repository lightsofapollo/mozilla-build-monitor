var Consumer = require('amqpworkers/consumer');
var debug = require('debug')('consumer');

function BuildConsumer() {
  Consumer.apply(this, arguments);
}

BuildConsumer.prototype = {
  __proto__: Consumer.prototype,

  read: function(message) {
    var debug = require('debug')('consuming!');
    // this message format is defined here
    // http://hg.mozilla.org/automation/mozillapulse/file/f5fb7628a206/mozillapulse/publishers.py
    var payload = message.payload;
    var meta = message._meta;

    console.log(meta.routing_key);

    // read is cast into a promise so unless you throw an error it will be
    // resolved and the messages will be ack'ed.
    return true;
  }
};

module.exports = BuildConsumer;
