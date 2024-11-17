FROM oven/bun:slim

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 6789

CMD ["bun", "run", "src/index.ts"]