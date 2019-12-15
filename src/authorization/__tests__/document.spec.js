import { User } from '../document';

describe('Authorization', () => {
  it('test', async () => {
    const list = await new User({
      username: 'melvynkim',
      password: '1234',
      email: 'melvynkim@gmail.com',
    });

    expect(list).toBeTruthy();
  });
});
