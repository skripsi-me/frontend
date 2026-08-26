import { normalize, tokenize } from '@/lib/utils/text';
import type { FuzzyMatch } from '@/types/research';
import type { Product } from '@/types/product';

/**
 * Levenshtein distance (edit distance) — implementasi referensi DP O(n·m)
 * dua baris (rolling array), tanpa library bit-parallel.
 * Hasil identik dengan `fastest-levenshtein`.
 */
export function levenshteinDistance(a: string, b: string): number {
	if (a === b) return 0;
	const n = a.length;
	const m = b.length;
	if (n === 0) return m;
	if (m === 0) return n;

	let prev = new Array<number>(m + 1);
	let curr = new Array<number>(m + 1);
	for (let j = 0; j <= m; j++) prev[j] = j;

	for (let i = 1; i <= n; i++) {
		curr[0] = i;
		for (let j = 1; j <= m; j++) {
			const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
			curr[j] = Math.min(
				prev[j] + 1,
				curr[j - 1] + 1,
				prev[j - 1] + cost,
			);
		}
		[prev, curr] = [curr, prev];
	}

	return prev[m];
}

function thresholdFor(token: string): number {
	const len = token.length;
	if (len <= 3) return 1;
	if (len <= 6) return 2;
	return 3;
}

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
				const dist = levenshteinDistance(word, token);
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
