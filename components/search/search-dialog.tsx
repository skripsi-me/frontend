'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type SearchMethod = 'normal' | 'ld';

const METHODS: { value: SearchMethod; label: string }[] = [
	{ value: 'normal', label: 'Normal' },
	{ value: 'ld', label: 'Levenshtein Distance' },
];

export function SearchDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [method, setMethod] = useState<SearchMethod>('normal');

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const q = query.trim();
		if (!q) return;
		router.push(`/produk?search=${encodeURIComponent(q)}&method=${method}`);
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						aria-label="Cari Produk"
					/>
				}
			>
				<SearchIcon />
			</DialogTrigger>

			<DialogContent className="max-w-2xl lg:max-w-6xl">
				<DialogHeader>
					<DialogTitle>Cari Produk</DialogTitle>
					<DialogDescription>
						Ketikan kata kunci, pilih metode pencarian, lalu tekan
						Cari.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Cari produk..."
						aria-label="Kata kunci"
						autoFocus
					/>
					<div
						role="radiogroup"
						aria-label="Metode pencarian"
						className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
					>
						{METHODS.map((m) => (
							<Button
								key={m.value}
								type="button"
								role="radio"
								aria-checked={method === m.value}
								variant={
									method === m.value ? 'default' : 'ghost'
								}
								size="lg"
								onClick={() => setMethod(m.value)}
								className={cn(
									method === m.value
										? ''
										: 'text-on-surface-muted hover:bg-background',
								)}
							>
								{m.label}
							</Button>
						))}
					</div>
					<Button
						type="submit"
						size="lg"
						className={'mt-8'}
						disabled={!query.trim()}
					>
						Cari
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
