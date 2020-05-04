import moment from 'moment';
import EndpointUser from '~/authorization/document';
import { MAIL_DOMAINS_ALLOWED } from '~/env';
import { signToken, comparePasswords, hashCode } from './service';

const allowedEmailsArray = MAIL_DOMAINS_ALLOWED.split(',');

const Register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailDomain = email.match(/@(.*)/gi);
    const emailEnding = emailDomain && emailDomain[0] ? emailDomain[0] : false;
    const emailAllowed = allowedEmailsArray.includes(emailEnding);

    if (!emailAllowed)
      throw new Error('Email is not allowed')

    const user = new EndpointUser({ email, password });
    await user.save();

    res.status(200).json({ email, message: 'Sign up suceesfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const Login = async (req, res) => { // eslint-disable-line consistent-return
  const { email, password } = req.body;
  
  try {
    const user = await EndpointUser.findOne({ email }).exec();

    if (!user)
      return res.status(404).json({ message: 'User not found' });
    
    const passwordsMatch = await comparePasswords(password, user.password);

    if (passwordsMatch) {
      const payload = {
        email: user.email,
        expires: Date.now() + 3 * 60 * 60 * 1000,
      };

      req.login(payload, { session: false }, (error) => {
        if (error) return res.status(400).json({ message: error });

        const token = signToken(payload);

        return res.status(200).json({ email: user.email, token, message: 'Sign in suceesfully' });
      });
    } else {
      return res.status(400).json({ message: 'Incorrect Email / Password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const ActivateAccount = async (req, res) => {
  const isGet = req.method === 'GET';
  const { email, activationCode } = isGet ? req.query : req.body;

  if (!email || !activationCode)
    return res.status(400).json({ message: 'Incorrect params' });

  const search = {
    email,
    activationCode: isGet ? activationCode : hashCode(activationCode),
    unactivated: true,
  }
  
  const user = await EndpointUser.findOne(search).exec();
  
  if (!user)
    return res.status(404).json({ message: 'User/Code not found' });

  const codeExpired = moment().diff(moment.unix(user.activationCodeExpires), 'seconds') > 0;

  if (codeExpired)
    return res.status(400).json({ message: 'Your code is expired. Request the new one please.'});

  user.set('unactivated', false);
  await user.save();

  const token = signToken({ email: user.email, expires: Date.now() + 3 * 60 * 60 * 1000 });

  return res.status(200).json({ email: user.email, token, message: 'Your account activated' });
}

const Profile = async (req, res) => {
  const { user } = req;

  res.status(200).json({ user });
}

const TestJWT = async (req, res) => {
    return res.status(200).json({ message: 'OK' });
};

export { Register, Login, Profile, ActivateAccount, TestJWT }
