export function normalize(value: string): string {
	return value.toLowerCase().trim();
}

export function tokenize(value: string): string[] {
	return normalize(value)
		.split(/[^a-z0-9]+/)
		.filter(Boolean);
}