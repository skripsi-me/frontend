import { LayoutDashboard, Package, ReceiptText, Tags, Users } from 'lucide-react';
import { NavLinkAdmin, NavLinkUser } from '@/types/nav';

export const USER_NAV_LINKS: NavLinkUser[] = [
	{ href: '/', label: 'Beranda' },
	{ href: '/produk', label: 'Produk' },
];

export const PROFILE_NAV_LINKS: NavLinkUser[] = [
	{ href: '/profil', label: 'Profil Saya' },
	{ href: '/profil/riwayat-transaksi', label: 'Riwayat Transaksi' },
	{ href: '/auth/ubah-password', label: 'Ubah Password' },
];

export const DASHBOARD_NAV_LINKS: NavLinkAdmin[] = [
	{ href: '/dashboard', label: 'Ikhtisar', icon: LayoutDashboard },
	{ href: '/dashboard/produk', label: 'Produk', icon: Package },
	{ href: '/dashboard/kategori', label: 'Kategori', icon: Tags },
	{ href: '/dashboard/pesanan', label: 'Pesanan', icon: ReceiptText },
	{ href: '/dashboard/pengguna', label: 'Pengguna', icon: Users },
];
