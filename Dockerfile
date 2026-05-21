FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN node_modules/.bin/tsc

FROM node:22-alpine
WORKDIR /app

ARG ECCM_VERSION
ENV ECCM_VERSION=${ECCM_VERSION}

RUN apk add --no-cache tini curl && \
    curl -fsSL \
      "https://codeload.github.com/bijomaru78/eccm/tar.gz/refs/tags/${ECCM_VERSION}" \
      -o eccm.tar.gz && \
    tar -xzf eccm.tar.gz --strip-components=1 "eccm-${ECCM_VERSION}/ECCM.html" && \
    rm eccm.tar.gz && \
    apk del curl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
