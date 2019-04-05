// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var CryptoJS = require("crypto-js");
var uuidv4 = require('uuid/v4');
// Set the region
AWS.config.update({
  region: 'us-west-2'
});

var ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
});
var TABLE_NAME = 'ORDERS';

exports.handler = (event, context, callback) => {
  var ciphertext = event.items;
  var decrypted = CryptoJS.AES.decrypt(ciphertext, "yoguthefeeder").toString(CryptoJS.enc.Utf8);
  var date = new Date().getTime();
  var item = {
    'UUID': {
      S: uuidv4()
    },
    'CUSTOMER_NAME': {
      S: event.name
    },
    'CUSTOMER_EMAIL': {
      S: event.email
    },
    'ORDER_JSON': {
      S: decrypted
    },
    'TIMESTAMP': {
      N: String(date)
    },
    'ORDER_STATUS': {
      S: "0"
    },
  };
  if (event.sms == true && event.phone) {
    item['CUSTOMER_PHONE'] = {
      S: event.phone
    };
  }
  if (event.comments) {
    item['COMMENT'] = {
      S: event.comments
    };
  }
  var params = {
    TableName: TABLE_NAME,
    Item: item
  };

  ddb.putItem(params, (err, data) => {
    if (!err) {
      callback(null, 200);
    } else {
      callback(err, 503);
    }
  });
};