'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
	RESEARCH_MAX_QUERY_LENGTH,
	RESEARCH_MIN_QUERY_LENGTH,
	RESEARCH_METHODS,
	RESEARCH_SIZES,
	type DatasetSize,
	type ResearchMethod,
} from '@/types/research';
import { type FormEvent, type RefObject } from 'react';

type ResearchSearchBarProps = {
	value: string;
	onValueChange: (value: string) => void;
	method: ResearchMethod;
	onMethodChange: (method: ResearchMethod) => void;
	size: DatasetSize;
	onSizeChange: (size: DatasetSize) => void;
	onSubmit: () => void;
	isSearching: boolean;
	inputRef?: RefObject<HTMLInputElement | null>;
};

export function ResearchSearchBar({
	value,
	onValueChange,
	method,
	onMethodChange,
	size,
	onSizeChange,
	onSubmit,
	isSearching,
	inputRef,
}: ResearchSearchBarProps) {
	const trimmed = value.trim();
	const invalidLength =
		trimmed.length < RESEARCH_MIN_QUERY_LENGTH ||
		trimmed.length > RESEARCH_MAX_QUERY_LENGTH;
	const disabled = isSearching || invalidLength;

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (disabled) return;
		onSubmit();
	}

	return (
		<form
			onSubmit={handleSubmit}
			data-testid="research-search-bar"
			className="flex flex-col gap-4"
		>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end">
				<div className="flex-1">
					<label
						htmlFor="research-keyword"
						className="mb-1.5 block text-label-sm text-foreground"
					>
						Kata Kunci
					</label>
					<Input
						id="research-keyword"
						ref={inputRef}
						data-testid="research-keyword-input"
						value={value}
						onChange={(e) => onValueChange(e.target.value)}
						placeholder="Cari produk (3-20 karakter)"
						minLength={3}
						maxLength={RESEARCH_MAX_QUERY_LENGTH}
						autoComplete="off"
					/>
					{trimmed.length > 0 && invalidLength && (
						<p
							data-testid="research-query-hint"
							className="mt-1 text-caption text-destructive"
						>
							Kata kunci harus 3-20 karakter.
						</p>
					)}
				</div>
				<Button
					type="submit"
					size="lg"
					data-testid="research-submit"
					disabled={disabled}
				>
					Cari
				</Button>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
				<SegmentedControl
					value={method}
					onChange={onMethodChange}
					options={RESEARCH_METHODS}
					aria-label="Metode pencarian"
					testid={(option) => `method-${option}`}
				/>

				<SegmentedControl
					value={size}
					onChange={onSizeChange}
					options={RESEARCH_SIZES.map((option) => ({
						value: option,
						label: String(option),
					}))}
					aria-label="Ukuran data"
					testid={(option) => `size-${option}`}
				/>
			</div>
		</form>
	);
}