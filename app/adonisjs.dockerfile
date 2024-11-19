FROM node:18.0.0-alpine

RUN mkdir -p /usr/app
ENV HOME=/usr/app
WORKDIR $HOME
COPY ./package*.json $HOME/

USER root

RUN yarn 
COPY . .
RUN yarn global add @adonisjs/cli 
RUN yarn 
EXPOSE 3333
CMD ["adonis", "serve", "--dev"]