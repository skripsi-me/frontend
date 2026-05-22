const fs = require('fs');
const path = require('path');

// ANSI Color codes for clean reporting
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let errorCount = 0;
let warningCount = 0;
let successCount = 0;

// Traverses directory recursively
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFiles(name, fileList);
      }
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}

// Rules runner
function validateFile(filePath) {
  // Skip auto-generated files (e.g. Tanstack Router route tree)
  if (filePath.endsWith('.gen.ts') || filePath.endsWith('.gen.tsx')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  const ext = path.extname(filePath);

  const errors = [];
  const warnings = [];

  // --- Rule 1: Naming Convention for Files in src/types ---
  if (filePath.includes(path.join('src', 'types')) && ext === '.ts') {
    const filename = path.basename(filePath);
    if (filename !== '.gitkeep' && !filename.startsWith('I')) {
      errors.push(`Aturan File: Nama berkas tipe data "${filename}" harus diawali dengan huruf besar "I" (Contoh: IUser.ts).`);
    }
  }

  if (ext === '.tsx' || ext === '.ts') {
    // --- Rule 2: Naming Convention for Interface/Type Declarations ---
    // Matches: interface SomeName or type SomeName =
    const interfaceRegex = /interface\s+([A-Za-z0-9_]+)/g;
    let match;
    while ((match = interfaceRegex.exec(content)) !== null) {
      const name = match[1];
      if (!name.startsWith('I') && name !== 'Register') {
        errors.push(`Aturan Kode (Baris ~${getLineNumber(content, match.index)}): Nama interface "${name}" harus menggunakan prefix "I" (Contoh: ISomeInterface).`);
      }
    }

    // --- Rule 3: SEO - Image Alt Tags ---
    // Finds <img tags. Checks if they do not contain the 'alt' attribute
    const imgRegex = /<img\s+([^>]*)/gi;
    while ((match = imgRegex.exec(content)) !== null) {
      const attributes = match[1];
      if (!/\balt\s*=/i.test(attributes)) {
        errors.push(`SEO & A11y (Baris ~${getLineNumber(content, match.index)}): Tag <img> tidak memiliki atribut "alt". Ini wajib untuk aksesibilitas dan SEO.`);
      }
    }

    // --- Rule 4: SEO - Multiple H1 Tags ---
    const h1Regex = /<h1\s*[^>]*>/gi;
    const h1Matches = content.match(h1Regex);
    if (h1Matches && h1Matches.length > 1 && relativePath.includes('src/pages')) {
      errors.push(`SEO: Ditemukan ${h1Matches.length} tag <h1> pada halaman ini. Hanya diperbolehkan satu tag <h1> per halaman.`);
    }

    // --- Rule 5: A11y - Icon Button Aria-Label ---
    // Finds interactive elements <button> or <a href> that contain Lucide icons but no plain text
    // A simple regex approach to find buttons
    const btnRegex = /<(button|Link|a)\s+([^>]*?)>([\s\S]*?)<\/\1>/gi;
    while ((match = btnRegex.exec(content)) !== null) {
      const tag = match[1];
      const attributes = match[2];
      const innerContent = match[3];

      // Check if it contains an icon component (typically starts with uppercase and contains Icon/Search/Shopping/User etc.)
      const containsIcon = /[A-Z][A-Za-z0-9]*(Icon|Search|Shopping|User|Map|Chevron|Star|Heart)/.test(innerContent);
      // Check if it contains raw text or variables
      const hasText = innerContent.replace(/<[^>]*>/g, '').trim().length > 0;
      
      // If it contains an icon and NO text, it must have an aria-label or aria-labelledby
      if (containsIcon && !hasText) {
        if (!/aria-label\s*=/i.test(attributes) && !/aria-labelledby\s*=/i.test(attributes)) {
          errors.push(`Aksesi (Baris ~${getLineNumber(content, match.index)}): Tombol/Link "<${tag}>" yang hanya memiliki icon tanpa teks wajib memiliki atribut "aria-label".`);
        }
      }
    }

    // --- Rule 6: A11y - onClick on Non-Semantic Elements ---
    // Finds elements like div, span, p with onClick but missing role="button" or tabIndex
    const nonSemanticClickRegex = /<(div|span|p|section)\s+([^>]*?onClick\s*=[^>]*?)>/gi;
    while ((match = nonSemanticClickRegex.exec(content)) !== null) {
      const tag = match[1];
      const attributes = match[2];
      
      if (!/role\s*=\s*["']button["']/i.test(attributes)) {
        errors.push(`Aksesi (Baris ~${getLineNumber(content, match.index)}): Elemen non-semantik <${tag}> memiliki handler onClick tetapi tidak memiliki atribut role="button".`);
      }
      if (!/tabIndex\s*=\s*\{?\s*0\s*\}?/i.test(attributes)) {
        warnings.push(`Aksesi (Baris ~${getLineNumber(content, match.index)}): Elemen non-semantik <${tag}> memiliki handler onClick tetapi tidak memiliki tabIndex={0} agar dapat difokus keyboard.`);
      }
    }

    // --- Rule 7: Performance - Lazy Load Images ---
    const imgLazyRegex = /<img\s+([^>]*)/gi;
    while ((match = imgLazyRegex.exec(content)) !== null) {
      const attributes = match[1];
      if (!/loading\s*=\s*["']lazy["']/i.test(attributes) && !/fetchpriority\s*=\s*["']high["']/i.test(attributes)) {
        warnings.push(`Performa (Baris ~${getLineNumber(content, match.index)}): Tag <img> disarankan memiliki loading="lazy" (atau fetchpriority="high" jika di atas lipatan layar / LCP).`);
      }
    }
  }

  // Report results for this file
  if (errors.length > 0 || warnings.length > 0) {
    console.log(`\n${COLORS.bold}${COLORS.cyan}📄 File: ${relativePath}${COLORS.reset}`);
    
    errors.forEach(err => {
      console.log(`  ❌ ${COLORS.red}${COLORS.bold}[ERROR]${COLORS.reset} ${err}`);
      errorCount++;
    });

    warnings.forEach(warn => {
      console.log(`  ⚠️ ${COLORS.yellow}${COLORS.bold}[WARN]${COLORS.reset} ${warn}`);
      warningCount++;
    });
  } else if (ext === '.tsx' || ext === '.ts') {
    successCount++;
  }
}

// Helper to determine line number from string index
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Main execution
console.log(`${COLORS.bold}${COLORS.blue}=============================================${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.blue}🔍  As-Sakinah Mart Success Criteria Validator${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.blue}=============================================${COLORS.reset}`);
console.log(`Memindai berkas di folder 'src/'...`);

try {
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`${COLORS.red}Error: Direktori 'src' tidak ditemukan di root proyek.${COLORS.reset}`);
    process.exit(1);
  }

  const allFiles = getFiles(srcDir);
  allFiles.forEach(file => validateFile(file));

  console.log(`\n${COLORS.bold}${COLORS.blue}================ Ringkasan Hasil ================${COLORS.reset}`);
  console.log(`  🟢 Patuh Lengkap:  ${COLORS.green}${successCount} file${COLORS.reset}`);
  console.log(`  ⚠️ Peringatan:     ${COLORS.yellow}${warningCount} item${COLORS.reset}`);
  console.log(`  🔴 Pelanggaran:    ${COLORS.red}${errorCount} item${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.blue}=================================================${COLORS.reset}`);

  if (errorCount > 0) {
    console.log(`\n${COLORS.red}${COLORS.bold}❌ VALIDASI GAGAL! Silakan perbaiki pelanggaran [ERROR] sebelum melakukan commit.${COLORS.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${COLORS.green}${COLORS.bold}✅ VALIDASI SUKSES! Kode Anda mematuhi standar keberhasilan proyek.${COLORS.reset}\n`);
    process.exit(0);
  }
} catch (err) {
  console.error(`${COLORS.red}Terjadi kesalahan sistem saat menjalankan validator: ${err.message}${COLORS.reset}`);
  process.exit(1);
}
