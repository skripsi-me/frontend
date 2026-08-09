export interface ApiMetadata {
	code: number;
	message: string;
}

export interface ApiResponse<T> {
	metadata: ApiMetadata;
	data: T;
}

export interface ApiErrorResponse {
	metadata: ApiMetadata;
	error?: Record<string, string>;
}

export interface Paginated<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		total_pages: number;
	};
}

export interface ApiError {
	status: number;
	message: string;
	fieldErrors?: Record<string, string>;
}
