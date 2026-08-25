import { RadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { cn } from '@/lib/utils';

type SegmentedOption<T> = { value: T; label: string };

export function SegmentedControl<T extends React.Key>({
	value,
	onChange,
	options,
	'aria-label': ariaLabel,
	testid,
}: {
	value: T;
	onChange: (value: T) => void;
	options: SegmentedOption<T>[];
	'aria-label': string;
	testid?: (value: T) => string;
}) {
	return (
		<RadioGroup
			value={value}
			onValueChange={(next) => onChange(next as T)}
			aria-label={ariaLabel}
			className="flex items-center gap-1 rounded-xl bg-muted p-1"
		>
			{options.map((option) => (
				<Radio.Root
					key={option.value}
					value={option.value}
					data-testid={testid?.(option.value)}
					className={(state) =>
						cn(
							'inline-flex items-center justify-center rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
							state.checked
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-on-surface-muted hover:bg-background',
						)
					}
				>
					{option.label}
				</Radio.Root>
			))}
		</RadioGroup>
	);
}