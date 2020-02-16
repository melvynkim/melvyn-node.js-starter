import mongoose from '../src/core/mongoose';
import { User } from '../src/authorization/document'

async function up () {
  await mongoose.model('User').create({
    username: 'admin',
    role: 'admin',
    password: 'admin',
    email: 'admin@example.com'
  });
}

async function down () {
  await User.deleteOne({ username: 'admin' });
}

export { up, down };
