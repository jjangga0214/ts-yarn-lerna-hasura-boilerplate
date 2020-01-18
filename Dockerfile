FROM node:12-alpine
ARG PACKAGE
# [WARN] Do not override this env var at runtime
ENV PACKAGE ${PACKAGE}
ENV PORT 8080
WORKDIR /repo
COPY . .
RUN yarn --cwd /repo/build-helper install --silent --frozen-lockfile
# delete unnecessary packages
RUN yarn --cwd /repo/build-helper run prune
RUN yarn install --silent --frozen-lockfile
RUN yarn pkg build
# delete unnecessary files except compiled code
RUN yarn --cwd /repo/build-helper run clean
RUN yarn cache clean
# RUN npx lerna exec --parallel -- npm prune --production
# RUN npm prune --production
EXPOSE ${PORT}
CMD ["yarn", "pkg", "start"]
