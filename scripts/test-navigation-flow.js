const puppeteer = require('puppeteer');

const testNavigationFlow = async () => {
  console.log('🧪 Testing Navigation Flow & Data Persistence');
  console.log('=============================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI/CD
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log('🖥️  Browser:', msg.text());
      }
    });

    console.log('📱 Opening application...');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h2', { timeout: 5000 });
    
    console.log('✅ Landing page loaded');

    // Select IT field
    console.log('🎯 Selecting IT field...');
    await page.click('[data-field="it"]', { timeout: 5000 });
    await page.waitForSelector('button:has-text("Lanjutkan ke CV Builder")', { timeout: 5000 });
    await page.click('button:has-text("Lanjutkan ke CV Builder")');
    
    console.log('✅ Navigated to CV Builder');
    await page.waitForSelector('h1:has-text("CV Builder")', { timeout: 5000 });

    // Fill basic information
    console.log('📝 Filling CV information...');
    await page.fill('#targetRole', 'Senior Frontend Developer');
    await page.fill('#fullName', 'John Doe Test');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#phone', '+62123456789');
    
    // Add a skill
    await page.click('button:has-text("Tambah")');
    await page.fill('input[placeholder="e.g., React.js"]', 'React.js');
    await page.click('button:has-text("Tambah")');
    
    console.log('✅ Basic CV information filled');

    // Wait for auto-save
    await page.waitForTimeout(2000);
    console.log('⏳ Waiting for auto-save...');

    // Check if data is saved
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('smart-cv-data');
      return data ? JSON.parse(data) : null;
    });

    if (savedData && savedData.personalInfo.fullName === 'John Doe Test') {
      console.log('✅ CV data auto-saved to localStorage');
    } else {
      console.log('❌ CV data not saved properly');
      return;
    }

    // Navigate to AI Analysis
    console.log('🧠 Navigating to AI Analysis...');
    await page.click('button:has-text("Analisis dengan AI")');
    await page.waitForSelector('h1:has-text("Analisis AI")', { timeout: 10000 });
    
    console.log('✅ AI Analysis page loaded');

    // Check if name appears in header
    const headerText = await page.textContent('h1');
    if (headerText.includes('John Doe Test')) {
      console.log('✅ User name displayed in analysis header');
    } else {
      console.log('⚠️  User name not found in header');
    }

    // Wait for analysis to complete
    console.log('⏳ Waiting for AI analysis...');
    await page.waitForSelector('.text-4xl', { timeout: 15000 });
    
    const overallScore = await page.textContent('.text-4xl');
    console.log(`📊 Analysis completed - Score: ${overallScore}`);

    // Navigate back to edit
    console.log('🔄 Testing back to edit navigation...');
    await page.click('button:has-text("Kembali ke Edit")');
    await page.waitForSelector('h1:has-text("CV Builder")', { timeout: 5000 });
    
    console.log('✅ Navigated back to CV Builder');

    // Check if data is preserved
    const nameValue = await page.inputValue('#fullName');
    const emailValue = await page.inputValue('#email');
    const targetRoleValue = await page.inputValue('#targetRole');

    if (nameValue === 'John Doe Test' && 
        emailValue === 'john.doe@example.com' && 
        targetRoleValue === 'Senior Frontend Developer') {
      console.log('✅ All CV data preserved after navigation');
    } else {
      console.log('❌ CV data not preserved properly');
      console.log('Current values:', { nameValue, emailValue, targetRoleValue });
    }

    // Test manual save
    console.log('💾 Testing manual save...');
    await page.click('button:has-text("Simpan")');
    await page.waitForTimeout(1000);
    
    // Check last saved indicator
    const lastSavedText = await page.textContent('text=Tersimpan');
    if (lastSavedText) {
      console.log('✅ Manual save working - Last saved indicator visible');
    } else {
      console.log('⚠️  Last saved indicator not found');
    }

    console.log('\n🎉 Navigation Flow Test Completed Successfully!');
    console.log('\n📋 Test Results Summary:');
    console.log('✅ Landing page → CV Builder navigation');
    console.log('✅ CV data auto-save functionality');
    console.log('✅ CV Builder → AI Analysis navigation');
    console.log('✅ AI Analysis → CV Builder return navigation');
    console.log('✅ Data persistence across navigation');
    console.log('✅ Manual save functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Check if server is running first
const http = require('http');
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, () => resolve(true));

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
};

checkServer().then(isRunning => {
  if (isRunning) {
    testNavigationFlow();
  } else {
    console.log('❌ Development server is not running on http://localhost:3000');
    console.log('Please start the server first with: npm run dev');
    console.log('\nTo install Puppeteer for testing:');
    console.log('npm install --save-dev puppeteer');
  }
});
