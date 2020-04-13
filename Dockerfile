FROM node:12.16.2

ENV HOME /melvyn-node-starter

WORKDIR ${HOME}
ADD . $HOME

RUN yarn install

ENV NODE_ENV develop

# envs --
ENV SECRET e3456bb5-b71d-4457-a433-3e8b7534240f

# TODO: deployed host must be configured here, or it won't work
ENV REMOTE_HOST localhost:3000

ENV MONGODB_URI mongodb://web-go-user:web-go-user@ds133961.mlab.com:33961/web-go-demo
ENV REDIS_URL redis://:8UhZYvM76U8P93BG76DO8zYNmd8KZ6Z5@redis-12468.c124.us-central1-1.gce.cloud.redislabs.com:12468

ENV SENTRY_DSN https://70484e0dda784a1081081ca9c8237792:51b5a95ee1e545efba3aba9103c6193e@sentry.io/236866

ENV RATE_LIMIT 0
# -- envs

# processes --
ENV WEB_CONCURRENCY 1
# -- processes

EXPOSE 3000

CMD node processes.js
