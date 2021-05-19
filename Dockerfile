FROM node:lts-alpine

WORKING /usr/src/vpn-mgt
ADD . /usr/src/vpn-mgt
RUN npm i