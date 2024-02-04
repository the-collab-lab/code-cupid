const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  const params = {
    TableName: process.env.REPOS_TABLE_NAME,
    Key: { id: event.pathParameters.id },
  };

  let response;
  let statusCode;
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const { Item } = await ddbDocClient.send(new GetCommand(params));

    if (!Item) {
      statusCode = 404;
      response = {
        message: `Repo with id ${event.pathParameters.id} not found`,
      };
    } else {
      response = Item;
      statusCode = 200;
      console.log(`Success getting repo: ${event.pathParameters.id}`);
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
