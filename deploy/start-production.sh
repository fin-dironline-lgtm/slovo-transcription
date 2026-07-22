#!/bin/sh
set -eu

npm run start &
app_pid=$!

trap 'kill "$app_pid" 2>/dev/null || true' INT TERM EXIT

nginx -g 'daemon off;'
