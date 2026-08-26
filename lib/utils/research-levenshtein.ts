import { levenshteinDistance } from '@/lib/utils/levenshtein';
import { tokenize } from '@/lib/utils/text';
import {
	RESEARCH_MAX_QUERY_LENGTH,
	RESEARCH_MIN_QUERY_LENGTH,
	type FuzzyMatch,
} from '@/types/research';
import type { Product } from '@/types/product';

/**
 * Threshold jarak maksimum (k) untuk kondisi match.
 * Konstanta, berlaku untuk semua token tanpa memandang panjang token.
 */
export const LEVENSHTEIN_THRESHOLD = 2;

/**
 * Fuzzy search Levenshtein — varian penelitian.
 *
 * Aturan:
 * - query valid hanya jika panjang 3–20 karakter (guard di dalam fungsi).
 * - komputasi exhaustive: seluruh pasangan (query-token × product-token) dihitung.
 * - match any-word-matches: produk match jika minimal satu query-token memiliki
 *   best-match (jarak minimum antar product-token, tanpa urutan) ≤ k=2.
 * - ranking: rata-rata jarak seluruh pasangan, ascending.
 */
export function searchProductsFuzzyResearch(
	products: Product[],
	keyword: string,
): FuzzyMatch[] {
	const query = keyword.trim();
	if (
		query.length < RESEARCH_MIN_QUERY_LENGTH ||
		query.length > RESEARCH_MAX_QUERY_LENGTH
	) {
		return [];
	}

	const queryTokens = tokenize(query);
	if (queryTokens.length === 0) return [];

	const results: FuzzyMatch[] = [];

	for (const product of products) {
		const nameTokens = tokenize(product.name);
		if (nameTokens.length === 0) continue;

		let matched = false;
		let totalDistance = 0;
		let pairCount = 0;

		for (const queryToken of queryTokens) {
			let best = Infinity;
			for (const nameToken of nameTokens) {
				const dist = levenshteinDistance(queryToken, nameToken);
				totalDistance += dist;
				pairCount += 1;
				if (dist < best) best = dist;
			}
			if (best <= LEVENSHTEIN_THRESHOLD) matched = true;
		}

		if (matched && pairCount > 0) {
			results.push({
				product,
				distance: totalDistance / pairCount,
			});
		}
	}

	return results.sort((a, b) => a.distance - b.distance);
}