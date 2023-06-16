import { S3Client } from '@aws-sdk/client-s3';
// Set the AWS Region.
const REGION = 'REGION'; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: REGION,
  endpoint: 'http://localhost:9090',
  credentials: { accessKeyId: 'asd', secretAccessKey: 'sda' },
  forcePathStyle: true,
});
export { s3Client };
