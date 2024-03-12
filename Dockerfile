FROM node:20.11.1-alpine

WORKDIR /app

RUN npm install -g npm@latest

EXPOSE 5173

ENTRYPOINT ["tail", "-f", "/dev/null"]
