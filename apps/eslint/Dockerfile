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
RUN yarn run build eslint

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/eslint

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8091

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/apps/eslint/main.js" ]
