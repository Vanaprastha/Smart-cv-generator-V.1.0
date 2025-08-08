const https = require('https');

async function checkVercelDeployment(url) {
  console.log('🔍 Checking Vercel Deployment');
  console.log('============================\n');
  
  if (!url) {
    console.log('❌ Please provide Vercel URL');
    console.log('Usage: node scripts/vercel-check.js https://your-app.vercel.app');
    process.exit(1);
  }

  const endpoints = [
    { path: '/', name: 'Landing Page' },
    { path: '/cv-builder?field=it', name: 'CV Builder' },
    { path: '/api/analyze-cv', name: 'API Endpoint', method: 'POST' }
  ];

  console.log(`Testing deployment: ${url}\n`);

  for (const endpoint of endpoints) {
    await testEndpoint(url, endpoint);
  }

  console.log('\n🎯 Deployment check completed!');
}

function testEndpoint(baseUrl, endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint.path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: endpoint.method || 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Vercel-Check/1.0'
      }
    };

    if (endpoint.method === 'POST') {
      const postData = JSON.stringify({
        cvData: {
          personalInfo: { fullName: 'Test User' },
          experiences: [],
          education: [],
          skills: [],
          projects: [],
          summary: 'Test',
          targetRole: 'Test Role'
        },
        field: 'it'
      });
      
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${endpoint.name}: OK (${res.statusCode})`);
          
          if (endpoint.method === 'POST') {
            try {
              const result = JSON.parse(data);
              if (result.overallScore) {
                console.log(`   📊 AI Analysis Score: ${result.overallScore}/100`);
              }
            } catch (e) {
              console.log(`   ⚠️  Response parsing issue`);
            }
          }
        } else {
          console.log(`⚠️  ${endpoint.name}: ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${endpoint.name}: ${err.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏰ ${endpoint.name}: Timeout`);
      req.destroy();
      resolve();
    });

    if (endpoint.method === 'POST') {
      const postData = JSON.stringify({
        cvData: {
          personalInfo: { fullName: 'Test User' },
          experiences: [],
          education: [],
          skills: [],
          projects: [],
          summary: 'Test',
          targetRole: 'Test Role'
        },
        field: 'it'
      });
      req.write(postData);
    }

    req.end();
  });
}

// Get URL from command line argument
const deploymentUrl = process.argv[2];
checkVercelDeployment(deploymentUrl);
