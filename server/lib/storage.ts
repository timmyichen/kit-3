import { Images } from 'server/models';
import { Storage } from '@google-cloud/storage';
import uuid = require('uuid/v4');
import { Upload } from 'graphql-upload';

if (!process.env.GCLOUD_STORAGE_BUCKET) {
  throw new Error('expected gcloud storage bucket');
}

const storage = new Storage({
  projectId: 'kit-prod',
  keyFilename: './config/gcs-owner.json',
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

export function uploadImage(file: Upload): Promise<Images> {
  return new Promise((resolve, reject) => {
    const ext = file.filename.split('.').pop();

    const blob = bucket.file(uuid() + '.' + ext);
    const blobStream = blob.createWriteStream();

    file.createReadStream().pipe(blobStream);

    blobStream.on('error', err => {
      reject(err);
    });

    blobStream.on('finish', async () => {
      const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const image = await Images.create({ url });

      resolve(image);
    });
  });
}
