import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

// Optimized for Vercel deployment
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { cvData, field } = await request.json()

    // Clean CV data to remove large photo data for AI analysis
    const cleanedCVData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        // Remove photo data from AI analysis to prevent payload issues
        photo: cvData.personalInfo.photo ? '[Photo uploaded]' : ''
      }
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    
    if (!apiKey) {
      console.log('Gemini API key not found, using fallback analysis')
      const fallbackAnalysis = generateMockAnalysis(cleanedCVData, field)
      return NextResponse.json(fallbackAnalysis, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      })
    }

    // Create comprehensive prompt for CV analysis
    const analysisPrompt = `
Sebagai AI expert dalam rekrutmen dan data science, analisis CV berikut untuk bidang ${field}:

Data CV:
- Nama: ${cleanedCVData.personalInfo.fullName}
- Target Role: ${cleanedCVData.targetRole}
- Summary: ${cleanedCVData.summary}
- Foto: ${cleanedCVData.personalInfo.photo ? 'Ada foto profil' : 'Tidak ada foto'}
- Kontak: Email: ${cleanedCVData.personalInfo.email}, Phone: ${cleanedCVData.personalInfo.phone}, Location: ${cleanedCVData.personalInfo.location}
- LinkedIn: ${cleanedCVData.personalInfo.linkedin}
- GitHub: ${cleanedCVData.personalInfo.github}
- Portfolio: ${cleanedCVData.personalInfo.portfolio}
- Pengalaman: ${JSON.stringify(cleanedCVData.experiences)}
- Pendidikan: ${JSON.stringify(cleanedCVData.education)}
- Skills: ${cleanedCVData.skills.map((s: any) => `${s.name} (${s.category}, Level: ${s.level}/5)`).join(', ')}
- Projects: ${JSON.stringify(cleanedCVData.projects)}

Berikan analisis dalam format JSON dengan struktur berikut:
{
  "overallScore": number (0-100),
  "atsCompatibility": number (0-100),
  "keywordMatch": number (0-100),
  "structureScore": number (0-100),
  "contentQuality": number (0-100),
  "strengths": ["kekuatan 1", "kekuatan 2", "kekuatan 3"],
  "weaknesses": ["kelemahan 1", "kelemahan 2", "kelemahan 3"],
  "recommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3", "rekomendasi 4", "rekomendasi 5"],
  "improvedSummary": "ringkasan profesional yang diperbaiki",
  "skillAnalysis": {
    "strongSkills": ["skill yang sudah kuat"],
    "skillsToImprove": ["skill yang perlu ditingkatkan"],
    "missingSkills": ["skill yang sebaiknya ditambahkan"]
  }
}

Fokus pada:
1. ATS compatibility dan keyword optimization
2. Struktur dan format CV
3. Relevansi dengan target role
4. Kualitas konten dan pencapaian
5. Analisis keahlian berdasarkan level dan kategori
6. Saran perbaikan yang actionable
7. Nilai tambah foto profil jika ada

Berikan analisis yang mendalam dan konstruktif dalam bahasa Indonesia.
`

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash', {
          apiKey: apiKey
        }),
        prompt: analysisPrompt,
        temperature: 0.7,
      })

      // Parse AI response
      let analysisResult
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.log('Failed to parse AI response, using fallback')
        analysisResult = generateMockAnalysis(cleanedCVData, field)
      }

      // Add improved CV data (preserve original photo)
      const improvedCV = {
        ...cvData, // Use original cvData to preserve photo
        summary: analysisResult.improvedSummary || cvData.summary
      }

      const finalResult = {
        ...analysisResult,
        improvedCV
      }

      return NextResponse.json(finalResult, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      })

    } catch (aiError) {
      console.log('AI API error, using fallback analysis:', aiError)
      const fallbackAnalysis = generateMockAnalysis(cleanedCVData, field)
      // Preserve original photo in improved CV
      fallbackAnalysis.improvedCV = {
        ...cvData,
        summary: fallbackAnalysis.improvedSummary || cvData.summary
      }
      return NextResponse.json(fallbackAnalysis, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      })
    }

  } catch (error) {
    console.error('Analysis error:', error)
    
    // Return fallback analysis on error
    try {
      const { cvData, field } = await request.json()
      const fallbackAnalysis = generateMockAnalysis(cvData, field)
      return NextResponse.json(fallbackAnalysis, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      })
    } catch {
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: 'Terjadi kesalahan pada server. Silakan coba lagi.'
        },
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }
}

function generateMockAnalysis(cvData: any, field: string) {
  const hasExperience = cvData.experiences?.length > 0
  const hasEducation = cvData.education?.length > 0
  const hasSkills = cvData.skills?.length > 0
  const hasProjects = cvData.projects?.length > 0
  const hasSummary = cvData.summary?.length > 0
  const hasPhoto = cvData.personalInfo?.photo && cvData.personalInfo.photo !== ''

  const baseScore = 60
  let bonusScore = 0
  
  if (hasExperience) bonusScore += 15
  if (hasEducation) bonusScore += 10
  if (hasSkills) bonusScore += 10
  if (hasProjects) bonusScore += 10
  if (hasSummary) bonusScore += 5
  if (hasPhoto) bonusScore += 3 // Bonus for having photo

  // Bonus for skill levels
  const avgSkillLevel = cvData.skills?.length > 0 
    ? cvData.skills.reduce((sum: number, skill: any) => sum + skill.level, 0) / cvData.skills.length 
    : 0
  bonusScore += Math.round(avgSkillLevel * 2)

  const overallScore = Math.min(baseScore + bonusScore, 95)

  const fieldKeywords = {
    'it': ['programming', 'software', 'data', 'algorithm', 'database', 'web development', 'API', 'framework'],
    'engineering': ['design', 'analysis', 'manufacturing', 'quality', 'process', 'technical', 'optimization'],
    'business': ['management', 'strategy', 'analysis', 'leadership', 'project', 'operations', 'planning']
  }

  const keywords = fieldKeywords[field as keyof typeof fieldKeywords] || []
  const keywordMatch = Math.min(85 + ((cvData.skills?.length || 0) * 2), 98)

  const strongSkills = cvData.skills?.filter((s: any) => s.level >= 4).map((s: any) => s.name) || []
  const skillsToImprove = cvData.skills?.filter((s: any) => s.level <= 2).map((s: any) => s.name) || []

  const strengths = [
    hasExperience ? 'Pengalaman kerja yang relevan dengan target role' : 'Format CV yang terstruktur dengan baik',
    hasSkills ? `Portfolio keahlian teknis yang beragam dengan ${strongSkills.length} keahlian tingkat lanjut` : 'Informasi kontak yang lengkap dan profesional',
    hasEducation ? 'Latar belakang pendidikan yang solid dan relevan' : 'Target role yang jelas dan spesifik'
  ]

  if (hasPhoto) {
    strengths.push('Foto profil profesional yang menambah kesan personal')
  }

  const weaknesses = [
    !hasSummary ? 'Ringkasan profesional perlu diperkuat dengan value proposition' : null,
    (cvData.skills?.length || 0) < 5 ? 'Perlu menambah lebih banyak keahlian yang relevan' : null,
    skillsToImprove.length > 0 ? `Beberapa keahlian masih perlu ditingkatkan: ${skillsToImprove.slice(0, 3).join(', ')}` : null,
    !hasProjects ? 'Tidak ada proyek yang menunjukkan kemampuan praktis' : null,
    (cvData.experiences?.length || 0) === 0 ? 'Belum ada pengalaman kerja profesional' : null,
    !hasPhoto ? 'Pertimbangkan menambahkan foto profil profesional' : null
  ].filter(Boolean)

  const recommendations = [
    `Tambahkan kata kunci spesifik untuk bidang ${field} seperti: ${keywords.slice(0, 3).join(', ')}`,
    'Perkuat deskripsi pencapaian dengan angka dan metrik yang terukur',
    'Sesuaikan ringkasan profesional dengan job description target',
    strongSkills.length > 0 ? `Tonjolkan keahlian unggulan Anda: ${strongSkills.slice(0, 3).join(', ')}` : 'Tingkatkan level keahlian yang sudah ada',
    'Optimalkan format untuk ATS scanning dengan struktur yang konsisten'
  ]

  if (hasPhoto) {
    recommendations.push('Foto profil Anda sudah bagus, pastikan tetap profesional dan berkualitas tinggi')
  } else {
    recommendations.push('Pertimbangkan menambahkan foto profil profesional untuk memberikan kesan personal')
  }

  return {
    overallScore,
    atsCompatibility: Math.min(overallScore + 5, 98),
    keywordMatch,
    structureScore: hasPhoto ? 90 : 88, // Slight bonus for having photo
    contentQuality: overallScore - 5,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    recommendations: recommendations.slice(0, 5),
    improvedSummary: cvData.summary || `Profesional ${field === 'it' ? 'Teknologi Informasi' : field === 'engineering' ? 'Teknik' : 'Bisnis'} dengan fokus pada ${cvData.targetRole || 'pengembangan karir'}. Memiliki keahlian dalam ${(cvData.skills || []).slice(0, 3).map((s: any) => s.name).join(', ')} dan komitmen tinggi untuk menghasilkan solusi inovatif yang memberikan dampak positif bagi organisasi.`,
    skillAnalysis: {
      strongSkills: strongSkills.slice(0, 5),
      skillsToImprove: skillsToImprove.slice(0, 3),
      missingSkills: keywords.slice(0, 3)
    },
    improvedCV: {
      ...cvData,
      summary: cvData.summary || `Profesional ${field === 'it' ? 'Teknologi Informasi' : field === 'engineering' ? 'Teknik' : 'Bisnis'} dengan fokus pada ${cvData.targetRole || 'pengembangan karir'}. Memiliki keahlian dalam ${(cvData.skills || []).slice(0, 3).map((s: any) => s.name).join(', ')} dan komitmen tinggi untuk menghasilkan solusi inovatif yang memberikan dampak positif bagi organisasi.`
    }
  }
}
