FROM node:22-alpine
RUN apk update && apk add bash
RUN apk add --no-cache curl bind-tools && \
    wget https://github.com/digitalocean/doctl/releases/download/v1.93.0/doctl-1.93.0-linux-amd64.tar.gz && \
    tar xf doctl-1.93.0-linux-amd64.tar.gz && \
    mv doctl /usr/local/bin && \
    rm doctl-1.93.0-linux-amd64.tar.gz
COPY . .
RUN ls -la
RUN npm i
ENTRYPOINT [ "npm", "run", "start" ]