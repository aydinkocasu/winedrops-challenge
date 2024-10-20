import { Database } from 'sqlite';
import { SearchParams, SortBy } from '../types/types';

export class WineModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // Fetch best selling wines 
  async getBestSellingWines(orderByColumn: string, searchQuery?: SearchParams): Promise<any[]> {

    let query = `
     SELECT 
       master_wine.id AS wine_id, 
       master_wine.name AS wine_name, 
       master_wine.vintage AS vintage, 
       SUM(customer_order.quantity) AS total_bottles_sold,
       SUM(customer_order.total_amount) AS total_revenue,
       COUNT(customer_order.id) AS total_orders
     FROM 
       customer_order
     JOIN 
       wine_product ON customer_order.wine_product_id = wine_product.id
     JOIN 
       master_wine ON wine_product.master_wine_id = master_wine.id
     WHERE 
       customer_order.status IN (?, ?)
    `;

    const parameters = ['paid', 'dispatched'];

    // Add GROUP BY 
    query += `
     GROUP BY 
       master_wine.name, master_wine.vintage
    `;

    // add sorting (by revenue, bottles sold, or orders)
    switch (orderByColumn) {
      case SortBy.BOTTLES_SOLD:
        query += ` ORDER BY SUM(customer_order.quantity) DESC`;
        break;
      case SortBy.REVENUE:
        query += ` ORDER BY SUM(customer_order.total_amount) DESC`;
        break;
      case SortBy.ORDERS:
        query += ` ORDER BY COUNT(customer_order.id) DESC`;
        break;
      default:
        query += ` ORDER BY SUM(customer_order.total_amount) DESC`;
        break;
    }

    //Execute
    const wines = await this.db.all(query, parameters);

    // calculate top 10% and bottom 10%
    const totalWines = wines.length;
    const top10Index = Math.floor(totalWines * 0.1);
    const bottom10Index = Math.ceil(totalWines * 0.9);

    // Filter based on querry
    return wines.map((wine, index) => {
      // check if wine matches querry
      const isMatched = (!searchQuery?.name || wine.wine_name.toLowerCase().includes(searchQuery.name.toLowerCase())) &&
        (!searchQuery?.vintage || wine.vintage === searchQuery.vintage);

      return {
        ...wine,
        position: index + 1, // original pos
        isMatched: isMatched,  // bool if matched
        isTop10: index < top10Index,  // top 10%
        isBottom10: index >= bottom10Index  // bottom 10%
      };
    });
  }
}

