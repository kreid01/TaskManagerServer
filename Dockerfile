FROM node as build
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production --force

COPY --from=build /usr/app/dist ./dist
COPY ./wait-for-it.sh ./dist
COPY .env ./dist
RUN chmod +x ./dist/wait-for-it.sh .

WORKDIR ./dist

EXPOSE 4000

CMD node  index.js