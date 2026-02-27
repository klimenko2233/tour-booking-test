import type { CountriesMap } from '../../types/api';
import type { TourWithHotel } from '../../store/slices/tourSearchSelectors';
import type { SearchStatus } from '../../store/slices/tourSearchSlice';
import { TourCard } from '../TourCard/TourCard';
import './SearchResults.css';

type SearchResultsProps = {
  status: SearchStatus;
  tours: TourWithHotel[];
  countriesMap: CountriesMap | null;
  error: string | null;
  onRetry?: () => void;
};

export function SearchResults({
  status,
  tours,
  countriesMap,
  error,
  onRetry,
}: SearchResultsProps) {
  if (status === 'idle') return null;

  if (status === 'loading' || status === 'polling') {
    return (
      <div className="search-results search-results_loading" role="status" aria-live="polite">
        <div className="search-results__spinner" aria-hidden />
        <p className="search-results__text">Завантаження турів…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="search-results search-results_error">
        <p className="search-results__text">{error ?? 'Помилка пошуку'}</p>
        {onRetry && (
          <button type="button" className="search-results__retry" onClick={onRetry}>
            Спробувати ще раз
          </button>
        )}
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="search-results search-results_empty">
        <p className="search-results__text">За вашим запитом турів не знайдено.</p>
      </div>
    );
  }

  return (
    <div className="search-results search-results_success">
      <p className="search-results__count">Знайдено турів: {tours.length}</p>
      <div className="search-results__grid" role="list">
        {tours.map((tour) => (
          <div key={tour.offer.id} role="listitem">
            <TourCard
              tour={tour}
              countryFlag={tour.hotel && countriesMap ? countriesMap[tour.hotel.countryId]?.flag : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
