const bcrypt = require('bcrypt');

// Generate hash untuk password
const passwords = [
  { name: 'admin123', password: 'admin123' },
  { name: 'student123', password: 'student123' }
];

async function generateHashes() {
  for (const pwd of passwords) {
    const hash = await bcrypt.hash(pwd.password, 10);
    console.log(`Password: ${pwd.name}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }
}

generateHashes();
