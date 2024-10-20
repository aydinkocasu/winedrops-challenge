//const API_BASE_URL = 'http://localhost:3000/wines';
const API_BASE_URL = 'http://localhost:3000/wines'


export enum SortBy {
	REVENUE = 'revenue',
	BOTTLES_SOLD = 'bottles_sold',
	ORDERS = 'orders'
}

export interface SearchParams {
	name?: string;
	vintage?: string;
}

export async function fetchBestSellingWines(sortBy: SortBy, searchQuery: SearchParams) {
	const params = new URLSearchParams();

	if (sortBy) params.append('sortBy', sortBy);
	if (searchQuery) {
		if (searchQuery.name) params.append('name', searchQuery.name);
		if (searchQuery.vintage) params.append('vintage', searchQuery.vintage);
	}

	const response = await fetch(`${API_BASE_URL}/best-selling?${params.toString()}`);

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
}
