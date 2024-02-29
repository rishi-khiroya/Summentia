// Import the S3Client object
import {S3Client } from '@aws-sdk/client-s3';
// use npm install @aws-sdk/client-s3

// The s3Client function validates request and directs it to Space's specified endpoint using AWS SDK.
export const s3Client = new S3Client({
    endpoint: "https://yourendpointhere", // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (for example, nyc3).
    credentials: {
      accessKeyId: "youraccesskeypairhere", // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: process.env.SPACES_SECRET // Secret access key defined through an environment variable.
    }
});
