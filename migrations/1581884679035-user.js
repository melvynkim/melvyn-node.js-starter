import mongoose from '../src/core/mongoose';
import { User } from '../src/authorization/document'

async function up () {
  await mongoose.model('User').create({
    username: 'user',
    role: 'user',
    password: 'user',
    email: 'user@example.com'
  });
}

async function down () {
  await User.deleteOne({ username: 'user' });
}

export { up, down };
