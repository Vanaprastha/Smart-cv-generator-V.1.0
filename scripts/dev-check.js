const fs = require('fs');
const path = require('path');

console.log('🔍 Checking development environment...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`📋 Node.js version: ${nodeVersion}`);
if (majorVersion < 18) {
  console.log('❌ Node.js 18+ required');
  process.exit(1);
} else {
  console.log('✅ Node.js version OK');
}

// Check .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  
  // Check if API key is set
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here')) {
    console.log('⚠️  Please update your Google Gemini API key in .env.local');
  } else if (envContent.includes('GOOGLE_GENERATIVE_AI_API_KEY=')) {
    console.log('✅ Google Gemini API key is set');
  } else {
    console.log('❌ Google Gemini API key not found in .env.local');
  }
} else {
  console.log('❌ .env.local not found');
  console.log('📝 Creating .env.local from template...');
  
  const examplePath = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ .env.local created. Please add your API key.');
  }
}

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json exists');
} else {
  console.log('❌ package.json not found');
  process.exit(1);
}

// Check node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists');
} else {
  console.log('❌ node_modules not found. Run: npm install');
}

console.log('\n🎉 Environment check complete!');
