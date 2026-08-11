import { NavLinkUser } from '@/types/nav';

export const USER_NAV_LINKS: NavLinkUser[] = [
	{ href: '/', label: 'Beranda' },
	{ href: '/produk', label: 'Produk' },
];

export const PROFILE_NAV_LINKS: NavLinkUser[] = [
	{ href: '/profil', label: 'Profil Saya' },
	{ href: '/profil/riwayat-transaksi', label: 'Riwayat Transaksi' },
	{ href: '/auth/ubah-password', label: 'Ubah Password' },
];
