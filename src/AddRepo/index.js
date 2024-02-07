const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
  console.log(JSON.stringify(event, undefined, 2));
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    // If there is an error parsing the JSON body, return an error response
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allows access from any origin
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS if needed
      },
      body: "Failed to parse body as JSON",
    };
  }

  if (!data.repoURL || !data.language) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "repoURL and language are required fields",
    };
  }

  // Assuming this is submitted in a format like https://github.com/myOrg/myRepo
  const extractData = data.repoURL.replace(/(^\w+:|^)\/\//, "").split("/");
  const repoOwner = extractData[1];
  const repoName = extractData[2];

  if (!repoName || !repoOwner) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Invalid repoURL",
    };
  }

  const repoId = `${repoOwner}-${repoName}`;

  const input = {
    id: repoId,
    link: data.repoURL,
    language: data.language.toLowerCase(),
    createdAt: new Date().getTime().toString(),
  };

  const params = {
    TableName: process.env.REPOS_TABLE_NAME,
    Item: input,
  };

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  try {
    console.log(`Adding repo ${repoId} to table ${process.env.REPOS_TABLE_NAME}`);
    await ddbDocClient.send(new PutCommand(params));
    console.log("Repo added to table, done");
  } catch (err) {
    console.log(`Error adding repo to table: ${err}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Failed to add repo to table" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(input),
  };
};
