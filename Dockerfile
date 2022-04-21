FROM node:lts-alpine

RUN apk add openssl

WORKDIR /usr/src/vpn-mgt
ADD . /usr/src/vpn-mgt
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i --production

EXPOSE 7001
CMD ["npm", "run", "run"]