import validator from 'validator';
import { SearchParams } from '../types/types';

// Sanitize search parameters
export function sanitizeSearchParams(params: any): SearchParams {
  const sanitizedParams: SearchParams = {};


  if (params.name && typeof params.name === 'string') {
    sanitizedParams.name = validator.escape(params.name.trim().toLowerCase());
  }


  if (params.vintage && validator.isInt(params.vintage.toString())) {
    sanitizedParams.vintage = parseInt(params.vintage, 10);
  }

  return sanitizedParams;
}

