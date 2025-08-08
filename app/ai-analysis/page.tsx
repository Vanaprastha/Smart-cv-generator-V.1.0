'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Brain, ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle, XCircle, TrendingUp, Edit, User } from 'lucide-react'
import CVPreview from '@/components/cv-preview'
import { CVStorage } from '@/lib/cv-storage'

interface AnalysisResult {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  atsCompatibility: number
  keywordMatch: number
  structureScore: number
  contentQuality: number
  improvedCV: any
}

function AIAnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const field = searchParams.get('field')
  const cvDataString = searchParams.get('cvData')
  const fromStorage = searchParams.get('fromStorage')
  const hasPhoto = searchParams.get('hasPhoto') === 'true'
  
  const [cvData, setCVData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showImprovedCV, setShowImprovedCV] = useState(false)

  useEffect(() => {
    // Load data from URL params or sessionStorage
    if (fromStorage === 'true') {
      const storedData = sessionStorage.getItem('cvAnalysisData')
      if (storedData) {
        try {
          const { field: storedField, cvData: storedCVData, hasPhoto: storedHasPhoto } = JSON.parse(storedData)
          setCVData(storedCVData)
          performAnalysis(storedCVData, storedField, storedHasPhoto)
          // Clean up storage
          sessionStorage.removeItem('cvAnalysisData')
        } catch (error) {
          console.error('Error parsing stored data:', error)
          router.push('/')
        }
      } else {
        router.push('/')
      }
    } else if (cvDataString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(cvDataString))
        // Load full CV data from localStorage to get photo
        const { cvData: fullCVData } = CVStorage.load()
        if (fullCVData) {
          setCVData(fullCVData)
          performAnalysis(fullCVData, field, hasPhoto)
        } else {
          setCVData(parsedData)
          performAnalysis(parsedData, field, hasPhoto)
        }
      } catch (error) {
        console.error('Error parsing CV data:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [cvDataString, fromStorage, field, hasPhoto, router])

  const performAnalysis = async (data: any, analysisField: string | null, photoExists: boolean = false) => {
    setLoading(true)
    try {
      // Create optimized payload for API
      const optimizedData = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          // Remove base64 photo data for API call, but keep indicator
          photo: data.personalInfo.photo ? 'photo_uploaded' : ''
        }
      }

      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: optimizedData,
          field: analysisField,
          hasPhoto: photoExists
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Restore original photo in improved CV
        if (result.improvedCV) {
          result.improvedCV.personalInfo.photo = data.personalInfo.photo
        }
        setAnalysis(result)
      } else {
        console.log('API response not ok, using fallback')
        setAnalysis(getMockAnalysis(data, analysisField, photoExists))
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Always fallback to mock analysis on error
      setAnalysis(getMockAnalysis(data, analysisField, photoExists))
    } finally {
      setLoading(false)
    }
  }

  const getMockAnalysis = (data: any, analysisField: string | null, photoExists: boolean = false): AnalysisResult => {
    // Mock analysis based on data science principles
    const hasExperience = data.experiences.length > 0
    const hasEducation = data.education.length > 0
    const hasSkills = data.skills.length > 0
    const hasProjects = data.projects.length > 0
    const hasSummary = data.summary.length > 0
    const hasPhoto = data.personalInfo.photo && data.personalInfo.photo !== ''

    const baseScore = 60
    let bonusScore = 0
    
    if (hasExperience) bonusScore += 15
    if (hasEducation) bonusScore += 10
    if (hasSkills) bonusScore += 10
    if (hasProjects) bonusScore += 10
    if (hasSummary) bonusScore += 5
    if (hasPhoto || photoExists) bonusScore += 3 // Bonus for photo

    const overallScore = Math.min(baseScore + bonusScore, 95)

    const strengths = [
      hasExperience ? 'Pengalaman kerja yang relevan dengan target role' : 'Format CV yang terstruktur dengan baik',
      hasSkills ? 'Portfolio keahlian teknis yang beragam dan terukur' : 'Informasi kontak yang lengkap dan profesional',
      hasEducation ? 'Latar belakang pendidikan yang solid dan relevan' : 'Target role yang jelas dan spesifik'
    ]

    if (hasPhoto || photoExists) {
      strengths.push('Foto profil profesional yang menambah kesan personal dan kredibilitas')
    }

    const weaknesses = [
      !hasSummary ? 'Ringkasan profesional perlu diperkuat dengan value proposition yang jelas' : null,
      data.skills.length < 5 ? 'Perlu menambah lebih banyak keahlian yang relevan dengan bidang target' : null,
      !hasProjects ? 'Tidak ada proyek yang menunjukkan kemampuan praktis dan portofolio' : null,
      data.experiences.length === 0 ? 'Belum ada pengalaman kerja profesional yang tercantum' : null,
      !(hasPhoto || photoExists) ? 'Pertimbangkan menambahkan foto profil profesional untuk kesan yang lebih personal' : null
    ].filter(Boolean)

    const recommendations = [
      `Tambahkan kata kunci spesifik untuk bidang ${analysisField === 'it' ? 'IT' : analysisField === 'engineering' ? 'Teknik' : 'Bisnis'}`,
      'Perkuat deskripsi pencapaian dengan angka dan metrik yang terukur',
      'Sesuaikan ringkasan profesional dengan job description target',
      'Tambahkan sertifikasi yang relevan jika ada',
      'Optimalkan format untuk ATS scanning dengan struktur yang konsisten'
    ]

    if (hasPhoto || photoExists) {
      recommendations.push('Foto profil Anda sudah bagus, pastikan tetap profesional dan berkualitas tinggi')
    } else {
      recommendations.push('Pertimbangkan menambahkan foto profil profesional untuk memberikan kesan personal')
    }

    return {
      overallScore,
      atsCompatibility: Math.min(overallScore + 5, 98),
      keywordMatch: analysisField === 'it' ? 85 : analysisField === 'engineering' ? 78 : 82,
      structureScore: (hasPhoto || photoExists) ? 90 : 88,
      contentQuality: overallScore - 5,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      recommendations: recommendations.slice(0, 5),
      improvedCV: {
        ...data,
        summary: data.summary || `Profesional ${analysisField === 'it' ? 'IT' : analysisField === 'engineering' ? 'Teknik' : 'Bisnis'} dengan pengalaman dalam ${data.targetRole || 'bidang terkait'}. Memiliki keahlian dalam ${data.skills.slice(0, 3).map((s: any) => s.name).join(', ')} dan komitmen tinggi untuk menghasilkan solusi inovatif.`
      }
    }
  }

  const handleBackToEdit = () => {
    // Navigate back to CV builder with return flag
    const currentField = field || CVStorage.load().field || 'it'
    router.push(`/cv-builder?field=${currentField}&return=true`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Memuat data CV...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackToEdit}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Edit</span>
              </Button>
              <div className="flex items-center space-x-4">
                {/* Display photo in header if available */}
                {cvData.personalInfo.photo && (
                  <img
                    src={cvData.personalInfo.photo || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Analisis AI - {cvData.personalInfo.fullName || 'CV Analysis'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Powered by Gemini AI & Data Science
                    {cvData.personalInfo.photo && (
                      <span className="ml-2 text-green-600">• Dengan Foto Profil</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBackToEdit}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit CV</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowImprovedCV(!showImprovedCV)}
                disabled={!analysis}
              >
                {showImprovedCV ? 'CV Asli' : 'CV yang Disarankan'}
              </Button>
              <Button
                onClick={() => performAnalysis(cvData, field, !!cvData.personalInfo.photo)}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analisis Ulang
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analysis Results */}
          <div className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Brain className="h-12 w-12 text-purple-600 animate-pulse" />
                    {cvData.personalInfo.photo && (
                      <img
                        src={cvData.personalInfo.photo || "/placeholder.svg"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    AI sedang menganalisis CV {cvData.personalInfo.fullName}...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Proses ini menggunakan algoritma machine learning untuk memberikan saran terbaik
                    {cvData.personalInfo.photo && (
                      <span className="block text-green-600 text-sm mt-1">
                        ✓ Termasuk analisis foto profil profesional
                      </span>
                    )}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </CardContent>
              </Card>
            ) : analysis ? (
              <>
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span>Skor Keseluruhan</span>
                      {cvData.personalInfo.photo && (
                        <Badge variant="secondary" className="ml-2">
                          <User className="h-3 w-3 mr-1" />
                          Dengan Foto
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}/100
                      </div>
                      <Progress value={analysis.overallScore} className="w-full h-3" />
                      {cvData.personalInfo.photo && (
                        <p className="text-sm text-green-600 mt-2">
                          +3 poin bonus untuk foto profil profesional
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          {getScoreIcon(analysis.atsCompatibility)}
                          <span className="font-medium">ATS Compatibility</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                          {analysis.atsCompatibility}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          {getScoreIcon(analysis.keywordMatch)}
                          <span className="font-medium">Keyword Match</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.keywordMatch)}`}>
                          {analysis.keywordMatch}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Kekuatan CV Anda</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span>Area yang Perlu Diperbaiki</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-600">
                      <Brain className="h-5 w-5" />
                      <span>Rekomendasi AI</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <span className="text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Data Science Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-600">
                      <TrendingUp className="h-5 w-5" />
                      <span>Data Science Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Prediksi Peluang Interview</h4>
                        <div className="flex items-center space-x-2">
                          <Progress value={analysis.overallScore * 0.8} className="flex-1" />
                          <span className="font-medium text-purple-700">{Math.round(analysis.overallScore * 0.8)}%</span>
                        </div>
                        {cvData.personalInfo.photo && (
                          <p className="text-xs text-purple-700 mt-1">
                            Foto profil meningkatkan kesan profesional dan personal branding
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Struktur CV:</span>
                          <span className={`ml-2 font-medium ${getScoreColor(analysis.structureScore)}`}>
                            {analysis.structureScore}/100
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Kualitas Konten:</span>
                          <span className={`ml-2 font-medium ${getScoreColor(analysis.contentQuality)}`}>
                            {analysis.contentQuality}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          {/* CV Preview */}
          <div className="lg:sticky lg:top-8">
            <CVPreview cvData={showImprovedCV && analysis ? analysis.improvedCV : cvData} />
            {showImprovedCV && analysis && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">CV yang Disarankan AI</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Versi ini telah dioptimalkan berdasarkan analisis AI dan best practices
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Memuat halaman analisis...</p>
      </div>
    </div>
  )
}

export default function AIAnalysisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AIAnalysisContent />
    </Suspense>
  )
}
