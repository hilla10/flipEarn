import { getAllPublicListing } from '@app/features/listingSlice';
import { FilterSidebar, ListingCard } from '@components';
import { ArrowLeftIcon, FilterIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const { listings, loading, error } = useSelector((state) => state.listing);
  const dispatch = useDispatch();

  const filteredListings = (listings ?? []).filter((listing) => {
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

  if (loading && listings === null) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2Icon className='size-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-4 md:px-6 lg:px-24 xl:px-32'>
        <div className='max-w-2xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 p-8 text-center'>
          <h3 className='text-lg font-semibold'>{error}</h3>
          <p className='text-sm text-gray-500 mt-2'>Please try again.</p>
          <button
            onClick={() => dispatch(getAllPublicListing())}
            disabled={loading}
            className='mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300'>
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
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
