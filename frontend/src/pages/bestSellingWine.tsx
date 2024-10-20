import { useEffect, useState } from 'react';
import FilterButtons from '../components/filterButtons';
import { useQuery } from '@tanstack/react-query';
import { fetchBestSellingWines, SearchParams, SortBy } from '../api/api';

// Define proper Wine type
type Wine = {
  wine_id: number;
  wine_name: string;
  vintage: number;
  total_revenue: number;
  position: number;
  isMatched: boolean;
  isTop10: boolean
  isBottom10: boolean
};

const BestSellingWine = () => {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.REVENUE);
  const [searchQuery, setSearchQuery] = useState<SearchParams>({ name: '', vintage: '' });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<SearchParams>(searchQuery);

  // Use React Query to fetch bestselling wines
  const { data, error, isLoading } = useQuery({
    queryKey: ['bestSellingWines', sortBy, debouncedSearchQuery],
    queryFn: () => fetchBestSellingWines(sortBy, debouncedSearchQuery),
    staleTime: 1000 * 60 * 5,
  });

  const changeFilter = (sortSetting: SortBy) => {
    if (sortSetting !== sortBy) setSortBy(sortSetting)
  };

  const handleStyle = (wine: Wine) => {
    const isTop10 = wine.isTop10;
    const isBottom10 = wine.isBottom10;
    const isMatched = wine.isMatched
    const searching = debouncedSearchQuery.name || debouncedSearchQuery.vintage
    let color = 'white'
    let backgroundColor = 'white'
    let marginLeft = '0px'
    if (searching && isMatched) {
      color = isTop10 || isBottom10 ? 'white' : 'black'
      backgroundColor = isTop10 ? 'green' : (isBottom10 ? 'red' : 'transparent')
      marginLeft = '20px'
    } else if (searching && !isMatched) {
      color = '#cacaca'
    } else {
      color = isTop10 || isBottom10 ? 'white' : 'black'
      backgroundColor = isTop10 ? 'green' : (isBottom10 ? 'red' : 'transparent')
    }

    return {
      marginTop: '10px',
      borderRadius: '4px',
      marginLeft: marginLeft,
      padding: '5px',
      color: color,
      backgroundColor: backgroundColor
    }
  }


  const RenderTable = () => {
    if (error) return (
      <div className='d-flex full-w full-h center'>
        {error.message}
      </div>
    )

    if (data && data.length === 0) return (
      <div className='d-flex full-w full-h center'>
        No wine found
      </div>
    )


    return (
      <div className='d-flex-column-min'>
        {isLoading && <div className='d-flex full-w full-h center'>
          Loading
        </div>
        }
        {data && data.map((wine: Wine) => {
          return (
            <div
              key={wine.wine_id}
              style={handleStyle(wine)}
            >
              #{wine.position}: {wine.wine_name} ({wine.vintage}) - {wine.total_revenue} USD
            </div>)
        })}
      </div>
    )
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  return (
    <div className="d-flex full-vh center">
      <div className="d-flex-column gap">
        <div>
          <h1>Best Selling Wine</h1>
        </div>
        <div>
          <FilterButtons change={changeFilter} />
        </div>
        <div className='d-flex full-w'>
          <input
            type="text"
            placeholder="Search by wine name"
            style={{ width: '100%' }}
            value={searchQuery.name}
            onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Search by vintage"
            style={{ width: '50px' }}
            value={searchQuery.vintage}
            onChange={(e) => setSearchQuery({ ...searchQuery, vintage: e.target.value })}
          />
        </div>
        <div className='overflow'>
          <RenderTable />
        </div>
      </div>
    </div>
  );
};

export default BestSellingWine;

