import type { ComponentType } from 'react';
import { IN, US, DE, FR, ES, JP } from 'country-flag-icons/react/3x2';
import type { CountryCode } from '@/lib/config';

type FlagProps = { className?: string };

const flags: Record<CountryCode, ComponentType<FlagProps>> = { IN, US, DE, FR, ES, JP };

export default function FlagIcon({ country, className = '' }: { country: CountryCode; className?: string }) {
  const Flag = flags[country] ?? IN;
  return <Flag className={`flag-svg ${className}`} aria-hidden="true" />;
}
