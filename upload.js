var S3_BUCKET = process.env.S3_BUCKET ||
                'gaia-mozilla-b2g-builds';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = function(fileName, fileData, callback) {
  console.log('Uploading', fileName, AWS.config);
  s3.getObject({Bucket: S3_BUCKET, Key: fileName, Body: fileData}, callback);
};
