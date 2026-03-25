FROM node:24-alpine AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev/backend
COPY package.json package-lock.json /temp/dev/
COPY backend/package.json /temp/dev/backend/
COPY frontend/package.json /temp/dev/frontend/
RUN cd /temp/dev && npm install

RUN mkdir -p /temp/prod/backend
COPY package.json package-lock.json /temp/prod/
COPY backend/package.json /temp/prod/backend/
COPY frontend/package.json /temp/prod/frontend/
RUN cd /temp/prod && npm install --omit=dev

FROM base AS prerelease
ARG DATABASE_URL
ARG FRONTEND_ORIGIN

ENV DATABASE_URL=$DATABASE_URL
ENV FRONTEND_ORIGIN=$FRONTEND_ORIGIN
ENV NODE_ENV=production

COPY --from=install /temp/dev/node_modules node_modules
COPY backend ./backend
COPY package.json ./

RUN npm run backend:generate

FROM base AS release
ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/backend ./backend
COPY --from=prerelease /usr/src/app/package.json ./

ENV NODE_PATH=/usr/src/app/node_modules

EXPOSE 3000/tcp
CMD [ "npm", "run", "backend:start" ]