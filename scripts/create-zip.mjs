import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const srcDir = 'C:\\Users\\testuser\\.gemini\\antigravity\\scratch\\kerala-pyq-hub';
const zipPath = 'C:\\Users\\testuser\\.gemini\\antigravity\\brain\\542f2ce9-4b0a-4db0-ac08-10d8a4016530\\kerala-pyq-hub.zip';

// Use tar or powershell compress
try {
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  // tar is built-in on Windows 10/11
  execSync(`tar -a -c -f "${zipPath}" --exclude=node_modules --exclude=.git --exclude=dist *`, {
    cwd: srcDir,
    stdio: 'inherit'
  });
  const stat = fs.statSync(zipPath);
  console.log(`Zip created successfully! Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
} catch (e) {
  console.error('Tar failed:', e.message);
}
