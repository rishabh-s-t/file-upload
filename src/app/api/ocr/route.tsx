import {NextResponse} from "next/server";

export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  const requestData = await req.json();
  const fileName = requestData.fileName;
  try {
    // Imports the Google Cloud client libraries
    const vision = require("@google-cloud/vision").v1;

    const client = new vision.ImageAnnotatorClient({
      projectId: "ai-teacher-79270",
      credentials: JSON.parse(
        process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
      ),
    });

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // Bucket where the file resides
    const bucketName = "ai-teacher-79270.appspot.com";

    // Path to file within bucket
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${fileName}/${fileName}.json`;

    const inputConfig = {
      // Supported mime_types are: 'application/pdf' and 'image/tiff'
      mimeType: "application/pdf",
      gcsSource: {
        uri: gcsSourceUri,
      },
      pages: "1-1",
    };
    const outputConfig = {
      gcsDestination: {
        uri: gcsDestinationUri,
      },
    };
    const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
    const request = {
      requests: [
        {
          inputConfig: inputConfig,
          features: features,
          outputConfig: outputConfig,
        },
      ],
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();
    const destinationUri =
      filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log("Json saved to: " + destinationUri);

    return NextResponse.json({
      message: "PDF processing completed successfully.",
      url: destinationUri,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

export async function GET() {
  // this is a harcoded value for testing this will be disabled in deployment
  try {
    // Imports the Google Cloud client libraries
    const vision = require("@google-cloud/vision").v1;

    // Creates a client
    const client = new vision.ImageAnnotatorClient({
      projectId: "ai-teacher-79270",
      credentials: JSON.parse(
        process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
      ),
    });
    const bucketName = "ai-teacher-79270.appspot.com";
    const fileName = "97c5n";
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${fileName}/`;

    const inputConfig = {
      // Supported mime_types are: 'application/pdf' and 'image/tiff'
      mimeType: "application/pdf",
      gcsSource: {
        uri: gcsSourceUri,
      },
    };
    const outputConfig = {
      gcsDestination: {
        uri: gcsDestinationUri,
      },
    };
    const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
    const request = {
      requests: [
        {
          inputConfig: inputConfig,
          features: features,
          outputConfig: outputConfig,
        },
      ],
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();

    const destinationUri =
      filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log("Json saved to: " + destinationUri);

    return NextResponse.json({
      destinationUri,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}
