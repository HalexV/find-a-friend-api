export class ExceededAmountFileError extends Error {
  constructor() {
    super('Exceeded amount of files uploaded.');
  }
}
