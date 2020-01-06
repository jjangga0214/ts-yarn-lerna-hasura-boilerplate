FROM node:12-alpine AS builder

WORKDIR /repo
COPY . .
RUN yarn install --silent
WORKDIR /repo/packages/${PACKAGE}
RUN yarn build
WORKDIR /repo
RUN npx ts-node workflow-helper/build/prune-packages.ts
# delete everythings in each package except their package.json and dist
RUN npx lerna exec --parallel -- del "*" "!package.json" "!dist"

FROM node:12-alpine
ARG PACKAGE
# [WARN] Do not modify this env var at runtime
ENV PACKAGE ${PACKAGE}
WORKDIR /repo
COPY --from=builder /repo/packages/ ./packages/
COPY --from=builder /repo/package.json ./
COPY --from=builder /repo/LICENSE ./
RUN yarn install --production
EXPOSE 8080
CMD ["yarn", "pkg", "start"]
