import { s3Client } from '@/lib/s3Client';
import { ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function emptyBucket(bucketName: string) {
  try {
    let objectListing = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
      })
    );

    while (true) {
      if (!objectListing.Contents) {
        console.log(`Bucket: ${bucketName} is already empty!`);
        return;
      }

      for (const content of objectListing.Contents) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: content.Key,
          })
        );
      }

      if (objectListing.IsTruncated) {
        objectListing = await s3Client.send(
          new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: objectListing.ContinuationToken,
          })
        );
      } else {
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
