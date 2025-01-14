# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Declare your build argument
ARG env

RUN npm run build:${env}
 
# Production Stage
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verify the configuration
RUN nginx -t
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]