import type {
  CountriesMap,
  GeoResponse,
  HotelsMap,
  PricesMap,
  StartSearchResponse,
  GetSearchPricesResponse,
  ErrorResponse,
} from '../types/api';
import {
  getCountries as getCountriesFetch,
  searchGeo as searchGeoFetch,
  startSearchPrices as startSearchPricesFetch,
  getSearchPrices as getSearchPricesFetch,
  getHotels as getHotelsFetch,
} from '../api-provided/api.js';

export async function fetchCountries(): Promise<CountriesMap> {
  const response = await getCountriesFetch();
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
}

export async function fetchSearchGeo(query?: string): Promise<GeoResponse> {
  const response = await searchGeoFetch(query ?? undefined);
  if (!response.ok) throw new Error('Failed to search geo');
  return response.json();
}

export type StartSearchResult =
  | { ok: true; token: string; waitUntil: string }
  | { ok: false; code: number; message: string };

export async function startSearchPrices(countryId: string): Promise<StartSearchResult> {
  try {
    const response = await startSearchPricesFetch(countryId);
    const data = await response.json();
    if (response.ok) return { ok: true, ...(data as StartSearchResponse) };
    return { ok: false, ...(data as ErrorResponse) };
  } catch (err) {
    const res = err as Response;
    if (res?.json) {
      const data = (await res.json()) as ErrorResponse;
      return { ok: false, code: data.code, message: data.message };
    }
    throw err;
  }
}

export type GetSearchPricesResult =
  | { ok: true; prices: PricesMap }
  | { ok: false; code: number; message: string; waitUntil?: string };

export async function getSearchPrices(token: string): Promise<GetSearchPricesResult> {
  try {
    const response = await getSearchPricesFetch(token);
    const data = await response.json();
    if (response.ok) return { ok: true, prices: (data as GetSearchPricesResponse).prices };
    return { ok: false, ...(data as ErrorResponse) };
  } catch (err) {
    const res = err as Response;
    if (res?.json) {
      const data = (await res.json()) as ErrorResponse;
      return {
        ok: false,
        code: data.code,
        message: data.message,
        waitUntil: data.waitUntil,
      };
    }
    throw err;
  }
}

export async function fetchHotels(countryId: string): Promise<HotelsMap> {
  const response = await getHotelsFetch(countryId);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return response.json();
}
