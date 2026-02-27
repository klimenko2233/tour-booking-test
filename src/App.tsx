import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { SearchForm } from './components/SearchForm/SearchForm';
import { SearchResults } from './components/SearchResults/SearchResults';
import { startSearch } from './store/slices/tourSearchSlice';
import { deriveCountryId } from './utils/direction';
import type { GeoEntity } from './types/api';
import type { AppDispatch, RootState } from './store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, prices, error, lastCountryId } = useSelector(
    (state: RootState) => state.tourSearch
  );

  const handleSearchSubmit = (payload: { direction: GeoEntity | null }) => {
    const countryId = deriveCountryId(payload.direction);
    if (countryId) dispatch(startSearch(countryId));
  };

  const handleRetry = () => {
    if (lastCountryId) dispatch(startSearch(lastCountryId));
  };

  return (
    <div className="app">
      <div className="app__content">
        <SearchForm onSubmit={handleSearchSubmit} />
        <SearchResults
          status={status}
          prices={prices}
          error={error}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}

export default App;
