import { useState } from 'react';

import { DirectionCombobox } from '../Combobox/DirectionCombobox';

import type { GeoEntity } from '../../types/api';

import './SearchForm.css';

export type SearchFormSubmitPayload = {
  direction: GeoEntity | null;
};

type SearchFormProps = {
  onSubmit?: (payload: SearchFormSubmitPayload) => void;
};

export function SearchForm({ onSubmit }: SearchFormProps) {
  const [selectedDirection, setSelectedDirection] = useState<GeoEntity | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ direction: selectedDirection });
  };

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
      <button type="submit" className="search-form__submit">
        Знайти
      </button>
    </form>
  );
}
