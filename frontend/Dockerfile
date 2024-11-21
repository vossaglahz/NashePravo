FROM node:lts-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_API_BACK_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_BACK_URL=${VITE_API_BACK_URL}
RUN npm run build

# Stage 2: Create final image with Nginx
FROM nginx:alpine

# Add Curl for debugging
RUN apk add --no-cache curl

# Remove default Nginx HTML files and add the React build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/locales /usr/share/nginx/html/locales
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 and run Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



