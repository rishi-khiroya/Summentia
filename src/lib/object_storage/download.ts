// https://docs.digitalocean.com/reference/api/spaces-api/

// Import the S3Client object and necessary SDK command.
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { s3Client } from '../space_object_storage/s3_client';
// use npm install @aws-sdk/client-s3

// Define params for video to download.
const params = {
    Bucket: "example-space", // The bucket name
    Key: "folder-path/my_video.mp4", // The key of the object you want to download
};
  
import fs from 'fs'; 
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
    const fileStream = fs.createWriteStream('path_to_save_downloaded_file');

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
