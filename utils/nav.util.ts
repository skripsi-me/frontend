export function isActiveNav({
	href,
	pathname,
}: {
	href: string;
	pathname: string;
}) {
	return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
