# Stage 1: Build the application with Node.js
FROM node:21.1.0-alpine as builder 
WORKDIR /app 
COPY . .  
RUN npm install  
RUN npm run build

CMD ["npm", "run", "dev"]