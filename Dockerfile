
FROM node:18-alpine
RUN apk update && \
    apk add python3 g++ imagemagick make curl --no-cache
WORKDIR /my-fronted-project
COPY dist/apps/admin /my-fronted-project
COPY ./node_modules  /my-fronted-project/node_modules




EXPOSE 3000
CMD ["yarn","start"]