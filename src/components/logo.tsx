import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';

export function Logo() {
  const { state } = useSidebar();
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <ShieldCheck className="h-7 w-7 text-primary" />
      <h1 className={cn("text-xl font-bold text-foreground group-data-[state=collapsed]/sidebar:hidden", state === 'collapsed' && "hidden")}>Accountable</h1>
    </Link>
  );
}
