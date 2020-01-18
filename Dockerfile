FROM node:12-alpine AS builder
ARG PACKAGE
# [WARN] Do not override this env var at runtime
ENV PACKAGE ${PACKAGE}
ENV PORT 8080
WORKDIR /repo
COPY . .
WORKDIR /repo/build-helper
RUN yarn install --silent --frozen-lockfile
# delete unnecessary packages
RUN yarn run prune
WORKDIR /repo
RUN yarn install --silent --frozen-lockfile
RUN yarn pkg build
WORKDIR /repo/build-helper
# delete unnecessary files except compiled code
RUN yarn run clean
WORKDIR /repo
RUN npx lerna exec --parallel -- npm prune --production
RUN npm prune --production
RUN yarn cache clean
EXPOSE ${PORT}
CMD ["yarn", "pkg", "start"]
