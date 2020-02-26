const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = (event, context, callback) => {
    //let body = JSON.parse(event.body); // http-api (proxy)
    let body = event; //test y api-rest (sin proxy)
    const id = body.id;
    const name = body.name;
    const carnet = body.carnet;

    let tablename = "tabla";

    ddb.putItem({
        TableName: tablename,
        Item: {
            "id": { S: id },
            "name": { S: name },
            "carnet": { S: carnet }
        }
    }, function(err, data) {
        if (err) {
            console.log("ddb table, error" + err);
            callback(null, {
                statusCode: 500,
                body: err
            });
        }else {
            console.log("ddb table, success");
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ "message": "success" })
            });
        }
    });
    
};
