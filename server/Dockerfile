FROM node:16-alpine

RUN mkdir -p /backend-app
WORKDIR /backend-app
COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]