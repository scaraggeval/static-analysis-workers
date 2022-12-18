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
RUN yarn run build checkstyle

# Download required tool
RUN mkdir -p "tool/checkstyle" && wget -P ./tool/checkstyle https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.4/checkstyle-10.4-all.jar

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /usr/checkstyle

# Install required packages
RUN apk add --no-cache openjdk11-jre

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8092

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/tool/checkstyle ./tool/checkstyle
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/checkstyle/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/checkstyle/main.js" ]
