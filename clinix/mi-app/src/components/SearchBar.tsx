import React from 'react';
import './SearchBar.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        type="text"
        placeholder={placeholder || 'Buscar...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
