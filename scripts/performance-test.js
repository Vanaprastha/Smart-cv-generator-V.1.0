const { performance } = require('perf_hooks');
const http = require('http');

const performanceTest = async () => {
  console.log('⚡ Performance Testing Production Build');
  console.log('=====================================\n');

  const tests = [
    { name: 'Landing Page Load', path: '/' },
    { name: 'CV Builder Load', path: '/cv-builder?field=it' },
    { name: 'API Response Time', path: '/api/analyze-cv', method: 'POST' }
  ];

  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    
    const times = [];
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        await new Promise((resolve, reject) => {
          const options = {
            hostname: 'localhost',
            port: 3000,
            path: test.path,
            method: test.method || 'GET',
            timeout: 10000
          };

          const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              const end = performance.now();
              times.push(end - start);
              resolve();
            });
          });

          req.on('error', reject);
          req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
          });

          if (test.method === 'POST') {
            const postData = JSON.stringify({
              cvData: { personalInfo: { fullName: 'Test' }, experiences: [], education: [], skills: [], projects: [], summary: '', targetRole: '' },
              field: 'it'
            });
            req.write(postData);
          }

          req.end();
        });
      } catch (error) {
        console.log(`  ❌ Iteration ${i + 1}: ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`  📊 Average: ${avg.toFixed(2)}ms`);
      console.log(`  ⚡ Fastest: ${min.toFixed(2)}ms`);
      console.log(`  🐌 Slowest: ${max.toFixed(2)}ms`);
      
      // Performance assessment
      if (avg < 100) {
        console.log(`  ✅ Excellent performance!`);
      } else if (avg < 500) {
        console.log(`  👍 Good performance`);
      } else if (avg < 1000) {
        console.log(`  ⚠️  Acceptable performance`);
      } else {
        console.log(`  🐌 Slow performance - needs optimization`);
      }
    }
    console.log('');
  }
};

// Check if server is running first
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
    performanceTest();
  } else {
    console.log('❌ Production server is not running on http://localhost:3000');
    console.log('Please start the server first with: npm start');
  }
});
