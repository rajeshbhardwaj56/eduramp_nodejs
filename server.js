import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

async function start() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  console.log("connected to postgresql");

  const server = app.listen(env.PORT, () => {
    console.log(`server running on por ${env.PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} recieved for shutdown`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch(async (err) => {
  console.error("Failed to start a server", err.message);
  await prisma.$disconnect();
  process.exit(1);
});
