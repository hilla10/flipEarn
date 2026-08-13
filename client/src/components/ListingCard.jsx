import { platformIcons } from '@assets/assets';
import { BadgeCheck, LineChart, MapPin, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  // Safe guard clause for null/undefined/empty object
  if (
    !listing ||
    (typeof listing === 'object' && Object.keys(listing).length === 0)
  ) {
    return null;
  }

  const handleDetailsClick = () => {
    navigate(`/listing/${listing.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='relative  bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
      {/* Featured Banner */}
      {listing.featured && (
        <>
          <p className='py-1' />
          <div className='absolute top-0 left-0 w-full bg-linear-to-r  from-pink-500 text-white text-center text-xs font-semibold py-1 tracking-wide uppercase '>
            Featured
          </div>
        </>
      )}

      <div className='p-5 pt-8'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-3'>
          {platformIcons?.[listing.platform] || null}

          <div className='flex flex-col'>
            <h2 className='text-gray-800 font-semibold text-base'>
              {listing.title ?? 'Untitled Listing'}
            </h2>
            <p className='text-sm text-gray-500'>
              @{listing.username ?? 'unknown'}{' '}
              {listing.platform && (
                <>
                  - <span className='capitalize'>{listing.platform}</span>
                </>
              )}
            </p>
          </div>
          {listing.verified && (
            <BadgeCheck className='text-green-500 ml-auto w-5 h-5' />
          )}
        </div>

        {/* Stats */}
        <div className='flex flex-wrap justify-between max-w-lg items-center gap-3 my-5'>
          <div className='flex items-center text-sm text-gray-600'>
            <User className='size-6 mr-1 text-gray-400' />
            <span className='text-lg font-medium text-slate-800 mr-1.5'>
              {(listing.followers_count ?? 0).toLocaleString()}
            </span>
            followers
          </div>
          {listing.engagement_rate != null && (
            <div className='flex items-center text-sm text-gray-600'>
              <LineChart className='size-6 mr-1 text-gray-400' />
              <span className='text-lg font-medium text-slate-800 mr-1.5'>
                {listing.engagement_rate}
              </span>
              % engagement
            </div>
          )}
        </div>
        {/* Tags & Location */}
        <div className='flex items-center gap-3 mb-3'>
          {listing.niche && (
            <span className='rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600 capitalize'>
              {listing.niche}
            </span>
          )}
          {listing.country && (
            <div className='flex items-center text-gray-500 text-sm'>
              <MapPin className='size-6 mr-1 text-gray-400' />
              {listing.country}
            </div>
          )}
        </div>
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
          {listing.description ?? 'No description provided.'}
        </p>
        <hr className='my-5 border-gray-200' />

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline '>
            <span className='text-2xl font-medium text-slate-800'>
              {currency} {(listing.price ?? 0).toLocaleString()}
            </span>
          </div>
          <button
            type='button'
            onClick={handleDetailsClick}
            className='rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
