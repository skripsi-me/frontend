/**
 * @description Menghitung jarak Levenshtein antara dua string.
 * Jarak Levenshtein adalah jumlah minimum operasi satu karakter (penyisipan, penghapusan, atau penggantian) yang diperlukan untuk mengubah satu string menjadi string lainnya.
 * @param {string} a String pertama.
 * @param {string} b String kedua.
 * @return {number} Jarak Levenshtein antara string a dan string b.
 * @example
 * // Contoh penggunaan:
 * getLevenshteinDistance("beras", "beraz") // 1
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const tmpA = a.toLowerCase()
  const tmpB = b.toLowerCase()
  const matrix: number[][] = []

  for (let i = 0; i <= tmpB.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= tmpA.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= tmpB.length; i++) {
    for (let j = 1; j <= tmpA.length; j++) {
      if (tmpB.charAt(i - 1) === tmpA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        )
      }
    }
  }

  return matrix[tmpB.length][tmpA.length]
}

/**
 * @description Memeriksa apakah kata kunci query cocok dengan nama produk menggunakan toleransi Levenshtein distance.
 * Biasanya toleransi didasarkan pada panjang kata kunci (misal, 1 atau 2 karakter salah).
 * @param {string} query Kata kunci pencarian.
 * @param {string} target Teks target (misal nama produk).
 * @param {number} tolerance Toleransi jarak Levenshtein maksimum (default: 2).
 * @return {boolean} True jika ada kata dalam target yang cocok dengan query dalam toleransi.
 * @example
 * // Contoh penggunaan:
 * isLevenshteinMatch("beraz", "Beras Cianjur", 1) // true
 */
export function isLevenshteinMatch(query: string, target: string, tolerance: number = 2): boolean {
  const cleanQuery = query.trim().toLowerCase()
  const cleanTarget = target.trim().toLowerCase()

  if (!cleanQuery) return true
  if (cleanTarget.includes(cleanQuery)) return true

  const queryWords = cleanQuery.split(/\s+/)
  const targetWords = cleanTarget.split(/\s+/)

  // Periksa apakah setiap kata dalam query memiliki pasangan kata di target dengan jarak <= tolerance
  return queryWords.every((qWord) => {
    if (qWord.length <= 2) {
      // Untuk kata sangat pendek, harus sama persis
      return targetWords.some((tWord) => tWord.includes(qWord))
    }
    // Cari tWord yang memiliki jarak Levenshtein <= tolerance dengan qWord
    // Atau tWord mengandung qWord, atau sebaliknya
    return targetWords.some((tWord) => {
      if (tWord.includes(qWord) || qWord.includes(tWord)) return true
      const dist = getLevenshteinDistance(qWord, tWord)
      return dist <= tolerance
    })
  })
}
