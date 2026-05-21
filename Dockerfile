FROM node:24-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY src ./src
RUN yarn build

FROM node:24-alpine
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

COPY --from=build /app/dist/index.js ./dist/index.js

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
