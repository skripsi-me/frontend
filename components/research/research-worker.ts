import { searchProductsFuzzyResearch } from '@/lib/utils/research-levenshtein';
import type { Product } from '@/types/product';
import type { WorkerRequest, WorkerResponse } from '@/types/research';

const ctx = self as unknown as {
	onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
	postMessage: (message: WorkerResponse) => void;
};

let dataset: Product[] = [];

ctx.onmessage = (event: MessageEvent<WorkerRequest>) => {
	const message = event.data;

	if (message.type === 'init') {
		dataset = message.dataset;
		const response: WorkerResponse = { type: 'ready', seq: message.seq };
		ctx.postMessage(response);
		return;
	}

	if (message.type === 'search') {
		const results = searchProductsFuzzyResearch(dataset, message.query);
		const response: WorkerResponse = {
			type: 'results',
			results,
			seq: message.seq,
		};
		ctx.postMessage(response);
	}
};