# Use an nginx image to serve the static build
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]