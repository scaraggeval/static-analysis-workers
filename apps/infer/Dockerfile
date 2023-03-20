###################
# BUILD
###################

FROM node:16-alpine As build

# Create app directory
WORKDIR /usr/src/wrapper

# Download required tool
RUN mkdir -p ./tool/infer && wget -O- "https://github.com/facebook/infer/releases/download/v1.1.0/infer-linux64-v1.1.0.tar.xz" | tar -C ./tool/infer -xJ

# Copy application dependency manifests to the container image. Copy lock as well to ensure cache usage
COPY --chown=node:node package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all required source files
COPY --chown=node:node . .

# Build module
RUN yarn run build infer

# Switch to user node
USER node

###################
# PRODUCTION
###################

FROM node:16-bullseye-slim As production

WORKDIR /usr/infer

# GLIBC and java bash
RUN apt-get update && apt-get install -y default-jdk build-essential

COPY --chown=node:node package.json yarn.lock ./

ENV NODE_ENV=production PORT=8093

RUN yarn install --production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/wrapper/tool/infer ./tool/infer
COPY --chown=node:node --from=build /usr/src/wrapper/dist ./dist
COPY --chown=node:node --from=build /usr/src/wrapper/apps/infer/.env ./

# Start the server using the production build
CMD [ "node", "dist/apps/infer/main.js" ]
