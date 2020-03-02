const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
    //let body = JSON.parse(event.body); // http-api (proxy)
    let body = event; //test y api-rest (sin proxy)

    const similarity = body.similarity;//porcentaje de similitud
    const bucketname = body.bucketname;//nombre de bucket
    const sourceFilepath = body.sourceFilepath; //dirección relativa de la imagen origen (captura o foto)
    const targetFilepath = body.targetFilepath; //dirección relativa de la imagen objetivo (foto de perfil)

    var params = {
        SimilarityThreshold: similarity,
        SourceImage: {//captura o foto
            S3Object: {
                Bucket: bucketname,
                Name: sourceFilepath
            }
        },
        TargetImage: {//foto perfil
            S3Object: {
                Bucket: bucketname,
                Name: targetFilepath
            }
        }
    };

    rekognition.compareFaces(params, function(err, data) {
        if (err) {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({ "message": "Error compareFaces" })
            });
        }
        else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ "faceMatches": data.FaceMatches.length, "message": data})
            });
        }
    });
}
