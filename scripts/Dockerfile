# Prepare image
FROM node:22-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json ./
RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install --frozen-lockfile

# Copy files from repo
COPY . .

# Instead of this cmd, it will run the custom start command
CMD ["echo", "No start command defined"]