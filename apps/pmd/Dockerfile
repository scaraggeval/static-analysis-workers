###################
# BUILD
###################

FROM node:16-alpine As build

# Create app directory
WORKDIR /usr/src/wrapper

# Download required tool
RUN wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F6.43.0/pmd-bin-6.43.0.zip && unzip pmd-bin-6.43.0.zip -d ./tool && rm pmd-bin-6.43.0.zip

# Copy application dependency manifests to the container image. Copy lock as well to ensure cache usage
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all required source files
COPY --chown=node:node . .

# Build module
RUN yarn run build pmd

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/pmd

# Install required packages
RUN apk add --no-cache bash openjdk11-jre

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8090

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/tool/pmd-bin-6.43.0 ./tool/pmd-bin-6.43.0
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/pmd/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/pmd/main.js" ]
