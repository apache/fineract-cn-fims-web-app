# nginx configuration

Config to use nginx for hosting fims.

This config assumes that all needed services are started.

## Setup

* Install nginx
* Run `npm run build` from root folder
* Copy all contents of /dist into your nginx root folder under /fims
* Copy/Overwrite nginx.conf into /conf of your nginx root folder
* Change proxy_pass configuration of each service to point to the right url
* Start nginx with `nginx`
* Navigate with your browser to `http://localhost:8888`
