#!/bin/bash

cd /root/Backend

docker build -t nbc-backend .

docker stop nbc-backend && docker rm nbc-backend

docker run -itd --name nbc-backend -p 5000:5000 nbc-backend
