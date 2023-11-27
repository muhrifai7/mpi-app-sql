FROM node:20.9.0
 
WORKDIR /
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .
 
CMD [ "node", "src/app.js" ]