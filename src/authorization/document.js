import moment from 'moment';
import mongoose from '~/core/mongoose';
import { sendEmail } from '~/core/email';
import { hashPassword, hashCode } from './service';
import { HOST, MAIL_CODE_EXPIRES } from '~/env';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     EndpointUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 */   

const endpointUserScheme = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [{
      validator(value) {
        return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value);
      },
      message: ({ value }) => `${value} is not a valid email format`,
    }, {
      async validator(email) {
        const sameEmail = await this.model('EndpointUser').countDocuments({ email });

        return !sameEmail;
      },
      message: ({ value }) => `${value} is already registered`,
    }],
    required: true,
    unique: true,
  },
  unactivated: { // activation flag
    type: Boolean,
    default: true,
  },
  activationCode: {
    type: String,
    required: true,
  },
  activationCodeExpires: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

endpointUserScheme.methods.sendVerificationEmail = async function sendVerificationEmail() {
  await sendEmail({
    subject: 'Your activation code',
    to: this.email,
    template: 'activationCode.html',
    payload: {
      activationCode: this.get('_activationCode'),
      hashedActivationCode: this.get('activationCode'),
      baseUrl: HOST,
      codeExpires: MAIL_CODE_EXPIRES,
      email: this.email
    }
  });
}

endpointUserScheme.virtual('_activationCode');

endpointUserScheme.pre('validate', async function setCode() {
  if (!this.hasActivationCode) {
    const activationCode = Math.floor(100000 + Math.random() * 900000);
    const hashedActivationCode = hashCode(activationCode);
    
    this.set('_activationCode', activationCode.toString());
    this.set('activationCode', hashedActivationCode);
    this.set('activationCodeExpires', moment().add(MAIL_CODE_EXPIRES, 'minutes').unix());
  }
})

/* 
 * Pre-save hook for setting hashed `password`
 */
endpointUserScheme.pre('save', async function setPassword() {
  if (!this.password)
    throw new Error('Password required');

  if (this.isNew) {
    const hashedPassword = await hashPassword(this.password);
  
    this.set('password', hashedPassword);
  }
});

/* 
 * Post-save hook for sending verification email
 */
endpointUserScheme.post('save', async function sendCode() {
  if (this.unactivated)
    await this.sendVerificationEmail();
});

const EndpointUser = mongoose.model('EndpointUser', endpointUserScheme, 'EndpointUsers');

export default EndpointUser;
