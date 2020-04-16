export const NODE_ENV = process.env.NODE_ENV || 'develop';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 3000;

export const SECRET = process.env.SECRET || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu';

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://web-go-user:web-go-user@ds133961.mlab.com:33961/web-go-demo';
export const REDIS_URL = process.env.REDIS_URL || 'redis://:8UhZYvM76U8P93BG76DO8zYNmd8KZ6Z5@redis-12468.c124.us-central1-1.gce.cloud.redislabs.com:12468';

export const RATE_LIMIT = process.env.RATE_LIMIT || 0;

export const SENTRY_DSN = process.env.SENTRY_DSN || 'https://70484e0dda784a1081081ca9c8237792:51b5a95ee1e545efba3aba9103c6193e@sentry.io/236866';
export const STATIC_FILES = process.env.STATIC_FILES || null;
export const RENDERTRON_URL = process.env.RENDERTRON_URL || 'https://render-tron.appspot.com/render';
export const SERVE_DOCS = process.env.SERVE_DOCS || true;

// FIXME: Fill in below if you want the mail feature
export const SES_MAIL_FROM = 'FIXME';
export const SES_REGION = 'FIXME';
export const SES_ACCESS_KEY_ID = 'FIXME';
export const SES_SECRET_ACCESS_KEY = 'FIXME';

export const MAIL_CODE_EXPIRES = process.env.MAIL_CODE_EXPIRES || 30;
export const MAIL_DOMAINS_ALLOWED = process.env.MAIL_DOMAINS_ALLOWED || '@gmail.com';