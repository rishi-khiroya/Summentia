// https://docs.digitalocean.com/reference/api/spaces-api/

// Step 1: Import the S3Client object and all necessary SDK commands.
import {PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../object_storage/s3_client';
// use npm install @aws-sdk/client-s3
import fs from 'fs'; // Import the file system module

export async function upload(filePath: string, destPath: string){
  
  const params = {
    Bucket: "summentia-storage", // The path to the directory you want to upload the object to, starting with your Space name.
    Key: destPath, // Object key, referenced whenever you want to access this file later.
    Body: fs.createReadStream(filePath), // The object's contents. This variable is an object, not a string.
    ACL: "public-read",
  
    Metadata: { // Defines metadata tags.
      "x-amz-meta-my-key": "DO00LTWRAXLVDGZTFZ2W"
    }
  };

  const uploadObject = async () => {
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log(
        "Successfully uploaded object: " +
          params.Bucket +
          "/" +
          params.Key
      );
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  };

  uploadObject();
}

//upload("../object_storage/test/IML_2_short.mp4", "videos/IML_2_short.mp4");



















/* from linked in: https://www.linkedin.com/pulse/upload-images-video-files-using-aws-s3-sdknodejs-react-birendra-jha-fdqnc/?trk=article-ssr-frontend-pulse_more-articles_related-content-card

router.post("/uploadfile",upload.single('file'), async (req, res) => { 
    var {file,filePath,fileDir,filetype} = req.body;
    //console.log('req.file'+req.file)
         fileUpload(req.file,filePath);
         console.log('filePath'+ fileDir)
         return res.send(201);
    }

const fileUpload= (file,filePath)=>{

  const fileStream 
        =fs.createReadStream(file.path);

  const params = {
      Bucket: 'files',
      Key: 'users/'+filePath,
      Body: fileStream,
      ACL: 'public-read',
      cacheControl: 'max-age=31536000',
  };

  s3.upload(params, function (err, data) {
     
      if (err) {
        console.log(err);
      }
      console.log(`File uploaded successfully.`);
  });
}
*/