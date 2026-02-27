import type { SearchStatus } from '../../store/slices/tourSearchSlice';
import './SearchResults.css';

type SearchResultsProps = {
  status: SearchStatus;
  prices: Record<string, unknown>;
  error: string | null;
  onRetry?: () => void;
};

export function SearchResults({
  status,
  prices,
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

  const count = Object.keys(prices).length;
  return (
    <div className="search-results search-results_success">
      <p className="search-results__text">Знайдено турів: {count}</p>
    </div>
  );
}
