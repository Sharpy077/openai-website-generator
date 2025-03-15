#!/bin/bash
nginx -t || exit 1
curl -f http://localhost:8080/health || exit 1