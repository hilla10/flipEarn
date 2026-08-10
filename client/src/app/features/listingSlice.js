import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../configs/axios';

const getErrorMessage = (payload, fallback) => {
  if (typeof payload === 'string') return payload;
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  return fallback;
};

// Get all public listings
export const getAllPublicListing = createAsyncThunk(
  'listing/getAllPublicListing',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/listing/public');
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to fetch listings',
      );
    }
  },
);

// Get all user listings
export const getAllUserListing = createAsyncThunk(
  'listing/getAllUserListing',
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await api.get('/api/listing/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(
        error.response?.data || 'Failed to fetch user listings',
      );
    }
  },
);

const listingSlice = createSlice({
  name: 'listing',
  initialState: {
    listings: null,
    userListings: [],
    balance: {
      earned: 0,
      withdrawn: 0,
      available: 0,
    },
    loading: true,
    error: null,
  },

  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllPublicListing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPublicListing.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.listings = action.payload.listings;
    });
    builder.addCase(getAllPublicListing.rejected, (state, action) => {
      state.loading = false;
      if (state.listings === null) {
        state.error = getErrorMessage(
          action.payload,
          action.error?.message || 'Failed to fetch listings',
        );
      }
    });
    builder.addCase(getAllUserListing.fulfilled, (state, action) => {
      state.userListings = action.payload.listings;
      state.balance = action.payload.balance;
    });
  },
});

export const { setListings } = listingSlice.actions;
export default listingSlice.reducer;
