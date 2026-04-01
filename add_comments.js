const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Get all tracked files in git
  const stdout = execSync('git ls-files').toString();
  const files = stdout.split('\n').filter(Boolean);

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    // Skip images, configs etc
    if (file.endsWith('.svg') || file.endsWith('.json') || file.endsWith('.gitignore')) continue;

    let comment = '';
    if (file.endsWith('.js') || file.endsWith('.jsx')) {
      comment = '\n// Built by Karthik\n';
    } else if (file.endsWith('.css')) {
      comment = '\n/* Built by Karthik */\n';
    } else if (file.endsWith('.html') || file.endsWith('.md')) {
      comment = '\n<!-- Built by Karthik -->\n';
    } else {
      continue;
    }

    fs.appendFileSync(file, comment);
    console.log(`Added comment to ${file}`);
  }
} catch (e) {
  console.error("Error updating files:", e);
}
