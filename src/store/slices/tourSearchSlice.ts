import { createSlice } from '@reduxjs/toolkit';
import type { PricesMap, HotelsMap } from '../../types/api';
import { startSearchPrices, getSearchPrices, fetchHotels } from '../../services/tourApi';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type SearchStatus =
  | 'idle'
  | 'loading'
  | 'polling'
  | 'success'
  | 'empty'
  | 'error';

type TourSearchState = {
  status: SearchStatus;
  prices: PricesMap;
  error: string | null;
  lastCountryId: string | null;
  activeToken: string | null;
  cache: Record<string, PricesMap>;
  hotelsByCountryId: Record<string, HotelsMap>;
};

const initialState: TourSearchState = {
  status: 'idle',
  prices: {},
  error: null,
  lastCountryId: null,
  activeToken: null,
  cache: {},
  hotelsByCountryId: {},
};

export const tourSearchSlice = createSlice({
  name: 'tourSearch',
  initialState,
  reducers: {
    searchStarted: (state, action: { payload: string }) => {
      state.status = 'loading';
      state.error = null;
      state.lastCountryId = action.payload;
      state.activeToken = null;
    },
    searchPolling: (
      state,
      action: { payload: { token: string; waitUntil: string } }
    ) => {
      state.status = 'polling';
      state.activeToken = action.payload.token;
    },
    searchSuccess: (state, action: { payload: { countryId: string; prices: PricesMap } }) => {
      const { countryId, prices } = action.payload;
      state.status = 'success';
      state.prices = prices;
      state.error = null;
      state.activeToken = null;
      state.lastCountryId = countryId;
      state.cache[countryId] = prices;
    },
    searchEmpty: (state, action: { payload: string }) => {
      const countryId = action.payload;
      state.status = 'empty';
      state.prices = {};
      state.error = null;
      state.activeToken = null;
      state.lastCountryId = countryId;
      state.cache[countryId] = {};
    },
    searchError: (state, action: { payload: string }) => {
      state.status = 'error';
      state.error = action.payload;
      state.activeToken = null;
    },
    setHotelsForCountry: (
      state,
      action: { payload: { countryId: string; hotels: HotelsMap } }
    ) => {
      state.hotelsByCountryId[action.payload.countryId] = action.payload.hotels;
    },
  },
});

export const {
  searchStarted,
  searchPolling,
  searchSuccess,
  searchEmpty,
  searchError,
  setHotelsForCountry,
} = tourSearchSlice.actions;

type ThunkArg = {
  dispatch: (action: ReturnType<typeof searchStarted> | ReturnType<typeof searchPolling> | ReturnType<typeof searchSuccess> | ReturnType<typeof searchEmpty> | ReturnType<typeof searchError> | ReturnType<typeof setHotelsForCountry>) => void;
  getState: () => { tourSearch: TourSearchState };
};

async function ensureHotelsLoaded(
  dispatch: ThunkArg['dispatch'],
  getState: ThunkArg['getState'],
  countryId: string
) {
  const hotels = getState().tourSearch.hotelsByCountryId[countryId];
  if (hotels && Object.keys(hotels).length > 0) return;
  try {
    const hotels = await fetchHotels(countryId);
    dispatch(setHotelsForCountry({ countryId, hotels }));
  } catch {
    dispatch(setHotelsForCountry({ countryId, hotels: {} }));
  }
}

export function startSearch(countryId: string) {
  return async (dispatch: ThunkArg['dispatch'], getState: ThunkArg['getState']) => {
    const { cache } = getState().tourSearch;
    const cached = cache[countryId];
    if (cached && Object.keys(cached).length > 0) {
      dispatch(searchSuccess({ countryId, prices: cached }));
      await ensureHotelsLoaded(dispatch, getState, countryId);
      return;
    }

    dispatch(searchStarted(countryId));

    const startResult = await startSearchPrices(countryId);
    if (!startResult.ok) {
      dispatch(searchError(startResult.message));
      return;
    }

    const { token, waitUntil } = startResult;
    dispatch(searchPolling({ token, waitUntil }));

    let currentWaitUntil = waitUntil;
    let retriesLeft = MAX_RETRIES;

    for (;;) {
      const delay = Math.max(0, new Date(currentWaitUntil).getTime() - Date.now());
      await sleep(delay);

      const result = await getSearchPrices(token);

      if (result.ok) {
        const prices = result.prices;
        if (Object.keys(prices).length > 0) {
          dispatch(searchSuccess({ countryId, prices }));
        } else {
          dispatch(searchEmpty(countryId));
        }
        await ensureHotelsLoaded(dispatch, getState, countryId);
        return;
      }

      if (result.code === 425 && result.waitUntil) {
        currentWaitUntil = result.waitUntil;
        continue;
      }

      if (retriesLeft > 0) {
        retriesLeft -= 1;
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      dispatch(searchError(result.message));
      return;
    }
  };
}
