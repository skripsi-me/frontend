/**
 * @description Format a numeric value to Indonesian Rupiah (IDR) currency format.
 * @param {number} price The numeric value to format.
 * @return {string} Formatted IDR currency string (e.g. Rp 15.000).
 * @example
 * // Usage:
 * formatIDR(15000) // "Rp 15.000"
 */
export function formatIDR(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}
