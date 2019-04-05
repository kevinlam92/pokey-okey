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

var stripe = require("stripe")("sk_test_fLrrGhlF2eaveIPhWqjjC7vq");

exports.handler = (event, context, callback) => {
  var token = event.token;
  var uuid = uuidv4();

  var ciphertext = event.items;
  var decrypted = CryptoJS.AES.decrypt(ciphertext, "yoguthefeeder").toString(CryptoJS.enc.Utf8);
  var decryptedJson = JSON.parse(decrypted);
  var date = new Date().getTime();

  var total = 0;
  var quantity = 0;
  for (let order in decryptedJson) {
    total += decryptedJson[order].price * decryptedJson[order].quantity;
    quantity += decryptedJson[order].quantity;
  }
  total *= 100;
  total *= 1.05;

  var item = {
    'UUID': {
      S: uuid
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
    'PAYMENT_STATUS': {
      S: "STRIPE PAID"
    },
    'BILLING_TOKEN': {
      S: token
    }
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

  console.log(decrypted);
  console.log(total);

  (async () => {
    const charge = await stripe.charges.create({
      amount: total,
      currency: "cad",
      source: token,
      metadata: {
        order_id: uuid,
        order_json: decrypted
      }
    });
    if (charge.status == 'succeeded') {
      ddb.putItem(params, (err, data) => {
        if (!err) {
          callback(null, 200);
        } else {
          callback(err, 503);
        }
      });
    }
  })();
};