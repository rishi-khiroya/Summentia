// https://docs.digitalocean.com/reference/api/spaces-api/

// Import the S3Client object and necessary SDK command.
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { s3Client } from '../object_storage/s3_client';
import fs from 'fs'; 
// use npm install @aws-sdk/client-s3

export async function download(bucketFilePath: string, destPath: string){

// Define params for video to download.
const params = {
    Bucket: "summentia-storage", // The bucket name
    Key: bucketFilePath, // The key of the object you want to download
};
  
// download video.
const downloadVideo = async () => {
  try {
    const response = await s3Client.send(new GetObjectCommand(params));

    if (!response.Body) {
      throw new Error("Response body undefined");
    }

    // Cast response.Body to Readable stream
    const bodyStream = response.Body as Readable;

    // Create a write stream to save the downloaded file
    const fileStream = fs.createWriteStream(destPath);

    // Pipe the response body stream to the file stream
    bodyStream.pipe(fileStream);

    // Wait for the pipe operation to complete
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    console.log("Successfully downloaded object: " + params.Key);
  } catch (err) {
    console.log("Error", err);
  }
};

downloadVideo();
}

download("videos/IML_2_short.mp4", '../object_storage/output/IML_download.mp4');

