export type Country = { id: string; name: string; flag: string };
export type City = { id: number; name: string; countryId?: string };
export type Hotel = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
};

export type HotelsMap = Record<string, Hotel>;

export type GeoEntity =
  | (Country & { type: 'country' })
  | (City & { type: 'city' })
  | (Hotel & { type: 'hotel' });

export type CountriesMap = Record<string, Country>;
export type GeoResponse = Record<string, GeoEntity>;

export type PriceOffer = {
  id: string;
  amount: number;
  currency: 'usd';
  startDate: string;
  endDate: string;
  hotelID?: string;
};

export type PricesMap = Record<string, PriceOffer>;

export type StartSearchResponse = { token: string; waitUntil: string };
export type GetSearchPricesResponse = { prices: PricesMap };
export type ErrorResponse = {
  code: number;
  error: true;
  message: string;
  waitUntil?: string;
};
