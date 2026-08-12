export function getErrorMessage(field: {
	state: { meta: { errors: unknown[] } };
}): string | undefined {
	const error = field.state.meta.errors[0];
	if (typeof error === 'string') return error;
	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	) {
		return (error as { message: string }).message;
	}
	return undefined;
}
