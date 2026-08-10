import { FilterSidebar, ListingCard } from '@components';
import { ArrowLeftIcon, FilterIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: null,
    minFollowers: null,
    niche: null,
    verified: false,
    monetized: false,
  });

  const { listings } = useSelector((state) => state.listing);

  const filteredListings = listings?.filter((listing) => {
    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(listing.platform)) return false;
    }

    if (filters.maxPrice !== null) {
      if (Number(listing.price) > Number(filters.maxPrice)) {
        return false;
      }
    }

    // Minimum followers
    if (
      filters.minFollowers !== null &&
      Number(listing.followers_count) < Number(filters.minFollowers)
    ) {
      return false;
    }

    // Niche
    if (filters.niche?.length > 0 && !filters.niche.includes(listing.niche)) {
      return false;
    }

    if (filters.verified && listing.verified !== filters.verified) return false;

    if (filters.monetized && listing.monetized !== filters.monetized)
      return false;

    // Search
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      const searchableText = [
        listing.title,
        listing.username,
        listing.description,
        listing.platform,
        listing.niche,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const navigate = useNavigate();

  if (listings === null) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2Icon className='size-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 '>
      <div className='flex items-center justify-between text-slate-500'>
        <button
          onClick={() => {
            navigate('/');
            scrollTo(0, 0);
          }}
          className='flex items-center gap-2 py-5'>
          {' '}
          <ArrowLeftIcon className='size-4' /> Back to Home
        </button>
        <button
          onClick={() => setShowFilterPhone(true)}
          className='flex sm:hidden items-center gap-2 py-5 '>
          <FilterIcon className='size-4' />
          Filters
        </button>
      </div>
      <div className='relative flex items-start justify-between gap-8 pb-8'>
        <FilterSidebar
          setShowFilterPhone={setShowFilterPhone}
          showFilterPhone={showFilterPhone}
          setFilters={setFilters}
          filters={filters}
        />

        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {[...filteredListings]
            .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
            .map((listing) => (
              <ListingCard listing={listing} key={listing.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
