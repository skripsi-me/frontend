'use client';

import { productService } from '@/services/product.service';
import { searchProductsFuzzyResearch } from '@/lib/utils/research-levenshtein';
import {
	RESEARCH_MAX_QUERY_LENGTH,
	RESEARCH_MIN_QUERY_LENGTH,
	type DatasetSize,
	type FpsSample,
	type FuzzyMatch,
	type ResearchMethod,
	type SearchSessionMetrics,
	type WorkerRequest,
	type WorkerResponse,
} from '@/types/research';
import type { Product } from '@/types/product';
import { useCallback, useRef, useState, type RefObject } from 'react';

/**
 * Cache dataset in-memory, key `${query}-${method}-${size}`.
 * Per spek penelitian: dataset di-fetch sekali per kombinasi dan tidak
 * bergantung pada cache browser (HTTP cache).
 */
const datasetCache = new Map<string, Product[]>();

/** Max limit per halaman yang diterima API produk. */
const DATASET_PAGE_LIMIT = 1000;

/**
 * Fetch dataset hingga ukuran nominal. Backend menolak limit > 1000
 * (HTTP 400), sehingga ukuran 2000 diambil dua halaman (limit 1000).
 * Berhenti lebih awal bila data di server lebih sedikit dari nominal.
 */
async function fetchDataset(size: DatasetSize): Promise<Product[]> {
	const collected: Product[] = [];
	let page = 1;
	while (collected.length < size) {
		const response = await productService.list({
			page,
			limit: Math.min(size, DATASET_PAGE_LIMIT),
		});
		const items = response.data ?? [];
		if (items.length === 0) break;
		collected.push(...items);
		page += 1;
	}
	return collected.slice(0, size);
}

/**
 * Singleton Web Worker — dibuat sekali, dipakai ulang seluruh sesi pengujian.
 * Dataset di-preload ke worker sekali per ukuran via `init`.
 */
let worker: Worker | null = null;
let workerDatasetSize: DatasetSize | null = null;
let workerSeq = 0;

function getWorker(): Worker {
	if (!worker) {
		worker = new Worker(
			new URL('../components/research/research-worker.ts', import.meta.url),
			{ type: 'module' },
		);
	}
	return worker;
}

function postToWorker(
	w: Worker,
	message: WorkerRequest,
): Promise<WorkerResponse> {
	return new Promise((resolve, reject) => {
		const onMessage = (event: MessageEvent<WorkerResponse>) => {
			if (event.data.seq !== message.seq) return;
			w.removeEventListener('message', onMessage);
			w.removeEventListener('error', onError);
			resolve(event.data);
		};
		const onError = (event: ErrorEvent) => {
			w.removeEventListener('message', onMessage);
			w.removeEventListener('error', onError);
			reject(new Error(event.message || 'Web Worker error'));
		};
		w.addEventListener('message', onMessage);
		w.addEventListener('error', onError);
		w.postMessage(message);
	});
}

async function searchInWorker(
	products: Product[],
	query: string,
	size: DatasetSize,
): Promise<FuzzyMatch[]> {
	const w = getWorker();
	if (workerDatasetSize !== size) {
		await postToWorker(w, {
			type: 'init',
			dataset: products,
			seq: ++workerSeq,
		});
		workerDatasetSize = size;
	}
	const response = await postToWorker(w, {
		type: 'search',
		query,
		seq: ++workerSeq,
	});
	return response.type === 'results' ? response.results : [];
}

type UseResearchSearchOptions = {
	/** Span untuk timer UI berjalan (diupdate rAF, tanpa re-render React). */
	timerRef?: RefObject<HTMLSpanElement | null>;
	/** Span untuk FPS live (diupdate rAF, tanpa re-render React). */
	fpsRef?: RefObject<HTMLSpanElement | null>;
};

type ExecuteOptions = {
	method: ResearchMethod;
	size: DatasetSize;
	query: string;
};

export function useResearchSearch({ timerRef, fpsRef }: UseResearchSearchOptions) {
	const [isSearching, setIsSearching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [results, setResults] = useState<FuzzyMatch[]>([]);
	const [query, setQuery] = useState('');
	const [session, setSession] = useState<SearchSessionMetrics | null>(null);
	const runningRef = useRef(false);

	const execute = useCallback(
		async ({ method, size, query: keyword }: ExecuteOptions) => {
			const trimmed = keyword.trim();
			if (
				trimmed.length < RESEARCH_MIN_QUERY_LENGTH ||
				trimmed.length > RESEARCH_MAX_QUERY_LENGTH
			) {
				return;
			}
			if (runningRef.current) return;
			runningRef.current = true;

			setQuery(trimmed);
			setSession(null);
			setError(null);
			setIsError(false);
			setIsSearching(true);

			const t0 = performance.now();
			const longTasks: { start: number; duration: number }[] = [];
			const fpsSamples: FpsSample[] = [];
			let totalFrames = 0;
			let frameCount = 0;
			let sampleIndex = 0;
			let secondStart = t0;
			let rafId = 0;

			/** TBT — long task (>50ms) yang mulai pada window pencarian. */
			let longTaskObserver: PerformanceObserver | null = null;
			try {
				longTaskObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						longTasks.push({
							start: entry.startTime,
							duration: entry.duration,
						});
					}
				});
				longTaskObserver.observe({ type: 'longtask', buffered: true });
			} catch {
				longTaskObserver = null;
			}

			/** FPS — loop rAF; sekaligus timer UI berjalan. */
			const frameLoop = (now: number) => {
				frameCount += 1;
				totalFrames += 1;
				if (timerRef?.current) {
					timerRef.current.textContent = `${Math.round(now - t0)} ms`;
				}
				if (now - secondStart >= 1000) {
					fpsSamples.push({ sample: sampleIndex++, fps: frameCount });
					if (fpsRef?.current) {
						fpsRef.current.textContent = String(frameCount);
					}
					frameCount = 0;
					secondStart = now;
				}
				rafId = requestAnimationFrame(frameLoop);
			};
			rafId = requestAnimationFrame(frameLoop);

			const teardown = () => {
				runningRef.current = false;
				cancelAnimationFrame(rafId);
				longTaskObserver?.disconnect();
			};

			try {
				const cacheKey = `${trimmed}-${method}-${size}`;
				let products = datasetCache.get(cacheKey);
				if (!products) {
					products = await fetchDataset(size);
					datasetCache.set(cacheKey, products);
				}

				const matches =
					method === 'web-worker'
						? await searchInWorker(products, trimmed, size)
						: searchProductsFuzzyResearch(products, trimmed);

				const datasetLength = products.length;

				setResults(matches);
				setIsSearching(false);

				/** Finalisasi setelah frame ter-paint (double rAF). */
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const t1 = performance.now();
						teardown();

						const elapsedSec = Math.max(
							(t1 - t0) / 1000,
							0.001,
						);
						const fpsAverage = totalFrames / elapsedSec;
						const tbtMs = longTasks
							.filter((task) => task.start >= t0 && task.start <= t1)
							.reduce(
								(sum, task) =>
									sum + Math.max(0, task.duration - 50),
								0,
							);

						const sessionMetrics: SearchSessionMetrics = {
							sessionId: crypto.randomUUID(),
							method,
							query: trimmed,
							queryLength: trimmed.length,
							size,
							timestamp: new Date().toISOString(),
							metrics: {
								executionTimeMs: t1 - t0,
								tbtMs,
								fps: fpsSamples,
								fpsAverage,
								longTasks,
								resultCount: matches.length,
								datasetLength,
							},
						};
						setSession(sessionMetrics);
						// Ekspos ke window utk dibaca Puppeteer (prasyarat automasi).
						(
							window as typeof window & {
								__lastResearchSession: SearchSessionMetrics;
							}
						).__lastResearchSession = sessionMetrics;
						window.dispatchEvent(
							new CustomEvent('research:session', {
								detail: sessionMetrics,
							}),
						);
					});
				});
			} catch (err) {
				teardown();
				setIsSearching(false);
				setIsError(true);
				setError(err instanceof Error ? err : new Error(String(err)));
			}
		},
		[timerRef, fpsRef],
	);

	return { execute, isSearching, isError, error, results, query, session };
}