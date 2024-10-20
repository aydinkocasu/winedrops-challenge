import Fastify from "fastify";
import { connectDB } from "../db/db";
import wineRoutes from "./routes/wineRoutes";
import fastifyCors from "@fastify/cors";

const startServer = async () => {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(fastifyCors, {
    //origin: 'http://localhost:5173',
    origin: 'https://winedrops-challenge-production.up.railway.app',
    methods: ['GET'],
  });

  fastify.setErrorHandler((error, _, reply) => {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' })
  });

  try {
    const db = await connectDB();

    fastify.decorate('db', db)

    fastify.register(wineRoutes, { prefix: 'wines' })

    await fastify.listen({ port: 3000, host: '0.0.0.0' });

    fastify.log.info('Server running')
  } catch (err) {
    fastify.log.error(err);
  }
};

startServer();
