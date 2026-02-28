import { useState } from 'react';

import './SearchForm.css';

import { DirectionCombobox } from '../Combobox/DirectionCombobox';
import { deriveCountryId } from '../../utils/direction';
import type { SearchStatus } from '../../store/slices/tourSearchSlice';
import type { GeoEntity } from '../../types/api';

export type SearchFormSubmitPayload = {
  direction: GeoEntity | null;
};

type SearchFormProps = {
  onSubmit?: (payload: SearchFormSubmitPayload) => void;
  searchStatus?: SearchStatus;
  lastCountryId?: string | null;
};

export function SearchForm({ onSubmit, searchStatus, lastCountryId }: SearchFormProps) {
  const [selectedDirection, setSelectedDirection] = useState<GeoEntity | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ direction: selectedDirection });
  };

  const isSearching = searchStatus === 'loading' || searchStatus === 'polling';
  const currentCountryId = deriveCountryId(selectedDirection);
  const submitDisabled = isSearching && currentCountryId === lastCountryId;

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <h1 className="search-form__title">Форма пошуку турів</h1>
      <div className="search-form__field">
        <DirectionCombobox
          value={selectedDirection}
          inputValue={inputValue}
          onSelect={setSelectedDirection}
          onInputChange={setInputValue}
          placeholder="Введіть країну, місто або готель"
        />
      </div>
      <button type="submit" className="search-form__submit" disabled={submitDisabled}>
        Знайти
      </button>
    </form>
  );
}
