import type { Product } from '@/types/product';

export type ResearchMethod = 'web-worker' | 'non-web-worker';

export type DatasetSize = 500 | 1000 | 2000;

export const RESEARCH_METHODS: { value: ResearchMethod; label: string }[] = [
	{ value: 'web-worker', label: 'Web Worker' },
	{ value: 'non-web-worker', label: 'Non Web Worker' },
];

export const RESEARCH_SIZES: DatasetSize[] = [500, 1000, 2000];

export const RESEARCH_MIN_QUERY_LENGTH = 3;
export const RESEARCH_MAX_QUERY_LENGTH = 20;

export type FuzzyMatch = {
	product: Product;
	/** Rata-rata jarak Levenshtein seluruh pasangan (query-token × product-token). */
	distance: number;
};

export type FpsSample = {
	/** Indeks detik sejak pencarian dimulai. */
	sample: number;
	/** Jumlah frame yang di-render pada detik tersebut. */
	fps: number;
};

export type LongTaskEntry = {
	start: number;
	duration: number;
};

export type SearchSessionMetrics = {
	sessionId: string;
	method: ResearchMethod;
	query: string;
	queryLength: number;
	size: DatasetSize;
	timestamp: string;
	metrics: {
		executionTimeMs: number;
		tbtMs: number;
		fps: FpsSample[];
		fpsAverage: number;
		longTasks: LongTaskEntry[];
		resultCount: number;
		datasetLength: number;
	};
};

export type WorkerRequest =
	| { type: 'init'; dataset: Product[]; seq: number }
	| { type: 'search'; query: string; seq: number };

export type WorkerResponse =
	| { type: 'ready'; seq: number }
	| { type: 'results'; results: FuzzyMatch[]; seq: number };