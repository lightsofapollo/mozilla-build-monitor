var Consumer = require('amqpworkers/consumer');
var debug = require('debug')('consumer');
var upload = require('./upload');
var Promise = require('promise');
var http = require('http');

var platforms = [
  'macosx64',
  'linux',
  'linux64'
];

var products = [
  'firefox',
  'b2g-desktop',
  'xul-runner'
];

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

    if (!payload || !payload.build || !payload.build.properties) {
      //console.log("Unrecognized payload", JSON.strinify(payload, null, 4));
      return true;
    }

    var props = payload.build.properties.reduce(function(prev, cur) {
      prev[cur[0]] = cur[1];
      return prev;
    }, {});

    if (platforms.indexOf(props.platform) === -1) {
      //console.log('Unsupported platform', props.platform);
      return true;
    }

    if (props.branch !== 'mozilla-inbound') {
      //console.log('Unsupported branch', props.branch);
      return true;
    }

    if (products.indexOf(props.product) === -1) {
      //console.log('Unsupported product', props.product);
      return true;
    }

    return new Promise(function(resolve, reject) {
      http.get(props.build_url, function(res) {
        var fileName = props.product + '-' + props.platform;
        upload(fileName, res, function(err, data) {
          console.log('RETURN FROM S3', err, data);
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    });
  }
};

module.exports = BuildConsumer;
