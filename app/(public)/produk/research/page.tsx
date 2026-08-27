'use client';

import { ResearchMetricsPanel } from '@/components/research/research-metrics-panel';
import { ResearchResults } from '@/components/research/research-results';
import { ResearchSearchBar } from '@/components/research/research-search-bar';
import { useResearchSearch } from '@/hooks/research.hook';
import { SectionHeader } from '@/components/section-header';
import {
	RESEARCH_MAX_QUERY_LENGTH,
	RESEARCH_MIN_QUERY_LENGTH,
	RESEARCH_METHODS,
	RESEARCH_SIZES,
	type DatasetSize,
	type ResearchMethod,
} from '@/types/research';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';

function ResearchPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialMethod: ResearchMethod = RESEARCH_METHODS.some(
		(m) => m.value === searchParams.get('method'),
	)
		? (searchParams.get('method') as ResearchMethod)
		: 'non-web-worker';
	const initialSize: DatasetSize = RESEARCH_SIZES.some(
		(s) => String(s) === searchParams.get('size'),
	)
		? (Number(searchParams.get('size')) as DatasetSize)
		: 1000;
	const initialQuery = searchParams.get('search') ?? '';

	const [method, setMethod] = useState<ResearchMethod>(initialMethod);
	const [size, setSize] = useState<DatasetSize>(initialSize);
	const [query, setQuery] = useState(initialQuery);

	const inputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<HTMLSpanElement>(null);
	const fpsRef = useRef<HTMLSpanElement>(null);

	const {
		execute,
		isSearching,
		isError,
		results,
		query: executedQuery,
		session,
	} = useResearchSearch({ timerRef, fpsRef });

	function handleSubmit() {
		const trimmed = query.trim();
		if (
			trimmed.length < RESEARCH_MIN_QUERY_LENGTH ||
			trimmed.length > RESEARCH_MAX_QUERY_LENGTH
		) {
			return;
		}
		const params = new URLSearchParams({
			method,
			search: trimmed,
			size: String(size),
		});
		router.replace(`/produk/research?${params.toString()}`);
		void execute({ method, size, query: trimmed });
	}

	return (
		<main className="flex flex-1 flex-col">
			<section className="border-b border-border bg-surface-muted">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
					<SectionHeader
						label="Instrumen penelitian"
						title="Penelitian Pencarian Fuzzy"
						description="Mengukur performa pencarian Levenshtein Distance (k=2): Main Thread vs Web Worker."
					/>
					<ResearchSearchBar
						value={query}
						onValueChange={setQuery}
						method={method}
						onMethodChange={setMethod}
						size={size}
						onSizeChange={setSize}
						onSubmit={handleSubmit}
						isSearching={isSearching}
						inputRef={inputRef}
					/>

					{/* Target interaksi trusted untuk pengukuran INP (klik Puppeteer).
							No-op handler: syarat Chrome emit PerformanceEventTiming. */}
					<button
						type="button"
						data-testid="research-inp-target"
						aria-label="Target pengukuran INP"
						onClick={() => {}}
						className="rounded-lg border border-border px-3 py-1.5 text-caption text-muted-foreground"
					>
						INP Target
					</button>
					<ResearchMetricsPanel
						session={session}
						isSearching={isSearching}
						timerRef={timerRef}
						fpsRef={fpsRef}
					/>
				</div>
			</section>

			<section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
				<ResearchResults
					results={results}
					query={executedQuery}
					method={method}
					size={size}
					isSearching={isSearching}
					isError={isError}
				/>
			</section>
		</main>
	);
}

export default function ResearchPage() {
	return (
		<Suspense>
			<ResearchPageContent />
		</Suspense>
	);
}