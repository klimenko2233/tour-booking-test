export function getCountries(): Promise<Response>;
export function searchGeo(query?: string): Promise<Response>;
export function startSearchPrices(countryID: string): Promise<Response>;
export function getSearchPrices(token: string): Promise<Response>;
export function stopSearchPrices(token: string): Promise<Response>;
export function getHotels(countryID: string): Promise<Response>;
export function getHotel(hotelId: number | string): Promise<Response>;
export function getPrice(priceId: string): Promise<Response>;
