FROM node as build
WORKDIR /user/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production --force

COPY --from=build /user/app/dist ./dist

COPY .env ./dist/
WORKDIR ./dist

EXPOSE 4000

CMD node index.js