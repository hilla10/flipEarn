import { ChevronDown, Filter, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = ({
  showFilterPhone,
  setShowFilterPhone,
  filters,
  setFilters,
}) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const navigate = useNavigate();

  const onSearchChange = (e) => {
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
      setSearch(e.target.value);
    } else {
      navigate('/marketplace');
      setSearch('');
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const onFiltersChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const onClearFilters = () => {
    if (search) {
      navigate('/marketplace');
    }

    setFilters({
      platform: null,
      minPrice: 0,
      maxPrice: null,
      minFollowers: 0,
      niche: null,
      verified: false,
      monetized: false,
    });
  };

  const platforms = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'tik Tok' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'discord', label: 'Discord' },
  ];

  const niches = [
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'tech', label: 'Tech' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'music', label: 'Music' },
    { value: 'art', label: 'Art' },
    { value: 'sports', label: 'Sports' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
  ];

  return (
    <div
      className={`${showFilterPhone ? 'max-sm:fixed' : 'max-sm:hidden'} max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px] `}>
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 text-gray-700'>
            <Filter className='size-4' />
            <h3 className='font-semibold'>Filters</h3>
          </div>

          <div className='flex items-center gap-2'>
            <X
              onClick={onClearFilters}
              className=' size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer'
            />
            <button
              onClick={() => setShowFilterPhone(false)}
              className='sm:hidden text-sm border text-gray-700 px-3 py-1 rounded'>
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className='p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar'>
        <div className='flex items-center justify-between'>
          <input
            placeholder='Search by username, platform, niche, etc.'
            className='w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500'
            type='text'
            value={search}
            onChange={onSearchChange}
          />
        </div>

        {/* Platform Filter */}

        <div>
          <button
            onClick={() => toggleSection('platform')}
            className='flex items-center justify-between w-full mb-3'>
            <label
              className='text-sm font-medium text-gray-800'
              htmlFor='platform'>
              Platform
            </label>
            <ChevronDown
              className={`${expandedSections.platform ? 'rotate-180' : ''} size-4 transition-transform `}
            />
          </button>

          {expandedSections.platform && (
            <div className='flex flex-col gap-2'>
              {platforms.map(({ value, label }) => (
                <label
                  className='flex items-center gap-2 text-gray-700 text-sm'
                  key={value}>
                  <input
                    type='checkbox'
                    checked={filters.platform?.includes(value) || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = filters.platform || [];
                      const updated = checked
                        ? [...current, value]
                        : current.filter((p) => p != value);

                      onFiltersChange({
                        ...filters,
                        platform: updated.length > 0 ? updated : null,
                      });
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}

        <div>
          <button
            type='button'
            onClick={() => toggleSection('price')}
            className='flex items-center justify-between w-full mb-3'>
            <span className='text-sm font-medium text-gray-800'>
              Price Range
            </span>

            <ChevronDown
              className={`size-4 transition-transform ${
                expandedSections.price ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Quick price presets */}
          {expandedSections.price && (
            <div className='space-y-4'>
              <select
                value={`${filters.minPrice ?? 0}-${filters.maxPrice ?? 'max'}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');

                  onFiltersChange({
                    ...filters,
                    minPrice: Number(min),
                    maxPrice: max === 'max' ? null : Number(max),
                  });
                }}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500 mb-4'>
                <option value='0-max'>Any Price</option>
                <option value='0-10000'>Under 10K</option>
                <option value='10000-50000'>10K - 50K</option>
                <option value='50000-100000'>50K - 100K</option>
                <option value='100000-500000'>100K - 500K</option>
                <option value='500000-1000000'>500K - 1M</option>
                <option value='1000000-max'>1M+</option>
              </select>

              {/* Current values */}
              <div className='flex items-center justify-between text-sm font-medium text-gray-700'>
                <span>
                  {currency}
                  {(filters.minPrice ?? 0).toLocaleString()}
                </span>

                <span>
                  {filters.maxPrice === null
                    ? `${currency}1M+`
                    : `${currency}${filters.maxPrice.toLocaleString()}`}
                </span>
              </div>

              {/* Range slider */}
              <div className='relative h-6'>
                {/* Track */}
                <div className='absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-lg bg-gray-200' />

                {/* Selected range */}
                <div
                  className='absolute top-1/2 h-2 -translate-y-1/2 rounded-lg bg-indigo-600'
                  style={{
                    left: `${((filters.minPrice ?? 0) / 1000000) * 100}%`,
                    right: `${
                      100 - ((filters.maxPrice ?? 1000000) / 1000000) * 100
                    }%`,
                  }}
                />

                {/* Minimum slider */}
                <input
                  type='range'
                  min='0'
                  max='1000000'
                  step='10000'
                  value={filters.minPrice ?? 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    onFiltersChange({
                      ...filters,
                      minPrice: Math.min(value, filters.maxPrice ?? 1000000),
                    });
                  }}
                  className='range-slider'
                />

                {/* Maximum slider */}
                <input
                  type='range'
                  min='0'
                  max='1000000'
                  step='10000'
                  value={filters.maxPrice ?? 1000000}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    onFiltersChange({
                      ...filters,
                      maxPrice: Math.max(value, filters.minPrice ?? 0),
                    });
                  }}
                  className='range-slider'
                />
              </div>

              {/* Min / Max inputs */}
              <div className='flex gap-3'>
                <div className='flex-1'>
                  <label className='block mb-1 text-xs text-gray-500'>
                    Minimum
                  </label>

                  <input
                    type='number'
                    min='0'
                    max='1000000'
                    step='10000'
                    value={filters.minPrice ?? 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      onFiltersChange({
                        ...filters,
                        minPrice: Math.min(value, filters.maxPrice ?? 1000000),
                      });
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-indigo-500 text-sm'
                  />
                </div>

                <div className='flex-1'>
                  <label className='block mb-1 text-xs text-gray-500'>
                    Maximum
                  </label>

                  <input
                    type='number'
                    min='0'
                    max='1000000'
                    step='10000'
                    value={filters.maxPrice ?? ''}
                    placeholder='No limit'
                    onChange={(e) => {
                      const value = e.target.value;

                      onFiltersChange({
                        ...filters,
                        maxPrice:
                          value === ''
                            ? null
                            : Math.max(Number(value), filters.minPrice ?? 0),
                      });
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-indigo-500 text-sm'
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Followers Range */}
        <div>
          <button
            onClick={() => toggleSection('followers')}
            className='flex items-center justify-between w-full mb-3'>
            <label
              htmlFor='price-range'
              className='text-sm font-medium text-gray-800'>
              Minimum Followers
            </label>
            <ChevronDown
              className={`${expandedSections.followers ? 'rotate-180' : ''} size-4 transition-transform `}
            />
          </button>

          {expandedSections.followers && (
            <select
              value={filters.minFollowers?.toString() || '0'}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minFollowers: parseInt(e.target.value) || 0,
                })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'>
              <option value='0'>Any amount</option>
              <option value='1000'>1K+</option>
              <option value='10000'>10K+</option>
              <option value='50000'>50K+</option>
              <option value='100000'>100K+</option>
              <option value='500000'>500K+</option>
              <option value='1000000'>1M+</option>
            </select>
          )}
        </div>

        {/* Niche Filter */}

        <div>
          <button
            onClick={() => toggleSection('niche')}
            className='flex items-center justify-between w-full mb-3'>
            <label
              htmlFor='price-range'
              className='text-sm font-medium text-gray-800'>
              Niche
            </label>
            <ChevronDown
              className={`${expandedSections.niche ? 'rotate-180' : ''} size-4 transition-transform `}
            />
          </button>

          {expandedSections.niche && (
            <select
              value={filters.niche || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  niche: e.target.value || null,
                })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'>
              <option value=''>All niches</option>
              {niches.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Verification Status */}
        <div>
          <button
            onClick={() => toggleSection('status')}
            className='flex items-center justify-between w-full mb-3'>
            <label
              htmlFor='price-range'
              className='text-sm font-medium text-gray-800'>
              Account Status
            </label>
            <ChevronDown
              className={`${expandedSections.status ? 'rotate-180' : ''} size-4 transition-transform `}
            />
          </button>

          {expandedSections.status && (
            <div className='space-y-3'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filters.verified || false}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, verified: e.target.checked })
                  }
                />
                <span className='text-sm text-gray-700'>
                  Verified accounts only
                </span>
              </label>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  checked={filters.monetized || false}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, monetized: e.target.checked })
                  }
                  type='checkbox'
                />
                <span className='text-sm text-gray-700'>
                  Monetized accounts only
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
