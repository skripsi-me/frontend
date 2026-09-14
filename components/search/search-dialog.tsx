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
import { useCategories } from '@/hooks/category.hook';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

export function SearchDialog() {
	const router = useRouter();
	const params = useSearchParams();
	const categoryParam = params.get('category');

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [categoryId, setCategoryId] = useState<string | undefined>(
		categoryParam ?? undefined,
	);
	const { data: categories } = useCategories();

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const q = query.trim();
		if (!q) return;
		const params = new URLSearchParams({ search: q });
		if (categoryId) params.set('category', categoryId);
		router.push(`/produk?${params.toString()}`);
		setOpen(false);
	}

	const chipClass = (active: boolean) =>
		cn(
			'shrink-0 rounded-full border px-4 py-2 text-label-sm transition-colors',
			active
				? 'border-primary bg-primary text-primary-foreground'
				: 'border-border bg-surface text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary',
		);

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

			<DialogContent className="sm:max-w-xl lg:max-w-2xl">
				<DialogHeader className="mb-4 w-full">
					<DialogTitle>Cari Produk</DialogTitle>
					<DialogDescription>
						Ketikan kata kunci dan pilih kategori, lalu tekan Cari.
					</DialogDescription>
				</DialogHeader>
				<div className="w-full">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4 w-full"
					>
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Cari produk..."
							aria-label="Kata kunci"
							autoFocus
							className="w-full"
						/>
						<nav
							aria-label="Pilih kategori"
							className="-mx-1 flex gap-2 flex-wrap"
						>
							<button
								type="button"
								className={chipClass(categoryId === undefined)}
								onClick={() => setCategoryId(undefined)}
							>
								Semua
							</button>
							{categories?.map((category) => (
								<button
									key={category.id}
									type="button"
									className={chipClass(
										categoryId === category.id,
									)}
									onClick={() => setCategoryId(category.id)}
								>
									{category.name}
								</button>
							))}
						</nav>
						<Button
							type="submit"
							size="lg"
							disabled={!query.trim()}
						>
							Cari
						</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
