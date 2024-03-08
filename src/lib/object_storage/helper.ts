
import {DeleteObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3';
import { s3Client } from '../object_storage/s3_client';

export async function deleteFile(bucketFilePath: string){
    const params = {  Bucket: "summentia-storage", Key: bucketFilePath };
    try {
      const response = await s3Client.send(new DeleteObjectCommand(params))
      console.log(response)
    } catch (e) {
      console.log("error deleting file")
    }
  } 

  export async function check_exists(destPath: string){
    const input = {
          Bucket: 'summentia-storage', // The path to the directory you want to upload the object to, starting with your Space name.
          Key: destPath
    }
  
    const command = new HeadObjectCommand(input)
    try {
      const response = await s3Client.send(command)
      console.log(response)
      const http_status_code = response["$metadata"]["httpStatusCode"]
      return http_status_code == 200
    } catch (e) {
      console.log("404 error")
      return false
    }
    
  }
  