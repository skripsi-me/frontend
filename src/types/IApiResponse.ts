/**
 * @description Standardized API response structure from the backend server.
 * @template T The type of the payload data returned.
 */
export interface IApiResponse<T> {
  metadata: {
    code: number;
    message: string;
  };
  data: T | null;
  error?: {
    [key: string]: string;
  };
}
