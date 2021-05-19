FROM node:lts-alpine

WORKDIR /usr/src/vpn-mgt
ADD . /usr/src/vpn-mgt
RUN npm i

EXPOSE 7001
CMD ["npm", "run", "run"]