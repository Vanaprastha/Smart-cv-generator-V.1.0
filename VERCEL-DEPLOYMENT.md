# 🚀 Tutorial Deploy ke Vercel

## 📋 Prerequisites

### 1. Akun dan Tools
- [x] Akun Vercel (gratis di [vercel.com](https://vercel.com))
- [x] Akun GitHub/GitLab/Bitbucket
- [x] Node.js 18+ terinstall
- [x] Git terinstall

### 2. Project Requirements
- [x] Google Gemini API Key
- [x] Project sudah berjalan lokal
- [x] Tidak ada error di build

## 🎯 Method 1: Deploy via GitHub (Recommended)

### Step 1: Push ke GitHub

\`\`\`bash
# Inisialisasi git (jika belum)
git init

# Add semua files
git add .

# Commit
git commit -m "Initial commit: Smart CV Generator"

# Add remote repository
git remote add origin https://github.com/username/smart-cv-generator.git

# Push ke GitHub
git push -u origin main
\`\`\`

### Step 2: Connect ke Vercel

1. **Login ke Vercel Dashboard**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Project**
   - Klik "New Project"
   - Pilih repository "smart-cv-generator"
   - Klik "Import"

3. **Configure Project**
   \`\`\`
   Project Name: smart-cv-generator
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   \`\`\`

4. **Set Environment Variables**
   - Klik "Environment Variables"
   - Add variable:
     \`\`\`
     Name: GOOGLE_GENERATIVE_AI_API_KEY
     Value: AIzaSyCeTqI8bhTGtsYrpG5jzptvOGzNbN6rjPs
     \`\`\`

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai (2-5 menit)

## 🎯 Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

\`\`\`bash
# Install globally
npm install -g vercel

# Atau install lokal
npm install vercel --save-dev
\`\`\`

### Step 2: Login ke Vercel

\`\`\`bash
vercel login
# Pilih method login (GitHub/Email)
\`\`\`

### Step 3: Deploy Project

\`\`\`bash
# Deploy dengan script otomatis
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh

# Atau manual
vercel --prod
\`\`\`

### Step 4: Set Environment Variables

\`\`\`bash
# Set via CLI
vercel env add GOOGLE_GENERATIVE_AI_API_KEY

# Atau via dashboard
# https://vercel.com/dashboard -> Project -> Settings -> Environment Variables
\`\`\`

## ⚙️ Konfigurasi Vercel

### 1. vercel.json Configuration

File \`vercel.json\` sudah dikonfigurasi dengan:
- **Regions**: Singapore (sin1) untuk performa optimal
- **Functions**: API timeout 30 detik
- **Headers**: CORS dan security headers
- **Environment**: Variable mapping

### 2. next.config.mjs Optimization

Konfigurasi Next.js sudah dioptimalkan untuk Vercel:
- **Bundle optimization**: Code splitting
- **Image optimization**: WebP/AVIF support
- **Security headers**: XSS protection
- **Webpack optimization**: Tree shaking

### 3. API Route Optimization

API route \`/api/analyze-cv\` sudah dioptimalkan:
- **Runtime**: Node.js untuk AI SDK
- **Timeout**: 30 detik untuk AI processing
- **Error handling**: Fallback analysis
- **Caching**: Proper cache headers

## 🔧 Environment Variables Setup

### Required Variables:

\`\`\`env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
\`\`\`

### Optional Variables:

\`\`\`env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

### Setting via Dashboard:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for "Production" environment

### Setting via CLI:

\`\`\`bash
# Add environment variable
vercel env add GOOGLE_GENERATIVE_AI_API_KEY production

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm GOOGLE_GENERATIVE_AI_KEY production
\`\`\`

## 🚀 Deployment Process

### Automatic Deployment (GitHub Method):

1. **Push to main branch** → Auto deploy
2. **Pull request** → Preview deployment
3. **Merge PR** → Production deployment

### Manual Deployment (CLI Method):

\`\`\`bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Deploy specific branch
vercel --prod --target production
\`\`\`

## 📊 Post-Deployment Checklist

### ✅ Functionality Test

\`\`\`bash
# Test endpoints
curl https://your-app.vercel.app/
curl https://your-app.vercel.app/api/analyze-cv -X POST -H "Content-Type: application/json" -d '{"cvData":{},"field":"it"}'
\`\`\`

### ✅ Performance Test

1. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

2. **API Response Time**
   - Landing page < 1s
   - CV Builder < 2s
   - AI Analysis < 10s

### ✅ Feature Test

- [ ] Landing page loads
- [ ] Field selection works
- [ ] CV Builder form functions
- [ ] Photo upload works
- [ ] Skills visualization displays
- [ ] AI analysis returns results
- [ ] PDF download works
- [ ] Responsive design works

## 🔍 Troubleshooting

### Build Errors

\`\`\`bash
# Check build locally first
npm run build

# Common issues:
# 1. TypeScript errors → Fix or ignore in next.config.mjs
# 2. ESLint errors → Fix or ignore in next.config.mjs
# 3. Missing dependencies → Check package.json
\`\`\`

### Runtime Errors

\`\`\`bash
# Check Vercel function logs
vercel logs

# Common issues:
# 1. Environment variables not set
# 2. API timeout (increase in vercel.json)
# 3. Memory limit exceeded
\`\`\`

### API Issues

\`\`\`bash
# Test API locally
npm run dev
curl http://localhost:3000/api/analyze-cv -X POST -H "Content-Type: application/json" -d '{"cvData":{},"field":"it"}'

# Common issues:
# 1. Gemini API key invalid
# 2. Request timeout
# 3. CORS issues
\`\`\`

## 🎯 Optimization Tips

### 1. Performance

\`\`\`javascript
// next.config.mjs optimizations already included:
- Image optimization
- Bundle splitting
- Compression
- Minification
\`\`\`

### 2. SEO

\`\`\`javascript
// Add to app/layout.tsx:
export const metadata = {
  title: 'Smart CV Generator - AI-Powered Resume Builder',
  description: 'Create ATS-friendly CVs with AI analysis',
}
\`\`\`

### 3. Analytics

\`\`\`bash
# Add Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx:
import { Analytics } from '@vercel/analytics/react'
\`\`\`

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., smartcv.com)
3. Configure DNS records

### 2. DNS Configuration

\`\`\`
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
\`\`\`

## 📈 Monitoring & Analytics

### 1. Vercel Analytics

- **Performance metrics**
- **User analytics**
- **Error tracking**

### 2. Function Logs

\`\`\`bash
# View real-time logs
vercel logs --follow

# View specific function logs
vercel logs --function=api/analyze-cv
\`\`\`

## 🎉 Success Indicators

### ✅ Deployment Success

\`\`\`
✓ Build completed
✓ Functions deployed
✓ Domain assigned
✓ SSL certificate issued
✓ Environment variables set
\`\`\`

### ✅ Application Working

\`\`\`
✓ Landing page loads (< 2s)
✓ CV Builder functional
✓ AI analysis working
✓ PDF generation working
✓ Mobile responsive
✓ No console errors
\`\`\`

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Status Page**: https://vercel-status.com
- **Community**: https://github.com/vercel/vercel/discussions

---

**🎯 Deployment berhasil jika semua checklist terpenuhi dan aplikasi dapat diakses di URL Vercel Anda!**
\`\`\`
