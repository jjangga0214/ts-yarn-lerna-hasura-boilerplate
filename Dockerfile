FROM node:12-alpine AS builder
ARG PACKAGE
ENV PACKAGE ${PACKAGE}
WORKDIR /repo
COPY . .
RUN yarn install --silent --frozen-lockfile
RUN yarn pkg build
RUN npx ts-node workflow-helper/build/prune-clean.ts

FROM node:12-alpine
ARG PACKAGE
# [WARN] Do not override this env var at runtime
ENV PACKAGE ${PACKAGE}
ENV PORT 8080
WORKDIR /repo
COPY --from=builder /repo/packages/ ./packages/
COPY --from=builder /repo/package.json ./
COPY --from=builder /repo/yarn.lock ./
COPY --from=builder /repo/LICENSE ./
RUN yarn install --production --silent --frozen-lockfile
RUN yarn cache clean
EXPOSE ${PORT}
CMD ["yarn", "pkg", "start"]
