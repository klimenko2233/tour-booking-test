export type Country = { id: string; name: string; flag: string };
export type City = { id: number; name: string };
export type Hotel = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
};

export type GeoEntity =
  | (Country & { type: 'country' })
  | (City & { type: 'city' })
  | (Hotel & { type: 'hotel' });

export type CountriesMap = Record<string, Country>;
export type GeoResponse = Record<string, GeoEntity>;
