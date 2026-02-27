import type { GeoEntity } from '../types/api';

export function deriveCountryId(direction: GeoEntity | null): string | null {
  if (!direction) return null;
  if (direction.type === 'country') return direction.id;
  if (direction.type === 'hotel') return direction.countryId;
  if (direction.type === 'city') return direction.countryId ?? null;
  return null;
}
