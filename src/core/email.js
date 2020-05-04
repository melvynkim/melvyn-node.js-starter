import swig from 'swig-templates';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

import logger from '~/shared/logger';
import { NODE_ENV, SES_MAIL_FROM, SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY } from '~/env';

const SES = new AWS.SES({
  from: SES_MAIL_FROM,
  region: SES_REGION,
  accessKeyId: SES_ACCESS_KEY_ID,
  secretAccessKey: SES_SECRET_ACCESS_KEY,
});

const transport = nodemailer.createTransport({ SES });

const compileTemplate = async function compileTemplate(template, payload) {
	const html = await swig.compileFile(`src/shared/email-templates/${template}`);
	const compiled = await html(payload);
	
	return compiled;
}

/*
 *  options:object - defines email parameters
 * 
 *  options.subject:string - email subject
 *  options.to:string - recipient's email
 *  options.template:string - filename in `shared/email-templates` folder (swig template engine)
 *  options.payload:object - payload to fill template file
 */
export const sendEmail = async function sendEmail(options) {
	const { to, subject } = options;
	
	if (NODE_ENV !== 'test') {
		const html = await compileTemplate(options.template, options.payload);

		try {
			await transport.sendMail({ from: SES_MAIL_FROM, to, subject, html })
		} catch(e) {
			logger.error(e);
			throw(e);
		}
	} else {
		logger.debug('sendEmail called');
	}
};