import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';

export function QueryError({
	title,
	message,
	onRetry,
	size = 'sm',
}: {
	title: string;
	message: string;
	onRetry: () => void;
	size?: 'sm' | 'lg';
}) {
	return (
		<Alert variant="destructive" className="mx-auto max-w-2xl">
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
			<div className="pt-2">
				<Button variant="outline" size={size} onClick={onRetry}>
					<RefreshCcwIcon />
					Coba lagi
				</Button>
			</div>
		</Alert>
	);
}