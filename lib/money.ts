import type { CurrencyCode } from '@/lib/config';
import { currencies } from '@/lib/config';

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export function isFiniteAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function money(amount: number, currency: CurrencyCode): Money {
  return { amount: isFiniteAmount(amount) ? amount : 0, currency };
}

export function addMoney(a: Money, b: Money, convertB?: (money: Money, currency: CurrencyCode) => Money): Money {
  if (a.currency !== b.currency) {
    if (!convertB) throw new Error('Cannot add Money values with different currencies without conversion.');
    b = convertB(b, a.currency);
  }
  return money(a.amount + b.amount, a.currency);
}

export function multiplyMoney(a: Money, factor: number): Money {
  return money(a.amount * (Number.isFinite(factor) ? factor : 0), a.currency);
}

export function formatMoney(value: number | Money, fallbackCurrency: CurrencyCode = 'USD'): string {
  const amount = typeof value === 'number' ? value : value.amount;
  const currency = typeof value === 'number' ? fallbackCurrency : value.currency;
  const meta = currencies[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(isFiniteAmount(amount) ? amount : 0);
}

export function roundMoney(value: number, currency: CurrencyCode): number {
  const digits = currency === 'JPY' ? 0 : 2;
  const factor = 10 ** digits;
  return Math.round((Number.isFinite(value) ? value : 0) * factor) / factor;
}
