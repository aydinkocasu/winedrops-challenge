import { FastifyInstance } from "fastify";
import { request } from "http";
import { getBestSellingWines } from "../controllers/wineController";


async function wineRoutes(fastify: FastifyInstance) {
  fastify.get('/best-selling', getBestSellingWines)
}
export default wineRoutes;

