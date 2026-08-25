'use client';

import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { ResearchSkeleton } from '@/components/research/research-skeleton';
import { Badge } from '@/components/ui/badge';
import { LEVENSHTEIN_THRESHOLD } from '@/lib/utils/research-levenshtein';
import {
	RESEARCH_METHODS,
	type DatasetSize,
	type FuzzyMatch,
	type ResearchMethod,
} from '@/types/research';
import { PackageSearchIcon } from 'lucide-react';

type ResearchResultsProps = {
	results: FuzzyMatch[];
	query: string;
	method: ResearchMethod;
	size: DatasetSize;
	isSearching: boolean;
	isError: boolean;
};

export function ResearchResults({
	results,
	query,
	method,
	size,
	isSearching,
	isError,
}: ResearchResultsProps) {
	if (isSearching) {
		return <ResearchSkeleton count={8} />;
	}

	if (isError) {
		return (
			<EmptyState
				icon={PackageSearchIcon}
				title="Gagal memuat data"
				description="Terjadi kesalahan saat mengambil atau memproses data. Silakan coba lagi."
			/>
		);
	}

	const methodLabel =
		RESEARCH_METHODS.find((option) => option.value === method)?.label ??
		method;

	return (
		<section data-testid="research-results" className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-body-sm text-muted-foreground">
						{results.length} hasil untuk{' '}
						<span className="font-semibold text-foreground">
							&quot;{query}&quot;
						</span>
					</p>
					<Badge variant="outline" className="text-caption">
						{methodLabel}
					</Badge>
					<Badge variant="outline" className="text-caption">
						{size} data
					</Badge>
				</div>
			</div>

			{results.length === 0 ? (
				<EmptyState
					icon={PackageSearchIcon}
					title="Produk tidak ditemukan"
					description={`Tidak ada produk yang cocok dengan kata kunci pada threshold k=${LEVENSHTEIN_THRESHOLD}.`}
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
					{results.map((match, index) => (
						<ProductCard
							key={match.product.id}
							product={match.product}
							eager={index === 0}
						/>
					))}
				</div>
			)}
		</section>
	);
}