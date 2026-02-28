import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../index';
import type { PriceOffer, Hotel } from '../../types/api';

export type TourWithHotel = { offer: PriceOffer; hotel: Hotel | null };

const selectTourSearch = (state: RootState) => state.tourSearch;

export const selectToursWithHotels = createSelector(
  [selectTourSearch],
  (tourSearch) => {
    const { prices, lastCountryId, hotelsByCountryId, status } = tourSearch;
    if (status !== 'success' || !lastCountryId) return [];
    const hotels = hotelsByCountryId[lastCountryId] ?? {};
    return Object.values(prices)
      .map((offer) => ({
        offer,
        hotel: offer.hotelID ? (hotels[offer.hotelID] ?? null) : null,
      }))
      .sort((a, b) => a.offer.amount - b.offer.amount);
  }
);
