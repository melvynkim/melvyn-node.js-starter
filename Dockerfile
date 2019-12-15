FROM node:12

ENV HOME /melvyn-node-starter

WORKDIR ${HOME} 
ADD . $HOME

RUN yarn install

EXPOSE 3000
