#!/bin/bash
set -e
cd "`dirname "$0"`"
npm run build
rm -rf /var/www/attack-map/*
cp -r build/* /var/www/attack-map