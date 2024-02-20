FROM node:20.11.1-alpine3.19 as builder

WORKDIR /app

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

COPY package.json package-lock.json index.ts tsconfig.json ./
RUN npm ci && npm run build

FROM node:20.11.1-alpine3.19
ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

COPY --from=builder --chown=node:node /tini /tini
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/index.js ./
COPY --chown=node:node . .

USER node
EXPOSE 3000

ENTRYPOINT [ "/tini", "--", "node" ]
CMD ["/app/index.js"]
