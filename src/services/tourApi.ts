import type { CountriesMap, GeoResponse } from '../types/api';
// @ts-expect-error api.js is legacy JS module
import { getCountries as getCountriesFetch, searchGeo as searchGeoFetch } from '../api.js';

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
