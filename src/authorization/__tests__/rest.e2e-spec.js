import supertest from 'supertest';
import app from '~/app';
import mongoose from '~/core/mongoose';
import EndpointUser from '~/authorization/document';

const request = supertest(app);
const user = new EndpointUser({
	password: 'password',
  email: 'test@test.com',
});

describe('Authorization', () => {
  let token = '';

	beforeAll( async() => {
		await user.save();
	});

  afterAll( async() => {
  	await user.remove();
    await mongoose.connection.close();
  });
  
  it('should reject incorrect credentials', async () => {
    const { statusCode, body } = await request
      .post('/auth/login')
      .send({ email: 'incorrect', password: 'incorrect' });

    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('User not found');
  });

  it('should return token with correct credentials', async () => {
    const { statusCode, body } = await request
      .post('/auth/login')
      .send({ email: 'email', password: 'password' });

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Sign in suceesfully');

    token = body.token;
  });

  it('should return OK with correct token on protected route', async () => {
    const { statusCode, body } = await request
      .post('/auth/check-jwt')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('OK');
  });

  it('user shoulnt have access to the Admin route', async () => {
    const { statusCode, body } = await request
      .post('/auth/check-admin-role')
      .set('Authorization', `Bearer ${token}`);

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Access denied');
    expect(statusCode).toBe(401);

  });

  it('should have access to the User route', async () => {
    const { statusCode, body } = await request
      .post('/auth/check-user-role')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('OK');
  });

});
