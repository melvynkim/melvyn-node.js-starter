import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { SECRET } from '~/env';


const signToken = (payload) => {
	return jwt.sign(JSON.stringify(payload), SECRET);
}

const comparePasswords = async (password, userPassword) => {
	const compared = await bcrypt.compare(password, userPassword);

	return compared;
}

const hashPassword = async (password) => {
	const hash = await bcrypt.hash(password, 10);

	return hash;
}

const hashCode = (code) => {
	return crypto.pbkdf2Sync(code.toString(), SECRET, 10, 64, 'sha512').toString('hex');
}

const hasRole = (requiredRole) => (req, res, next) => {	
	const availableRoles = ['user', 'admin'];
  
  if (availableRoles.indexOf(req.user.role) >= availableRoles.indexOf(requiredRole))
  	return next();
  
  return res.status(401).json({ message: 'Access denied' });
  
}

export {
	signToken,
	comparePasswords,
	hashPassword,
	hashCode,
	hasRole,
}