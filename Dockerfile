FROM node:20.11.1-alpine

WORKDIR /app

RUN npm install -g npm@latest
COPY . .

EXPOSE 5173

ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "run", "dev" ]
