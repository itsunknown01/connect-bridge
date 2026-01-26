# Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Dependencies stage
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Final production stage
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "pnpm", "start" ]
