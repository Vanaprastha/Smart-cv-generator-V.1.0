const http = require('http');

// Test with large photo data (simulated base64)
const createLargePhotoData = () => {
  // Simulate a base64 encoded image (1MB)
  const base64Header = 'data:image/jpeg;base64,';
  const base64Data = 'A'.repeat(1000000); // 1MB of data
  return base64Header + base64Data;
};

const testLargePayload = async () => {
  console.log('🧪 Testing Large Payload Handling');
  console.log('=================================\n');

  const testData = {
    cvData: {
      personalInfo: {
        fullName: 'Test User with Photo',
        email: 'test@example.com',
        phone: '+62123456789',
        location: 'Jakarta, Indonesia',
        linkedin: 'https://linkedin.com/in/testuser',
        github: 'https://github.com/testuser',
        portfolio: 'https://testuser.dev',
        photo: createLargePhotoData() // Large photo data
      },
      summary: 'Experienced software developer',
      experiences: [],
      education: [],
      skills: [
        { name: 'JavaScript', level: 4, category: 'Programming Languages' },
        { name: 'React', level: 4, category: 'Frameworks & Libraries' }
      ],
      projects: [],
      targetRole: 'Senior Developer'
    },
    field: 'it'
  };

  const postData = JSON.stringify(testData);
  console.log(`📊 Payload size: ${(postData.length / 1024 / 1024).toFixed(2)} MB`);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/analyze-cv',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
  };

  return new Promise((resolve) => {
    console.log('🚀 Sending request...');
    const startTime = Date.now();

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`⏱️  Response time: ${duration}ms`);
        console.log(`📡 Status code: ${res.statusCode}`);

        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log('✅ Large payload handled successfully');
            console.log(`📊 Analysis score: ${result.overallScore || 'N/A'}`);
            
            // Check if photo is properly handled
            if (result.improvedCV && result.improvedCV.personalInfo.photo) {
              console.log('✅ Photo data preserved in response');
            } else {
              console.log('⚠️  Photo data not found in response');
            }
          } catch (error) {
            console.log('❌ Invalid JSON response');
          }
        } else {
          console.log('❌ Request failed');
          console.log('Response:', data.substring(0, 500));
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request error: ${err.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.log('⏰ Request timeout');
      req.destroy();
      resolve();
    });

    req.write(postData);
    req.end();
  });
};

// Check if server is running
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
    testLargePayload();
  } else {
    console.log('❌ Development server is not running on http://localhost:3000');
    console.log('Please start the server first with: npm run dev');
  }
});
