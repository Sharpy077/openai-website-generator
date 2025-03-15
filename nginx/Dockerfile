FROM nginx:1.25-alpine

# Install bash and curl for healthcheck
RUN apk add --no-cache bash curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/

# Add healthcheck script
COPY healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Create directory for certbot
RUN mkdir -p /var/www/certbot

# Add permissions for nginx user
RUN chown -R nginx:nginx /var/www/certbot

# Use nginx user instead of root
USER nginx

# Expose ports
EXPOSE 8080
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD /healthcheck.sh