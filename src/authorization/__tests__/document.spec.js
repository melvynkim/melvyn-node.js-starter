import EndpointUser from '../document';

describe('Authorization', () => {
  it('test', async () => {
    const list = await new EndpointUser({
      email: 'melvynkim@gmail.com',
      password: '1234',
    });

    expect(list).toBeTruthy();
  });
});
