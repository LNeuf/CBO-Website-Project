FROM node:latest
EXPOSE 8080
WORKDIR /usr/src/app
RUN npm install express --save
RUN npm install body-parser --save
RUN npm install mysql --save
CMD ["node", "server.js"]