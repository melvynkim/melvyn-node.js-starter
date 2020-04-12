import mailgun from 'mailgun-js'; // eslint-disable-line import/no-unresolved
import moment from 'moment';
import mongoose from '~/core/mongoose';
import { hashPassword, hashCode } from './service';
import { MAILGUN_BASE_URL, MAILGUN_API_KEY, MAILGUN_DOMAIN, MAIL_FROM, MAIL_CODE_EXPIRES } from '~/env';

const mailClient = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

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
    validate: {
      validator(value) {
        return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value);
      },
      message: ({ value }) => `${value} is not a valid email format`,
    },
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
  const message = `Your activationCode is ${this.get('_activationCode')}.
  
Or click below link to activate your account:
${MAILGUN_BASE_URL}/auth/activateAccount?email=${this.get('email')}&activationCode=${this.get('activationCode')} 
  
Please note that code expires in ${MAIL_CODE_EXPIRES} minutes`;

  await mailClient.messages().send({
    from: MAIL_FROM,
    to: this.email,
    subject: 'Your activation Code',
    text: message,
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
