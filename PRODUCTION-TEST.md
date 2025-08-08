# Production Build Testing Guide

## 🚀 Quick Start

### 1. Automated Full Test
\`\`\`bash
npm run test:production
\`\`\`

### 2. Manual Step-by-Step Test

#### Step 1: Build Production
\`\`\`bash
npm run build
\`\`\`

#### Step 2: Start Production Server
\`\`\`bash
npm start
# atau
npm run start:production
\`\`\`

#### Step 3: Test Endpoints
\`\`\`bash
# Di terminal baru
npm run test:endpoints
\`\`\`

#### Step 4: Performance Test
\`\`\`bash
npm run test:performance
\`\`\`

## 📋 Manual Testing Checklist

### ✅ Core Functionality
- [ ] Landing page loads correctly
- [ ] Field selection works (IT, Engineering, Business)
- [ ] CV Builder form functions properly
- [ ] Real-time preview updates
- [ ] Photo upload works
- [ ] Skills visualization displays
- [ ] AI analysis returns results
- [ ] PDF download generates correctly

### ✅ Performance Metrics
- [ ] Landing page loads < 2 seconds
- [ ] CV Builder loads < 3 seconds
- [ ] API responses < 5 seconds
- [ ] No console errors
- [ ] Responsive design works

### ✅ Production Features
- [ ] Environment variables loaded
- [ ] API endpoints accessible
- [ ] Static assets served correctly
- [ ] SEO meta tags present
- [ ] Error boundaries working

## 🔧 Troubleshooting

### Build Fails
\`\`\`bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Server Won't Start
\`\`\`bash
# Check port availability
lsof -i :3000
# Kill existing process
lsof -ti:3000 | xargs kill -9
\`\`\`

### API Not Working
\`\`\`bash
# Check environment variables
cat .env.local
# Test API directly
curl -X POST http://localhost:3000/api/analyze-cv \
  -H "Content-Type: application/json" \
  -d '{"cvData": {}, "field": "it"}'
\`\`\`

## 📊 Expected Results

### Build Output
\`\`\`
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          87.4 kB
├ ○ /ai-analysis                         8.1 kB          90.3 kB
├ ○ /cv-builder                          12.3 kB         94.5 kB
└ ○ /_not-found                          871 B           83.1 kB
\`\`\`

### Server Start
\`\`\`
▲ Next.js 14.2.15
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 1.2s
\`\`\`

### Endpoint Tests
\`\`\`
✅ Landing Page: OK (200)
✅ CV Builder (IT): OK (200)
✅ CV Builder (Engineering): OK (200)
✅ CV Builder (Business): OK (200)
✅ API Analyze CV: OK (Score: 75)
\`\`\`

### Performance Benchmarks
\`\`\`
📊 Landing Page Load
  Average: 45.23ms
  Fastest: 32.11ms
  Slowest: 67.89ms
  ✅ Excellent performance!

📊 CV Builder Load
  Average: 123.45ms
  Fastest: 98.76ms
  Slowest: 156.78ms
  👍 Good performance

📊 API Response Time
  Average: 2341.23ms
  Fastest: 1876.54ms
  Slowest: 3012.45ms
  ⚠️  Acceptable performance
\`\`\`

## 🎯 Success Criteria

### ✅ Build Success
- No TypeScript errors
- No build warnings
- All pages generated
- Static assets optimized

### ✅ Runtime Success
- Server starts without errors
- All routes accessible
- API endpoints functional
- No console errors

### ✅ Performance Success
- Page loads < 3 seconds
- API responses < 10 seconds
- No memory leaks
- Responsive design works

## 🚀 Ready for Deployment

If all tests pass, your production build is ready for:
- Vercel deployment
- Docker containerization
- Server deployment
- CDN distribution
