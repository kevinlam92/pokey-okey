// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({
  region: 'us-west-2'
});
var ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
});
var TABLE_NAME = 'ORDERS';

const assembly = {
  // Base
  WhiteRice: 0,
  BrownRice: 0,
  SpringMix: 0,

  // Vegetables
  Soybeans: 1,
  Kimchi: 1,
  Seaweed: 1,
  CarrotDaikon: 1,
  PurpleCabbage: 1,
  Radish: 1,
  SweetCorn: 1,
  ImitationCrab: 1,
  PineappleSalsa: 1,
  PickledOnion: 1,

  // Sauce
  PokeyOkey: 2,
  WasabiMayo: 2,
  SpicySesame: 2,
  MisoSesame: 2,
  PonzuVinaigrette: 2,
  SmokeyTeriyaki: 2,

  // Protein
  Ahi: 3,
  Salmon: 3,
  Scallop: 3,
  SpicyAhi: 3,
  SpicySalmon: 3,
  SweetOmelette: 3,
  Tofu: 3,
  CoconutShrimp: 3,
  Octopus: 3,

  // Toppings
  FriedGarlic: 4,
  FriedOnions: 4,
  WasabiPeas: 4,
  SeaweedFlakes: 4,
  TempuraFlakes: 4,
  BaconBits: 4,
  Avocado: 4,
  AburiSalmon: 4,

  // Garnishes
  CapelinRoe: 5,
  FlyingFishRoe: 5,
  GreenOnion: 5,
  Sprouts: 5,
  PickledGinger: 5,
};

var printTemplatePrefix = "<body><style>body{float:none;align-items:flex-start;flex-wrap:wrap;overflow:visible;display:block;margin:0!important;font-family:monospace;font-size:16px;line-height:1.5;}div{width:calc(50% - 4rem - 2px);float:left;padding:1rem;border:1px solid #000;margin:1rem;page-break-inside:avoid}ol{margin:0;padding:0}li{margin-left:1rem}</style>";
var printTemplateSuffix = "</body></html>";
var orderTemplate = "<div><h3>{name}</h3><ol>{steps}</ol>{comment}</div>";

exports.handler = (event, context, callback) => {
  var params = {
    TableName: TABLE_NAME,
    Key: {
      "UUID": {
        S: event.queryStringParameters.uuid
      }
    },
    UpdateExpression: "set #S = :status",
    ExpressionAttributeNames: {
      "#S": "ORDER_STATUS"
    },
    ExpressionAttributeValues: {
      ":status": {
        S: event.queryStringParameters.order_status
      }
    },
  };

  var query = {
    TableName: TABLE_NAME,
    Key: {
      "UUID": {
        S: event.queryStringParameters.uuid
      }
    }
  };

  if (event.queryStringParameters.order_status == '2') {
    ddb.updateItem(params, (err, data) => {
      if (err) {
        callback(null, 503);
      } else {
        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
          body: "Customer notified for pick up.",
        };
        callback(null, 200);
      }
    });
  } else {
    ddb.getItem(query, function(err, data) {
      var queryResult;
      if (err) {
        console.log("No such item", err);
        callback(null, 503);
      } else {
        queryResult = data.Item;
        var printString = printTemplatePrefix;
        if (queryResult) {
          let orderObject = JSON.parse(queryResult.ORDER_JSON.S);
          for (let o = 0; o < orderObject.length; o++) {
            let order = orderObject[o];

            let name = order.name;
            let prepList = order.prep;
            let quantity = order.quantity;
            let comment = "";
            if (order.details.comment) {
              comment = "Comments: " + order.details.comment[0];
            }

            for (let h = 0; h < quantity; h++) {
              let stepsString = "";

              if (prepList.length) {
                let prepSteps = new Array(6);
                for (let k = 0; k < prepSteps.length; k++) {
                  prepSteps[k] = [];
                }

                for (let i = 0; i < prepList.length; i++) {
                  if (assembly[prepList[i]] != undefined) {
                    prepSteps[assembly[prepList[i]]].push(prepList[i]);
                  } else {
                    name += ' ' + prepList[i];
                  }
                }

                for (let j = 0; j < prepSteps.length; j++) {
                  let step = prepSteps[j];
                  let stepString = "<li>";
                  for (let jj = 0; jj < step.length; jj++) {
                    stepString += step[jj];
                    if (jj + 1 < step.length) {
                      stepString += ", ";
                    }
                  }
                  stepString += "</li>";
                  stepsString += stepString;
                }
              }

              let printOrder = orderTemplate;
              printOrder = printOrder.replace("{name}", name);
              printOrder = printOrder.replace("{steps}", stepsString);
              printOrder = printOrder.replace("{comment}", comment);
              printString += printOrder;
            }
          }

          printString += printTemplateSuffix;

          ddb.updateItem(params, (err, data) => {
            if (err) {
              callback(null, 503);
            }
          });
        } else {
          callback(null, 503);
          console.log(err);
        }

        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
          },
          body: printString,
        };
        callback(null, response);
      }
    });
  }
};