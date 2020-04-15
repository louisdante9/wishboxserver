FROM node:latest

LABEL maintainer="Enaho Murphy <<enahomurphy@gmail.com>>"

COPY . /var/www
ADD . /var/www

WORKDIR /var/www

RUN ["npm", "install"]

CMD ["npm", "start"]

EXPOSE 8080
