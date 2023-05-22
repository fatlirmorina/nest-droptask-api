FROM node:19-alpine

RUN apt update && apt install tzdata -y
RUN corepack enable
ENV TZ="Europe/Berlin"

EXPOSE 8080
ADD . .
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start:prod"]