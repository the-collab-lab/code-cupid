const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  const data = JSON.parse(event.body);

  if (!data.repoURL || !data.language) {
    return {
      statusCode: 400,
      body: "repoURL and language are required fields",
    };
  }

  const extractData = data.repoURL.replace(/(^\w+:|^)\/\//, "").split("/");
  const repoOwner = extractData[1];
  const repoName = extractData[2];

  if (!repoName || !repoOwner) {
    return {
      statusCode: 400,
      body: "Invalid repoURL",
    };
  }

  const repoId = `${repoOwner}-${repoName}`;

  const input = {
    id: repoId,
    link: data.repoURL,
    language: data.language,
    createdAt: new Date().getTime().toString(),
  };

  const params = {
    TableName: process.env.REPOS_TABLE_NAME,
    Item: input,
  };

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  console.log(`Adding repo ${repoId} to table ${process.env.REPOS_TABLE_NAME}`);
  await ddbDocClient.send(new PutCommand(params));
  console.log("Repo added to table, done");

  return {
    statusCode: 200,
    body: JSON.stringify(input),
  };
};
