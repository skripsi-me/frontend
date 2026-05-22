const fs = require('fs');
const path = require('path');

// ANSI Color codes
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const isCheckMode = args.includes('--check');
const isGenerateMode = args.includes('--generate');

if (!isCheckMode && !isGenerateMode) {
  console.log(`${COLORS.bold}${COLORS.yellow}Peringatan: Tidak ada mode yang ditentukan. Menjalankan dalam mode validasi (--check) secara default.${COLORS.reset}`);
}

const mode = isGenerateMode ? 'generate' : 'check';

let totalUndocumented = 0;
let totalGenerated = 0;

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

// Clean parameter strings to extract parameter names
function parseParams(paramStr) {
  if (!paramStr || paramStr.trim() === '') return [];
  const params = [];
  const rawParams = paramStr.split(',');
  for (const raw of rawParams) {
    const cleaned = raw.trim();
    if (!cleaned) continue;
    // Extract parameter name (first word before :, =, ?, or space)
    const match = cleaned.match(/^([A-Za-z0-9_]+)/);
    if (match) {
      params.push(match[1]);
    }
  }
  return params;
}

// Check if there is a JSDoc comment immediately preceding matchIndex
function hasJSDoc(content, matchIndex) {
  const before = content.substring(0, matchIndex);
  const trimmedBefore = before.trimEnd();
  
  if (trimmedBefore.endsWith('*/')) {
    const lastStart = trimmedBefore.lastIndexOf('/*');
    if (lastStart !== -1) {
      const comment = trimmedBefore.substring(lastStart);
      if (comment.startsWith('/**')) {
        return true;
      }
    }
  }
  return false;
}

// Helper to determine line number from string index
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Build indented JSDoc block
function buildIndentedJSDoc(name, type, params, content, matchIndex) {
  // Find indentation of the declaration line
  const lineStart = content.lastIndexOf('\n', matchIndex) + 1;
  const indent = content.substring(lineStart, matchIndex).match(/^\s*/)[0];

  let jsdoc = `/**\n * @description \n`;
  if (type !== 'class') {
    params.forEach(p => {
      jsdoc += ` * @param ${p}\n`;
    });
    jsdoc += ` * @return \n`;
  }
  jsdoc += ` * @example\n * \n */\n`;

  // Align lines of JSDoc with the indentation
  const lines = jsdoc.trim().split('\n');
  const indentedJsDoc = lines.map((line, idx) => idx === 0 ? line : indent + line).join('\n') + '\n' + indent;
  return indentedJsDoc;
}

// Process a single file
function processFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.ts' && ext !== '.tsx') return;
  if (filePath.endsWith('.gen.ts') || filePath.endsWith('.gen.tsx')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);

  // Regex definitions
  const funcRegex = /^(export\s+(?:default\s+)?)?function\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/gm;
  const arrowRegex = /^(export\s+)?(?:const|let)\s+([A-Za-z0-9_]+)(?:\s*:\s*[A-Za-z0-9_<>.[\]\s{}|&]+)?\s*=\s*(?:async\s*)?\(([\s\S]*?)\)\s*=>/gm;
  const classRegex = /^(export\s+(?:default\s+)?)?class\s+([A-Za-z0-9_]+)/gm;

  const matches = [];
  let match;

  // 1. Match named functions
  while ((match = funcRegex.exec(content)) !== null) {
    if (!hasJSDoc(content, match.index)) {
      matches.push({
        index: match.index,
        name: match[2],
        type: 'function',
        params: parseParams(match[3]),
      });
    }
  }

  // 2. Match arrow functions
  while ((match = arrowRegex.exec(content)) !== null) {
    if (!hasJSDoc(content, match.index)) {
      matches.push({
        index: match.index,
        name: match[2],
        type: 'arrow-function',
        params: parseParams(match[3]),
      });
    }
  }

  // 3. Match classes
  while ((match = classRegex.exec(content)) !== null) {
    if (!hasJSDoc(content, match.index)) {
      matches.push({
        index: match.index,
        name: match[2],
        type: 'class',
        params: [],
      });
    }
  }

  if (matches.length === 0) return;

  if (mode === 'check') {
    console.log(`\n${COLORS.bold}${COLORS.cyan}📄 File: ${relativePath}${COLORS.reset}`);
    matches.forEach(m => {
      const line = getLineNumber(content, m.index);
      console.log(`  ❌ ${COLORS.red}[BELUM DIDOKUMENTASIKAN]${COLORS.reset} Baris ~${line}: ${m.type} "${m.name}"`);
      totalUndocumented++;
    });
  } else if (mode === 'generate') {
    // Sort matches from bottom-to-top to avoid index shifting
    matches.sort((a, b) => b.index - a.index);
    let updatedContent = content;

    matches.forEach(m => {
      const jsdoc = buildIndentedJSDoc(m.name, m.type, m.params, updatedContent, m.index);
      updatedContent = updatedContent.substring(0, m.index) + jsdoc + updatedContent.substring(m.index);
      totalGenerated++;
    });

    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`  🟢 ${COLORS.green}[BERHASIL INJEKSI]${COLORS.reset} Menambahkan JSDoc ke ${matches.length} deklarasi di ${relativePath}`);
  }
}

// Main run
console.log(`${COLORS.bold}${COLORS.blue}=============================================${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.blue}🔍  As-Sakinah Mart JSDoc Validator & Generator${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.blue}=============================================${COLORS.reset}`);
console.log(`Memproses berkas di folder 'src/' dalam mode: ${mode.toUpperCase()}...`);

try {
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`${COLORS.red}Error: Direktori 'src' tidak ditemukan di root proyek.${COLORS.reset}`);
    process.exit(1);
  }

  const allFiles = getFiles(srcDir);
  allFiles.forEach(file => processFile(file));

  console.log(`\n${COLORS.bold}${COLORS.blue}================ Ringkasan Hasil ================${COLORS.reset}`);
  if (mode === 'check') {
    console.log(`  🔴 Undocumented:  ${COLORS.red}${totalUndocumented} item${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}=================================================${COLORS.reset}`);
    if (totalUndocumented > 0) {
      console.log(`\n${COLORS.red}${COLORS.bold}❌ VALIDASI GAGAL! Silakan jalankan 'npm run jsdoc:generate' untuk menambahkan JSDoc otomatis.${COLORS.reset}\n`);
      process.exit(1);
    } else {
      console.log(`\n${COLORS.green}${COLORS.bold}✅ VALIDASI SUKSES! Semua fungsi, kelas, dan komponen telah didokumentasikan.${COLORS.reset}\n`);
      process.exit(0);
    }
  } else {
    console.log(`  🟢 JSDoc Dibuat:  ${COLORS.green}${totalGenerated} item${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}=================================================${COLORS.reset}`);
    console.log(`\n${COLORS.green}${COLORS.bold}✅ PROSES GENERASI SELESAI! Silakan periksa kembali file-file Anda.${COLORS.reset}\n`);
    process.exit(0);
  }
} catch (err) {
  console.error(`${COLORS.red}Terjadi kesalahan sistem: ${err.message}${COLORS.reset}`);
  process.exit(1);
}
