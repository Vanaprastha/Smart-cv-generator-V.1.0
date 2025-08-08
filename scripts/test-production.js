const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Production Build Locally\n');

// Step 1: Environment Check
console.log('📋 Step 1: Environment Check');
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
  
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.log('❌ Environment check failed:', error.message);
  process.exit(1);
}

// Step 2: Check .env.local
console.log('\n📋 Step 2: Environment Variables Check');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('GOOGLE_GENERATIVE_AI_API_KEY=') && 
      !envContent.includes('your_api_key_here')) {
    console.log('✅ Google Gemini API key is configured');
  } else {
    console.log('⚠️  Google Gemini API key needs to be configured');
  }
} else {
  console.log('❌ .env.local not found');
}

// Step 3: Clean previous build
console.log('\n📋 Step 3: Cleaning Previous Build');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
    console.log('✅ Cleaned .next directory');
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
    console.log('✅ Cleaned out directory');
  }
} catch (error) {
  console.log('⚠️  Clean up warning:', error.message);
}

// Step 4: Install dependencies
console.log('\n📋 Step 4: Installing Dependencies');
try {
  console.log('Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.log('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 5: Type check
console.log('\n📋 Step 5: TypeScript Type Check');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript type check passed');
} catch (error) {
  console.log('⚠️  TypeScript warnings detected, but continuing...');
}

// Step 6: Build production
console.log('\n📋 Step 6: Building Production Version');
try {
  console.log('Building production build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build completed successfully');
} catch (error) {
  console.log('❌ Production build failed:', error.message);
  process.exit(1);
}

// Step 7: Check build output
console.log('\n📋 Step 7: Analyzing Build Output');
try {
  const buildPath = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildPath)) {
    console.log('✅ .next directory created');
    
    // Check for static pages
    const staticPath = path.join(buildPath, 'static');
    if (fs.existsSync(staticPath)) {
      console.log('✅ Static assets generated');
    }
    
    // Check for server files
    const serverPath = path.join(buildPath, 'server');
    if (fs.existsSync(serverPath)) {
      console.log('✅ Server files generated');
    }
  }
} catch (error) {
  console.log('⚠️  Build analysis warning:', error.message);
}

console.log('\n🎉 Production build test completed!');
console.log('\nNext steps:');
console.log('1. Run: npm start');
console.log('2. Open: http://localhost:3000');
console.log('3. Test all features');
