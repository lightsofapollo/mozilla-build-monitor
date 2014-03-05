var Consumer = require('amqpworkers/consumer');
var debug = require('debug')('consumer');
var upload = require('./upload');
var Promise = require('promise');
var https = require('https');
var fs = require('fs');
var tmp = require('tmp');

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
      console.log("Unrecognized payload", JSON.strinify(payload, null, 4));
      return true;
    }

    var props = payload.build.properties.reduce(function(prev, cur) {
      prev[cur[0]] = cur[1];
      return prev;
    }, {});

    if (platforms.indexOf(props.platform) === -1) {
      console.log('Unsupported platform', props.platform);
      return true;
    }

    if (props.branch !== 'mozilla-inbound') {
      console.log('Unsupported branch', props.branch);
      return true;
    }

    if (products.indexOf(props.product) === -1) {
      console.log('Unsupported product', props.product);
      return true;
    }

    var fileName = props.product + '-' + props.platform;
    return new Promise(function(resolve, reject) {
      tmp.file({prefix: fileName}, function(err, path) {
        if (err) {
          console.log('Failed to create tmp file', err);
          return reject(err);
        }

        var stream = fs.createWriteStream(path);
        console.log('fetching file from', props.build_url);

        if (!props.build_url) {
          console.log('build url was not found');
          return resolve();
        }

        https.get(props.build_url, function(res) {
          upload(fileName, stream, function(err, data) {
            console.log('RETURN FROM S3', err, data);
            if (err) {
              resolve(err);
            } else {
              resolve(data);
            }
          });
        });
      });
    });
  }
};

module.exports = BuildConsumer;
