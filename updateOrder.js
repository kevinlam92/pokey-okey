// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-west-2'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
var TABLE_NAME = 'ORDERS';

exports.handler = (event, context, callback) => {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            "UUID": {S: event.uuid}
        },
        UpdateExpression: "set #S = :status",
          ExpressionAttributeNames: {
   "#AT": "AlbumTitle",
   "#Y": "Year"
  },
  ExpressionAttributeValues: {
   ":t": {
     S: "Louder Than Ever"
    },
   ":y": {
     N: "2015"
    }
  },
    };

  var responseCode;
  ddb.updateItem(params, (err, data) => {
    if (err) {
      responseCode = 503;
      console.log(err);
    } else {
      responseCode = 200;
    }
  });

  const response = {
    statusCode: responseCode,
  };
  callback(null, response);
};
