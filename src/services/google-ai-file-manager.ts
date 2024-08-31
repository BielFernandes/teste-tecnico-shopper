// import { Storage } from '@google-cloud/storage';

// export class GoogleAIFileManager {
//   private storage: Storage;
//   private bucketName: string;

//   constructor(apiKey: string, bucketName: string) {
//     this.storage = new Storage({ keyFilename: apiKey });
//     this.bucketName = bucketName;
//   }

//   async uploadFile(
//     filePath: string,
//     options: { mimeType: string; displayName: string },
//   ) {
//     const bucket = this.storage.bucket(this.bucketName);
//     const [file] = await bucket.upload(filePath, {
//       metadata: {
//         contentType: options.mimeType,
//         name: options.displayName,
//       },
//     });

//     return file;
//   }

//   async getFile(fileName: string) {
//     const bucket = this.storage.bucket(this.bucketName);
//     const file = bucket.file(fileName);
//     const [metadata] = await file.getMetadata();
//     return metadata;
//   }
// }
