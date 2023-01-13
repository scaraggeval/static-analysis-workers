###################
# BUILD
###################

FROM node:16-alpine As build

# Create app directory
WORKDIR /usr/src/wrapper

# Copy application dependency manifests to the container image. Copy lock as well to ensure cache usage
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all required source files
COPY --chown=node:node . .

# Build module
RUN yarn run build cppcheck

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/cppcheck

RUN apk add --no-cache bash cppcheck

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8094

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/cppcheck/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/cppcheck/main.js" ]
