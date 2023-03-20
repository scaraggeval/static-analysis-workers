###################
# BUILD
###################

FROM node:16-alpine As build

# Create app directory
WORKDIR /usr/src/wrapper

# donwload dependency
RUN apk add --no-cache zip unzip

# Download required tool
RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747.zip && unzip sonar-scanner-cli-4.7.0.2747 -d ./tool && rm sonar-scanner-cli-4.7.0.2747.zip

# Copy application dependency manifests to the container image. Copy lock as well to ensure cache usage
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all required source files
COPY --chown=node:node . .

# Build module
RUN yarn run build sonarqube

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/sonarqube

# Install required packages
RUN apk add --no-cache openjdk8-jre

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8093

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/tool/sonar-scanner-4.7.0.2747 ./tool/sonar-scanner-4.7.0.2747
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/sonarqube/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/sonarqube/main.js" ]
