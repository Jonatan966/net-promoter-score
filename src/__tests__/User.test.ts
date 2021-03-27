import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should not be able to create a new user with exists email', async () => {
    const response = await request(app)
    .post('/users')
    .send({
      email: 'user@example.com',
      name: 'User Example'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it("Should not be able to create a user exists", async () => {
    const response = await request(app).post("/users")
    .send({
        name:"User example",
        email:"user@example.com",
    });

    expect(response.status).toBe(400);
  });
});