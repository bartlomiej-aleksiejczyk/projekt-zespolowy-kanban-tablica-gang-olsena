FROM node:18-alpine

WORKDIR /app/frontend/

ENV PATH /app/frontend/node_modules/.bin:$PATH

COPY package*.json /app/frontend/
RUN npm install

COPY . /app/frontend/

CMD ["npm", "start"]