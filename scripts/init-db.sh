#!/usr/bin/env sh
set -e
cd /app
alembic upgrade head
