import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { isApiError } from '@/lib/api';
import { RefreshCcwIcon } from 'lucide-react';

export function SectionError({
	title,
	error,
	onRetry,
}: {
	title: string;
	error: Error | null;
	onRetry: () => void;
}) {
	return (
		<Alert variant="destructive" className="p-4">
			<AlertTitle className="text-sm">{title}</AlertTitle>
			<AlertDescription className="text-sm">
				{isApiError(error) ? error.message : 'Terjadi kesalahan.'}
			</AlertDescription>
			<div className="pt-2">
				<Button variant="outline" size="sm" onClick={onRetry}>
					<RefreshCcwIcon />
					Coba lagi
				</Button>
			</div>
		</Alert>
	);
}