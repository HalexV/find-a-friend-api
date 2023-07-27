import { ExceededSizeFileError } from '@/use-cases/errors/exceeded-size-file-error';
import { Readable } from 'node:stream';

export function limitFileStreamSize(maxKBSize: number) {
  return async function* (stream: Readable) {
    let bytesRead = 0;
    for await (const chunk of stream) {
      bytesRead += chunk.length;

      if (bytesRead > maxKBSize) {
        throw new ExceededSizeFileError(maxKBSize);
      }

      yield chunk;
    }
  };
}
