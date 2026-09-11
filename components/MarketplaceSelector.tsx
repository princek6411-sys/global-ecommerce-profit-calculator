'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CountryCode, Platform } from '@/lib/config';
import { countries, getPlatformsForCountry, type CurrencyCode, type LanguageCode, languages, currencies } from '@/lib/config';
import FlagIcon from '@/components/FlagIcon';
import BrandIcon from '@/components/BrandIcon';
import { ChevronDown, Globe2 } from 'lucide-react';

type Props = {
  country: CountryCode;
  currency: CurrencyCode;
  language: LanguageCode;
  platform: Platform;
  onCountryChange: (country: CountryCode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onLanguageChange: (language: LanguageCode) => void;
  onPlatformChange: (platform: Platform) => void;
};

function Popup({ label, value, open, setOpen, children }: { label: string; value: ReactNode; open: boolean; setOpen: (value: boolean) => void; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [setOpen]);
  return (
    <div className="visual-selector" ref={rootRef}>
      <button type="button" className="visual-selector-trigger" aria-expanded={open} onClick={() => setOpen(!open)}>
        {value}<ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && <div className="visual-selector-menu" role="dialog" aria-label={label}>{children}</div>}
    </div>
  );
}

export default function MarketplaceSelector(props: Props) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const currentCountry = countries.find((x) => x.code === props.country) ?? countries[0];
  const currentLanguage = languages.find((x) => x.code === props.language) ?? languages[0];
  const currentCurrency = currencies[props.currency];
  const platforms = getPlatformsForCountry(props.country);

  return (
    <div className="localization-controls" aria-label="Country, currency and language controls">
      <Popup label="Country" open={countryOpen} setOpen={setCountryOpen} value={<><FlagIcon country={props.country} /><span>{currentCountry.name}</span></>}>
        <div className="selector-menu-heading">Where are you selling?</div>
        <div className="selector-options" role="listbox" aria-label="Country">
          {countries.map((c) => (
            <button key={c.code} type="button" role="option" aria-selected={c.code === props.country} className={`selector-option ${c.code === props.country ? 'selected' : ''}`} onClick={() => { props.onCountryChange(c.code); setCountryOpen(false); }}>
              <FlagIcon country={c.code} />
              <span><strong>{c.name}</strong><small>{c.currency} · {c.language.toUpperCase()}</small></span>
              {c.code === props.country && <span className="selector-check">✓</span>}
            </button>
          ))}
        </div>
      </Popup>

      <Popup label="Currency" open={currencyOpen} setOpen={setCurrencyOpen} value={<><span className="currency-glyph">{currentCurrency.symbol}</span><span>{props.currency}</span></>}>
        <div className="selector-menu-heading">Choose currency</div>
        <div className="selector-options" role="listbox" aria-label="Currency">
          {(Object.entries(currencies) as [CurrencyCode, typeof currencies[CurrencyCode]][]).map(([code, c]) => (
            <button key={code} type="button" role="option" aria-selected={code === props.currency} className={`selector-option compact ${code === props.currency ? 'selected' : ''}`} onClick={() => { props.onCurrencyChange(code); setCurrencyOpen(false); }}>
              <span className="currency-glyph">{c.symbol}</span><span><strong>{code}</strong><small>{c.label}</small></span>{code === props.currency && <span className="selector-check">✓</span>}
            </button>
          ))}
        </div>
      </Popup>

      <Popup label="Language" open={languageOpen} setOpen={setLanguageOpen} value={<><Globe2 size={15} aria-hidden="true" /><span>{currentLanguage.nativeName}</span></>}>
        <div className="selector-menu-heading">Choose language</div>
        <div className="selector-options" role="listbox" aria-label="Language">
          {languages.map((l) => (
            <button key={l.code} type="button" role="option" aria-selected={l.code === props.language} className={`selector-option compact ${l.code === props.language ? 'selected' : ''}`} onClick={() => { props.onLanguageChange(l.code); setLanguageOpen(false); }}>
              <span className="language-glyph">{l.nativeName.slice(0, 1)}</span><span><strong>{l.nativeName}</strong><small>{l.code.toUpperCase()}</small></span>{l.code === props.language && <span className="selector-check">✓</span>}
            </button>
          ))}
        </div>
      </Popup>

      <div className="marketplace-context">
        <span className="context-label">Marketplace</span>
        <div className="marketplace-rail" role="listbox" aria-label="Marketplace">
          {platforms.map((p) => (
            <button key={p.platform} type="button" role="option" aria-selected={p.platform === props.platform} className={`marketplace-pill ${p.platform === props.platform ? 'selected' : ''}`} onClick={() => props.onPlatformChange(p.platform)} title={`${p.platform} · ${props.country}`}>
              <BrandIcon platform={p.platform} size={21} label={p.platform} />
              <span>{p.platform}</span>
              {p.platform === props.platform && <span className="marketplace-selected-dot" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
