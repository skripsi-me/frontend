'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PackageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProductImageProps = {
	src: string;
	alt: string;
	priority?: boolean;
	eager?: boolean;
	sizes?: string;
	className?: string;
	iconClassName?: string;
};

export function ProductImage({
	src,
	alt,
	priority = false,
	eager = false,
	sizes,
	className,
	iconClassName,
}: ProductImageProps) {
	const [failed, setFailed] = useState(false);

	if (failed) {
		return (
			<div
				className={cn(
					'flex items-center justify-center bg-muted text-muted-foreground',
					className,
				)}
			>
				<PackageIcon className={cn('size-10', iconClassName)} />
			</div>
		);
	}

	return (
		<Image
			src={src}
			alt={alt}
			fill
			priority={priority}
			loading={eager && !priority ? 'eager' : undefined}
			onError={() => setFailed(true)}
			sizes={sizes}
			className={cn('object-cover', className)}
		/>
	);
}
