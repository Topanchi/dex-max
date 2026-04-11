import { getTypeColor } from '@/utils/typeColors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const { bg, text } = getTypeColor(type);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-block rounded-full capitalize ${bg} ${text} ${sizeClass}`}
      title={type}
    >
      {type}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'legendary' | 'mythical' | 'baby' | 'default';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants: Record<string, string> = {
    legendary: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    mythical:  'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    baby:      'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    default:   'bg-slate-700 text-slate-300',
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
