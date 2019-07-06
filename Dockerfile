# Stage 1: Build fims web app
FROM node:8.11.2-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Host Fims web app on Nginx
FROM nginx:1.16.0

RUN rm -f /etc/nginx/nginx.conf

COPY --from=node /usr/src/app/dist /usr/share/nginx/html

COPY ./scripts/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8888

CMD ["nginx", "-g", "daemon off;"]
