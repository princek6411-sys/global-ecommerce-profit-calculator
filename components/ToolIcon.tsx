import FunctionalIcon from '@/components/FunctionalIcon';

const iconByPath: Record<string, 'margin' | 'breakeven' | 'roas' | 'maxad' | 'target' | 'profit'> = {
  '/profit-margin-calculator/': 'margin',
  '/break-even-calculator/': 'breakeven',
  '/roas-calculator/': 'roas',
  '/maximum-ad-spend-calculator/': 'maxad',
  '/target-profit-calculator/': 'target',
  '/ecommerce-fee-calculator/': 'profit',
};

export default function ToolIcon({ href }: { href: string }) {
  return <span className="tool-icon" aria-hidden="true"><FunctionalIcon name={iconByPath[href] ?? 'profit'} size={20} /></span>;
}
