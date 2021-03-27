import express, { Request, Response } from 'express';
import 'reflect-metadata';
import 'express-async-errors';

import createConnection from './database';
import { AppError } from './errors/AppError';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.use((err: Error, request: Request, response: Response) => {
  console.log('socorro',err)
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    });
  }

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error. ${err.message}`
  });
})

export { app }