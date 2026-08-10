import { distance } from 'fastest-levenshtein';
import type { Product } from '@/types/product';

function normalize(value: string): string {
	return value.toLowerCase().trim();
}

function thresholdFor(token: string): number {
	const len = token.length;
	if (len <= 3) return 1;
	if (len <= 6) return 2;
	return 3;
}

function tokenize(value: string): string[] {
	return normalize(value)
		.split(/[^a-z0-9]+/)
		.filter(Boolean);
}

export type FuzzyMatch = {
	product: Product;
	distance: number;
};

export function searchProductsFuzzy(
	products: Product[],
	keyword: string,
): FuzzyMatch[] {
	const keywords = tokenize(keyword);
	if (keywords.length === 0) return [];

	const results: FuzzyMatch[] = [];

	for (const product of products) {
		const nameTokens = tokenize(product.name);
		const name = normalize(product.name);

		let best = Infinity;
		for (const word of keywords) {
			if (name.includes(word)) {
				best = 0;
				break;
			}
			const threshold = thresholdFor(word);
			for (const token of nameTokens) {
				const dist = distance(word, token);
				if (dist < best) best = dist;
			}
			if (best > threshold) break;
		}

		if (best <= thresholdFor(keywords[0])) {
			results.push({ product, distance: best });
		}
	}

	return results.sort((a, b) => a.distance - b.distance);
}
