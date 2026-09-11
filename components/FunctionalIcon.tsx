'use client';

import { Activity, BarChart3, Calculator as CalculatorIcon, FileSpreadsheet, Megaphone, Scale, Target, WalletCards } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = {
  profit: CalculatorIcon,
  margin: BarChart3,
  breakeven: Scale,
  roas: Megaphone,
  maxad: WalletCards,
  target: Target,
  stress: Activity,
  csv: FileSpreadsheet,
  sku: BarChart3,
};

export default function FunctionalIcon({ name, size = 20 }: { name: keyof typeof map; size?: number }) {
  const Icon = map[name] ?? CalculatorIcon;
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />;
}
