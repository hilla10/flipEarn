import { useClerk, useUser } from '@clerk/clerk-react';
import { ListingCard, Title } from '@components';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LatestListings = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { listings } = useSelector((state) => state.listing);

  return (
    <div className='mt-20 mb-8'>
      {listings && listings.length > 0 ? (
        <Title
          title='Latest Listings'
          description='Discover the hottest social profiles available right now.'
        />
      ) : null}

      <div className='flex flex-col gap-6 px-6'>
        {!listings || listings.length === 0 ? (
          <div className=' mx-auto p-5 py-8 flex flex-col items-center justify-center text-center rounded-[15px] bg-linear-to-r from-[#F3EAFF] to-[#E1EFFF] max-w-3xl'>
            {' '}
            <div className='flex flex-col items-center mb-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                No active listings yet
              </h3>
              <p className='text-slate-600 max-w-150 text-lg pt-2'>
                Get started by creating your very first listing. It only takes a
                couple of minutes.
              </p>
            </div>
            <Link
              className='flex justify-center text-blue-700 text-lg font-bold'
              to={user ? '/my-listings' : '#'}
              onClick={() => (user ? scrollTo(0, 0) : openSignIn())}>
              {' '}
              My Listings{' '}
            </Link>
          </div>
        ) : (
          listings?.slice(0, 4).map((listing, index) => (
            <div className='mx-auto w-full max-w-3xl rounded-xl' key={index}>
              <ListingCard listing={listing} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestListings;
