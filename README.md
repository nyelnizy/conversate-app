# conversate test app

## Description

An app that tests both conversate server and client (https://github.com/nyelnizy/conversate.git).
A connection is made to the server when the app starts, all subsequent requests go through this connection. 

## Run
To run this app, simply clone and then:
```bash
 cd api &&
 docker-compose up --build
```
You can then access the app on http://localhost:9090
