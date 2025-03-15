#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --no-ansi"
DOCKER="/usr/bin/docker"

cd /path/to/your/project

$COMPOSE run certbot renew --quiet --webroot -w /var/www/certbot
$DOCKER exec nginx nginx -s reload