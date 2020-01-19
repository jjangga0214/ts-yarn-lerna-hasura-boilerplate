# syntax=docker/dockerfile:experimental
FROM node:12-alpine
ARG PACKAGE
# [WARN] Do not override this env var at runtime
ENV PACKAGE ${PACKAGE}
ENV PORT 8080
WORKDIR /repo
COPY build-helper ./build-helper/
RUN --mount=type=cache,target=/repo/yarn-cache \
  yarn --cwd /repo/build-helper install --cache-folder /repo/yarn-cache --silent --frozen-lockfile
# install devDependencies on project root
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/repo/yarn-cache \
  yarn install --cache-folder /repo/yarn-cache --silent --frozen-lockfile
COPY lerna.json LICENSE tsconfig.* ./
COPY packages ./packages/
# delete unnecessary packages
RUN yarn --cwd /repo/build-helper run prune
RUN --mount=type=cache,target=/repo/yarn-cache \
  yarn install --cache-folder /repo/yarn-cache --silent --frozen-lockfile
RUN yarn pkg build
# delete unnecessary stuff except compiled code
RUN yarn --cwd /repo/build-helper run clean
RUN npx lerna exec --parallel -- npm prune --production
RUN npm prune --production
EXPOSE ${PORT}
CMD ["yarn", "pkg", "start"]
