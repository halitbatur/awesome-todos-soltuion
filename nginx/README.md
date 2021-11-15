# NGINX

NGINX is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache. It is being used as a reverse proxy / static server for this application because we have multiple servers configured.

The server is already configured so there is nothing that needs to be changed here.

## Configuration

Inside `/templates` there are 2 config files:

- Develoment config: In case you want to run the client in dev mode, NGINX will proxy to react dev server, as well as express api server.
- Production config: This config will serve the built client package hosted inside `/client_build` as well as proxy to the express api server for `/api` calls. To generate a client build, you can run the command `yarn run build:client` in the root directory.
