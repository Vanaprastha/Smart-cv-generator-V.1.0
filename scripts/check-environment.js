const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Check');
console.log('===================\n');

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

// Check npm version
try {
  const { execSync } = require('child_process');
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`📋 npm version: ${npmVersion}`);
  console.log('✅ npm available');
} catch (error) {
  console.log('❌ npm not available');
  process.exit(1);
}

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json exists');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📦 Project: ${packageJson.name} v${packageJson.version}`);
  } catch (error) {
    console.log('⚠️  package.json format issue');
  }
} else {
  console.log('❌ package.json not found');
  process.exit(1);
}

// Check .env files
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local exists');
  
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  if (envContent.includes('GOOGLE_GENERATIVE_AI_API_KEY=') && 
      !envContent.includes('your_api_key_here')) {
    console.log('✅ Google Gemini API key is configured');
  } else {
    console.log('⚠️  Google Gemini API key needs configuration');
  }
} else {
  console.log('❌ .env.local not found');
}

if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example exists');
} else {
  console.log('❌ .env.example not found');
}

// Check node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists');
  
  // Check if key dependencies exist
  const keyDeps = ['next', 'react', 'react-dom', '@ai-sdk/google'];
  let allDepsExist = true;
  
  keyDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`  ✅ ${dep} installed`);
    } else {
      console.log(`  ❌ ${dep} missing`);
      allDepsExist = false;
    }
  });
  
  if (!allDepsExist) {
    console.log('⚠️  Some dependencies are missing. Run: npm install');
  }
} else {
  console.log('❌ node_modules not found. Run: npm install');
}

// Check build directory
const buildPath = path.join(process.cwd(), '.next');
if (fs.existsSync(buildPath)) {
  console.log('✅ .next build directory exists');
} else {
  console.log('ℹ️  No build found (run npm run build to create)');
}

console.log('\n🎯 Environment check completed!');
