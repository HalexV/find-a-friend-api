export class ExceededSizeFileError extends Error {
  constructor(maxKBSize: number) {
    super(`Exceeded max file size. Max file size is ${maxKBSize}`);
  }
}
