FROM node:24-alpine AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev/frontend
COPY package.json package-lock.json /temp/dev/
COPY frontend/package.json /temp/dev/frontend/
COPY backend/package.json /temp/dev/backend/
RUN cd /temp/dev && npm install

RUN mkdir -p /temp/prod/frontend
COPY package.json package-lock.json /temp/prod/
COPY frontend/package.json /temp/prod/frontend/
COPY backend/package.json /temp/prod/backend/
RUN cd /temp/prod && npm install --omit=dev

FROM base AS prerelease

ENV NODE_ENV=production

COPY --from=install /temp/dev/node_modules node_modules
COPY frontend ./frontend
COPY package.json ./

RUN npm run frontend:build

FROM base AS release
ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/frontend/package.json ./frontend/
COPY --from=prerelease /usr/src/app/frontend/dist ./frontend/dist
COPY --from=prerelease /usr/src/app/package.json ./

ENV NODE_PATH=/usr/src/app/node_modules

EXPOSE 3000/tcp
CMD [ "npm", "run", "frontend:start" ]