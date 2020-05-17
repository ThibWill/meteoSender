FROM node:13-slim

WORKDIR /var/opt/mailsender
COPY . ./

RUN npm install

EXPOSE 80

ENTRYPOINT npm start