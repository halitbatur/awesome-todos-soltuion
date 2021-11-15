FROM node:16-alpine

RUN mkdir -p /backend-app
WORKDIR /backend-app
COPY package.json .
RUN yarn -s
COPY . .
CMD ["yarn", "run", "start"]