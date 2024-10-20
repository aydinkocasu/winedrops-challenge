

export enum SortBy {
  REVENUE = 'revenue',
  BOTTLES_SOLD = 'bottles_sold',
  ORDERS = 'orders'
}

export interface SearchParams {
  name?: string;
  vintage?: number;
}

