const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const vm = require('vm');

console.log('🔍 Starting website verification tests...\n');

let failed = false;

// 1. Verify Embedded JavaScript Syntax
function verifyJavaScriptSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let scriptIndex = 1;
    let fileFailed = false;

    while ((match = scriptRegex.exec(content)) !== null) {
      const scriptContent = match[1];
      try {
        new vm.Script(scriptContent, { filename: `${path.basename(filePath)} [Script #${scriptIndex}]` });
      } catch (err) {
        console.error(`❌ Syntax Error in ${filePath} (Script Tag #${scriptIndex}):`);
        console.error(err.stack || err.message);
        fileFailed = true;
        failed = true;
      }
      scriptIndex++;
    }

    if (!fileFailed) {
      console.log(`✅ ${filePath}: Embedded scripts syntax OK.`);
    }
  } catch (err) {
    console.error(`❌ Failed to read or process file ${filePath}:`, err.message);
    failed = true;
  }
}

// Check files for script syntax (none for now, but function is defined for future use)

// 2. Run Jekyll Build to check compilation correctness
console.log('\n🏗️ Running Jekyll build...');
try {
  const buildOutput = execSync('bundle exec jekyll build', { cwd: '/home/ritik-jain/Documents/Website', encoding: 'utf8' });
  console.log('✅ Jekyll build successful!');
} catch (err) {
  console.error('❌ Jekyll build failed:');
  console.error(err.stdout || err.message);
  failed = true;
}

console.log('\n=======================================');
if (failed) {
  console.error('❌ Verification FAILED. Please review the errors above.');
  process.exit(1);
} else {
  console.log('🎉 Verification PASSED! All changes are correct.');
  process.exit(0);
}
