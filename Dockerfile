FROM node:16-alpine
USER root
WORKDIR /app
COPY . ./
ENV NODE_ENV=prod

RUN apk add --update curl && \
    rm -rf /var/cache/apk/*

RUN npm install
RUN npm prune --production

EXPOSE 80

HEALTHCHECK --interval=1m --timeout=3s --retries=3 \
    CMD curl -X GET http://127.0.0.1/health || exit 1
    
CMD npm start