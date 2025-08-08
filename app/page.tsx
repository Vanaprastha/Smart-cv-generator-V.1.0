'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Code, Cog, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const fields = [
  {
    id: 'it',
    title: 'Teknologi Informasi',
    description: 'Teknik Informatika & Data Science',
    icon: Code,
    color: 'bg-blue-500',
    specializations: ['Software Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Full Stack Developer', 'DevOps Engineer'],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'engineering',
    title: 'Teknik',
    description: 'Material, Metalurgi, Kimia, Elektro & Komputer',
    icon: Cog,
    color: 'bg-orange-500',
    specializations: ['Process Engineer', 'Materials Engineer', 'Chemical Engineer', 'Electrical Engineer', 'Computer Engineer'],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'business',
    title: 'Ekonomi & Bisnis',
    description: 'Manajemen, Keuangan & Analisis Bisnis',
    icon: TrendingUp,
    color: 'bg-green-500',
    specializations: ['Business Analyst', 'Financial Analyst', 'Product Manager', 'Marketing Manager', 'Operations Manager'],
    gradient: 'from-green-500 to-emerald-500'
  }
]

export default function HomePage() {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedField) {
      router.push(`/cv-builder?field=${selectedField}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart CV Generator</h1>
              <p className="text-sm text-gray-600">AI-Powered Resume Optimization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Powered by Data Science & AI</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Buat CV yang <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ATS-Friendly</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih bidang keahlian Anda dan biarkan AI menganalisis serta mengoptimalkan CV Anda 
            untuk meningkatkan peluang diterima kerja hingga 3x lipat
          </p>
        </div>

        {/* Field Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Pilih Bidang Keahlian Anda
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {fields.map((field) => {
              const Icon = field.icon
              const isSelected = selectedField === field.id
              
              return (
                <Card 
                  key={field.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected 
                      ? 'ring-2 ring-purple-500 shadow-lg transform scale-105' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${field.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{field.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {field.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-3">Spesialisasi Populer:</p>
                      <div className="flex flex-wrap gap-2">
                        {field.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {field.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{field.specializations.length - 3} lainnya
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Continue Button */}
        {selectedField && (
          <div className="text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Lanjutkan ke CV Builder
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">ATS-Optimized</h4>
            <p className="text-sm text-gray-600">Format yang dioptimalkan untuk sistem ATS perusahaan</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-600">Analisis mendalam dengan Gemini AI untuk saran perbaikan</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Data Science</h4>
            <p className="text-sm text-gray-600">Pendekatan berbasis data untuk optimasi CV</p>
          </div>
        </div>
      </div>
    </div>
  )
}
