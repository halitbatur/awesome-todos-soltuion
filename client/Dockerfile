FROM node:16-alpine

RUN mkdir -p /frontend-app
WORKDIR /frontend-app
COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]