const http = require('http');

const endpoints = [
  { path: '/', name: 'Landing Page' },
  { path: '/cv-builder?field=it', name: 'CV Builder (IT)' },
  { path: '/cv-builder?field=engineering', name: 'CV Builder (Engineering)' },
  { path: '/cv-builder?field=business', name: 'CV Builder (Business)' },
];

const testEndpoint = (path, name) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${name}: OK (${res.statusCode})`);
        resolve(true);
      } else {
        console.log(`⚠️  ${name}: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

const testAPI = () => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      cvData: {
        personalInfo: { fullName: 'Test User' },
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        summary: 'Test summary',
        targetRole: 'Test Role'
      },
      field: 'it'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze-cv',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            if (result.overallScore) {
              console.log(`✅ API Analyze CV: OK (Score: ${result.overallScore})`);
              resolve(true);
            } else {
              console.log(`⚠️  API Analyze CV: Invalid response format`);
              resolve(false);
            }
          } catch (error) {
            console.log(`❌ API Analyze CV: JSON parse error`);
            resolve(false);
          }
        } else {
          console.log(`⚠️  API Analyze CV: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ API Analyze CV: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ API Analyze CV: Timeout`);
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Testing Production Endpoints');
  console.log('================================');
  console.log('Make sure production server is running on http://localhost:3000\n');

  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test pages
  console.log('📄 Testing Pages:');
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.name);
  }

  // Test API
  console.log('\n🔌 Testing API:');
  await testAPI();

  console.log('\n🎯 Test completed!');
  console.log('If all tests pass, your production build is working correctly.');
}

// Check if server is running
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

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
    runTests();
  } else {
    console.log('❌ Production server is not running on http://localhost:3000');
    console.log('Please start the server first with: npm start');
  }
});
