import { WineModel } from '../models/wineModel';
import { SearchParams, SortBy } from '../types/types';

export async function getBestSellingWinesService(wineModel: WineModel, sortBy: SortBy, searchQuery: SearchParams) {
  let orderByColumn: string;

  switch (sortBy) {
    case SortBy.BOTTLES_SOLD:
      orderByColumn = 'total_bottles_sold';
      break;
    case SortBy.ORDERS:
      orderByColumn = 'total_orders';
      break;
    case SortBy.REVENUE:
    default:
      orderByColumn = 'total_revenue';
      break;
  }

  try {
    const wines = await wineModel.getBestSellingWines(sortBy, searchQuery);
    return wines;
  } catch (err) {
    throw new Error('Failed to fetch best-selling wines');
  }
}

