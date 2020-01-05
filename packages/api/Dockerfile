FROM node:12-alpine AS builder

WORKDIR /repo
COPY . .
RUN rm -rf packages
# copy referenced dependency
COPY packages/hello/ packages/hello/
# copy main package
COPY packages/api/ packages/api/
RUN yarn install --silent
WORKDIR /repo/packages/api
# compile the main package and referenced package(s)(in this case, "@jjangga0214/hello)
RUN yarn build

FROM node:12-alpine
ENV API_ENDPOINT_PORT 8080
WORKDIR /repo
# copy yarn cache and other config
COPY --from=builder /repo/.yarnrc .yarnrc
COPY --from=builder /repo/yarn.lock ./
COPY --from=builder /repo/.yarn-cache/ .yarn-cache/
COPY --from=builder /repo/package.json ./
# copy compiled referenced dependency
COPY --from=builder /repo/packages/hello/package.json ./packages/hello/
COPY --from=builder /repo/packages/hello/dist/ ./packages/hello/dist/
# copy compiled main package
COPY --from=builder /repo/packages/api/package.json ./packages/app/
COPY --from=builder /repo/packages/api/dist/ ./packages/app/dist/
# install only production dependencies
RUN yarn install --production --silent
RUN rm -rf $(yarn cache dir)
WORKDIR /repo/packages/api
EXPOSE ${API_ENDPOINT_PORT}
CMD ["yarn", "workspace", "@jjangga0214/api", "start"]
