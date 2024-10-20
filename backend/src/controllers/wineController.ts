import { FastifyReply, FastifyRequest } from 'fastify';
import { WineModel } from '../models/wineModel';
import { SortBy } from '../types/types';
import { getBestSellingWinesService } from '../services/wineService';
import { sanitizeSearchParams } from '../utils/utils';

export async function getBestSellingWines(req: FastifyRequest, reply: FastifyReply) {
  const { sortBy } = req.query as { sortBy?: SortBy };

  const sortingCriteria = sortBy || SortBy.REVENUE;

  const searchQuery = sanitizeSearchParams(req.query);

  const wineModel = new WineModel(req.server.db);

  try {
    const wines = await getBestSellingWinesService(wineModel, sortingCriteria, searchQuery);
    reply.send(wines);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
}

