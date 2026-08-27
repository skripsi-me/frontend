'use client';

import type { SearchSessionMetrics } from '@/types/research';
import type { ReactNode, RefObject } from 'react';

function Metric({
	label,
	metricKey,
	children,
}: {
	label: string;
	metricKey: string;
	children?: ReactNode;
}) {
	return (
		<div
			data-testid={`metric-${metricKey}`}
			className="rounded-xl border border-border bg-surface p-3"
		>
			<p className="text-caption text-muted-foreground">{label}</p>
			<p
				data-metric={metricKey}
				className="mt-1 font-mono text-md font-semibold text-foreground"
			>
				{children ?? '—'}
			</p>
		</div>
	);
}

type ResearchMetricsPanelProps = {
	session: SearchSessionMetrics | null;
	isSearching: boolean;
	timerRef?: RefObject<HTMLSpanElement | null>;
	fpsRef?: RefObject<HTMLSpanElement | null>;
};

/**
 * Panel metrik penelitian.
 *
 * Elemen `data-metric="execution-time|tbt|fps"` hanya berisi NILAI FINAL
 * (setelah sesi selesai) — aman dibaca Puppeteer.
 * Timer & FPS live (loop rAF) ditulis ke elemen terpisah
 * `data-metric="live-timer"` / `data-metric="live-fps"`, hanya selama pencarian.
 */
export function ResearchMetricsPanel({
	session,
	isSearching,
	timerRef,
	fpsRef,
}: ResearchMetricsPanelProps) {
	const m = session?.metrics;
	const execution = m ? `${m.executionTimeMs.toFixed(2)} ms` : undefined;
	const tbt = m ? `${m.tbtMs.toFixed(2)} ms` : undefined;
	const fps = m ? `${m.fpsAverage.toFixed(1)} fps` : undefined;
	const datasetLength = m ? String(m.datasetLength) : undefined;

	return (
		<div
			data-testid="metrics-panel"
			className="flex flex-col gap-3"
		>
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<Metric label="Execution Time" metricKey="execution-time">
					{execution}
				</Metric>
				<Metric label="TBT" metricKey="tbt">
					{tbt}
				</Metric>
				<Metric label="FPS (rata-rata)" metricKey="fps">
					{fps}
				</Metric>
				<Metric label="Ukuran dataset" metricKey="dataset-length">
					{datasetLength}
				</Metric>
			</div>

			{isSearching && (
				<div
					data-testid="metrics-live"
					className="flex flex-wrap items-center gap-x-6 gap-y-1 text-caption text-muted-foreground"
				>
					<span>
						Timer:{' '}
						<span
							ref={timerRef}
							data-metric="live-timer"
							className="font-mono text-foreground"
						>
							0 ms
						</span>
					</span>
					<span>
						FPS:{' '}
						<span
							ref={fpsRef}
							data-metric="live-fps"
							className="font-mono text-foreground"
						>
							0
						</span>
					</span>
					<span data-testid="metrics-searching">
						Mengukur…
					</span>
				</div>
			)}
		</div>
	);
}