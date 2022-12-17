###################
# BUILD
###################

FROM node:16-alpine As build

# Create app directory
WORKDIR /usr/src/wrapper

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json yarn.lock ./

# Copy all required files
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn install && yarn run build pmd

USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/pmd

COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node --from=build /usr/src/wrapper/node_modules ./node_modules

ENV NODE_ENV production

RUN yarn install

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/tool/pmd-bin-6.43.0 ./tool
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/pmd/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/pmd/main.js" ]
