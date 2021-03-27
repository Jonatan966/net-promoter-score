export class AppError {
  constructor(
    public readonly message: any,
    public readonly statusCode: number = 400
  ) {}
}