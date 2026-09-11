import type { CountryCode } from '@/lib/config';
import { countries } from '@/lib/config';
import FlagIcon from '@/components/FlagIcon';

export default function CountryPills({ selected, onSelect }: { selected?: CountryCode; onSelect?: (country: CountryCode) => void }) {
  return (
    <div className="country-pill-rail" role="listbox" aria-label="Supported countries">
      {countries.map((c) => (
        onSelect ? (
          <button key={c.code} type="button" className={`country-pill ${selected === c.code ? 'selected' : ''}`} role="option" aria-selected={selected === c.code} onClick={() => onSelect(c.code)}>
            <FlagIcon country={c.code} />
            <span>{c.name === 'United States' ? 'USA' : c.name}</span>
          </button>
        ) : (
          <span key={c.code} className="country-pill" role="option" aria-selected={false}>
            <FlagIcon country={c.code} />
            <span>{c.name === 'United States' ? 'USA' : c.name}</span>
          </span>
        )
      ))}
    </div>
  );
}
