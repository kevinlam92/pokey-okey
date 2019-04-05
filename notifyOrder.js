// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({
  region: 'us-west-2'
});

var UPDATE_ORDER_ENDPOINT = "https://cnifdxegb9.execute-api.us-west-2.amazonaws.com/prod/updateorder";

const prefixCategoryMap = {
  buildBase: 'Base',
  buildProtein: 'Protein',
  buildExtraProtein: 'Extra Protein',
  buildVegetable: 'Vegetables',
  buildExtraVegetables: 'Extra Vegetables',
  buildSauce: 'Sauce',
  buildDry: 'Dry Toppings',
  buildPremium: 'Premium Toppings',
  signatureSize: 'Size',
  signatureBase: 'Base',
  signatureAddOn: 'Add On',
  signatureAddExtra: 'Add Extra',
  comment: 'Comments'
};

exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    if (record.eventName == 'DELETE') return;
    // console.log('Stream record: ', JSON.stringify(record, null, 2));

    var name = record.dynamodb.NewImage.CUSTOMER_NAME.S;
    var timestamp = record.dynamodb.NewImage.TIMESTAMP.N;
    var email = record.dynamodb.NewImage.CUSTOMER_EMAIL.S;
    var phone = "";
    if (record.dynamodb.NewImage.CUSTOMER_PHONE) {
      if (record.dynamodb.NewImage.CUSTOMER_PHONE.S.length == 10)
        phone = record.dynamodb.NewImage.CUSTOMER_PHONE.S;
    }
    var order = JSON.parse(record.dynamodb.NewImage.ORDER_JSON.S);
    var uuid = record.dynamodb.NewImage.UUID.S;
    var comment = "";
    if (record.dynamodb.NewImage.COMMENT) {
      comment = record.dynamodb.NewImage.COMMENT.S;
    }

    var commentString = "";
    if (comment) {
      commentString = "\nAdditional Comments: " + comment + "\n";
    }

    var summaryString = "Order Summary:\n";
    for (var i = 0; i < order.length; i++) {
      var item = order[i];
      summaryString += "\n\tQty: " + item.quantity + "\t" + item.name + "\n";

      if (item.details) {
        var detailKeys = Object.keys(item.details);

        for (var j = 0; j < detailKeys.length; j++) {
          var keyName = prefixCategoryMap[detailKeys[j]];
          var detailString = "\t\t" + keyName + ":\n";
          var detailValues = item.details[detailKeys[j]];
          for (var k = 0; k < detailValues.length; k++) {
            detailString += "\t\t\t" + detailValues[k] + "\n";
          }
          summaryString += detailString;
        }
      }
    }

    if (record.eventName == 'INSERT') {
      var orderNumberString = "Order ID: " + uuid.toUpperCase() + "\n\n";

      var customerNameString = "Name: " + name + "\n";
      var customerEmailString = "Email: " + email + "\n";
      var customerPhoneString = "Phone: " + (phone.length > 0 ? phone : "N/A") + "\n\n";

      var updateOrderString = "Click to print order preparation sheet: " + UPDATE_ORDER_ENDPOINT + "?uuid=" + uuid + "&order_status=1\n\n";
      var finishOrderString = "Click to notify when order is ready: " + UPDATE_ORDER_ENDPOINT + "?uuid=" + uuid + "&order_status=2\n\n";

      var emailString = orderNumberString + customerNameString + customerEmailString + customerPhoneString + updateOrderString + finishOrderString + commentString + summaryString;

      // Create sendEmail params
      var params = {
        Destination: {
          /* required */
          ToAddresses: [
            'kevinlam92@gmail.com',
          ]
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: emailString
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'New Order from ' + name
          }
        },
        Source: 'kevinlam92@gmail.com',
        ReplyToAddresses: [
          'noreply@pokeyokey.com',
        ],
      };

      // Create the promise and SES service object
      new AWS.SES({
        apiVersion: '2010-12-01'
      }).sendEmail(params).promise().then(
        (data) => {
          console.log("New order email sent: " + data.MessageId);
          callback(null, 200);
        }).catch(
        (err) => {
          console.error(err, err.stack);
          callback(null, 503);
        });

    } else if (record.eventName == 'MODIFY') {
      var old_status = record.dynamodb.OldImage.ORDER_STATUS.S;
      var new_status = record.dynamodb.NewImage.ORDER_STATUS.S;
      console.log("Incoming stream order status update from " + old_status + " to " + new_status);

      if (old_status == "0" && new_status == "1") {
        var confirmationString = "Hello " + name + ",\n\n";
        confirmationString += "We just wanted to let you know that your order is confirmed and we have started working on your order. For your records we've attached a copy of your order summary below.\n\n";
        confirmationString += summaryString;
        confirmationString += commentString;
        confirmationString += "\nSincerely,\nThe Pokey Okey Team";
        //Preparing
        var confirmation_email_params = {
          Destination: {
            /* required */
            ToAddresses: [
              email,
            ]
          },
          Message: {
            Body: {
              Text: {
                Charset: "UTF-8",
                Data: confirmationString
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'Pokey Okey Order Confirmation - Order ID ' + uuid.substring(0, 8).toUpperCase()
            }
          },
          Source: 'kevinlam92@gmail.com',
          ReplyToAddresses: [
            'noreply@pokeyokey.com',
          ],
        };

        // Create the promise and SES service object
        new AWS.SES({
          apiVersion: '2010-12-01'
        }).sendEmail(confirmation_email_params).promise().then(
          (data) => {
            console.log("Confirmation email sent: " + data.MessageId);
            callback(null, 200);
          }).catch(
          (err) => {
            console.error(err, err.stack);
            callback(null, 503);
          });
      } else if (old_status == 1 && new_status == 2) {
        //Done
        var readyString = "Hello " + name + ",\n\n";
        readyString += "Good news, your order is now ready for pick up!\n\n";
        readyString += "Payment will be collected in store. We accept cash, credit cards (Visa, MasterCard, AMEX), WeChat Pay and Alipay. ";
        readyString += "Don't forget to bring your stamp card!\n\n";
        readyString += "Sincerely,\nThe Pokey Okey Team";
        var ready_email_params = {
          Destination: {
            /* required */
            ToAddresses: [
              email,
            ]
          },
          Message: {
            Body: {
              Text: {
                Charset: "UTF-8",
                Data: readyString
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'Pokey Okey Order Ready for Pickup - Order ID ' + uuid.substring(0, 8).toUpperCase()
            }
          },
          Source: 'kevinlam92@gmail.com',
          ReplyToAddresses: [
            'noreply@pokeyokey.com',
          ],
        };

        // Create the promise and SES service object
        new AWS.SES({
          apiVersion: '2010-12-01'
        }).sendEmail(ready_email_params).promise().then(
          (data) => {
            console.log("Order ready email sent: " + data.MessageId);
          }).catch(
          (err) => {
            console.error(err, err.stack);
          });

        if (phone != "") {
          var sns_params = {
            Message: 'Your Pokey Okey Order ' + uuid.substring(0, 8).toUpperCase() + ' is now ready for pick up.',
            /* required */
            PhoneNumber: '+1' + phone,
          };

          // Create promise and SNS service object
          new AWS.SNS({
            apiVersion: '2010-03-31'
          }).publish(sns_params).promise().then(
            function(data) {
              console.log("Order ready SMS sent: " + data.MessageId);
            }).catch(
            function(err) {
              console.error(err, err.stack);
            });
        }
      }
    }
  });

};