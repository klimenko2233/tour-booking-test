import { useRef, useEffect, useState, useCallback } from 'react';

import './DirectionCombobox.css';

import { fetchCountries, fetchSearchGeo } from '../../services/tourApi';
import type { GeoEntity, Country } from '../../types/api';

const DEBOUNCE_MS = 200;

function getOptionId(entity: GeoEntity): string {
  if (entity.type === 'country') return entity.id;
  return String(entity.id);
}

function GeoOptionIcon({ entity }: { entity: GeoEntity }) {
  if (entity.type === 'country') {
    return (
      <span className="direction-combobox__option-flag" aria-hidden>
        <img src={(entity as Country).flag} alt="" width={24} height={18} />
      </span>
    );
  }
  if (entity.type === 'city') {
    return (
      <span className="direction-combobox__option-icon" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="direction-combobox__option-icon" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-3h-8v8H3V5H1v15h2v-3h18v-3z" />
      </svg>
    </span>
  );
}

export type DirectionComboboxProps = {
  value: GeoEntity | null;
  inputValue: string;
  onSelect: (entity: GeoEntity | null) => void;
  onInputChange: (value: string) => void;
  placeholder?: string;
};

export function DirectionCombobox({
  value,
  inputValue,
  onSelect,
  onInputChange,
  placeholder = 'Оберіть напрямок',
}: DirectionComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<GeoEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusAfterSelectRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions = useCallback(async (query: string, selectedType?: GeoEntity['type']) => {
    setLoading(true);
    try {
      if (!query.trim() || selectedType === 'country') {
        const map = await fetchCountries();
        const list: GeoEntity[] = Object.values(map).map((c) => ({ ...c, type: 'country' }));
        setOptions(list);
      } else {
        const response = await fetchSearchGeo(query);
        setOptions(Object.values(response));
      }
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const openedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      openedRef.current = false;
      return;
    }
    if (openedRef.current) return;
    openedRef.current = true;
    const selectedType = value?.type;
    const query = inputValue.trim();
    if (!query || selectedType === 'country') {
      loadOptions('');
    } else {
      loadOptions(query, selectedType);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- load once when opening with current value/inputValue

  const handleInputFocus = () => {
    if (focusAfterSelectRef.current) {
      focusAfterSelectRef.current = false;
      return;
    }
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onInputChange(v);
    onSelect(null);
    setIsOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadOptions(v.trim());
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (entity: GeoEntity) => {
    onSelect(entity);
    onInputChange(entity.name);
    setIsOpen(false);
    focusAfterSelectRef.current = true;
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onSelect(null);
    onInputChange('');
    setIsOpen(true);
    loadOptions('');
  };

  return (
    <div className="direction-combobox" ref={containerRef}>
      <div className="direction-combobox__input-wrap">
        <input
          ref={inputRef}
          type="text"
          className="direction-combobox__input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="direction-combobox-list"
          id="direction-combobox-input"
        />
        {inputValue && (
          <button
            type="button"
            className="direction-combobox__clear"
            onClick={handleClear}
            aria-label="Очистити"
          >
            ×
          </button>
        )}
      </div>
      {isOpen && (
        <div
          id="direction-combobox-list"
          className="direction-combobox__dropdown"
          role="listbox"
          aria-labelledby="direction-combobox-input"
        >
          {loading ? (
            <div className="direction-combobox__loading">Завантаження…</div>
          ) : options.length === 0 ? (
            <div className="direction-combobox__empty">Нічого не знайдено</div>
          ) : (
            options.map((entity) => (
              <button
                key={`${entity.type}-${getOptionId(entity)}`}
                type="button"
                role="option"
                className="direction-combobox__option"
                onClick={() => handleSelect(entity)}
              >
                <GeoOptionIcon entity={entity} />
                <span>{entity.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
