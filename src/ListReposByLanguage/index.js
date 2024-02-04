const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  // Get repos by language
  const params = {
    TableName: process.env.REPOS_TABLE_NAME,
    IndexName: "languageIndex",
    KeyConditionExpression: "#language = :language",
    ExpressionAttributeNames: {
      "#language": "language",
    },
    ExpressionAttributeValues: {
      ":language": event.pathParameters.language.toLowerCase(),
    },
  };

  let response;
  let statusCode;
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const { Items } = await ddbDocClient.send(new QueryCommand(params));

    if (!Items) {
      statusCode = 200;
      response = [];
    } else {
      response = Items;
      statusCode = 200;
      console.log(
        `Success getting repo for language: ${event.pathParameters.language}`
      );
    }
  } catch (err) {
    console.log(`Error: ${JSON.stringify(err, undefined, 2)}`);
    response = { message: err.message };
    statusCode = err.$metadata ? err.$metadata.httpStatusCode : 500;
  }

  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
