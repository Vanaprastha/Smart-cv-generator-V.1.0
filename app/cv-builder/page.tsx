'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Eye, Brain, ArrowLeft, Upload, X, AlertCircle, Save, RotateCcw } from 'lucide-react'
import CVPreview from '@/components/cv-preview'
import SkillsVisualization from '@/components/skills-visualization'
import PDFGenerator from '@/components/pdf-generator'
import { CVStorage, getEmptyCVData, type CVData } from '@/lib/cv-storage'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  photo: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
}

function CVBuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fieldParam = searchParams.get('field')
  const returnFromAnalysis = searchParams.get('return') === 'true'
  
  const [field, setField] = useState<string>('')
  const [cvData, setCVData] = useState<CVData>(getEmptyCVData())
  const [newSkill, setNewSkill] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load saved data on component mount
  useEffect(() => {
    const { cvData: savedCVData, field: savedField } = CVStorage.load()
    
    if (returnFromAnalysis && savedCVData && savedField) {
      // Returning from analysis - load saved data
      setCVData(savedCVData)
      setField(savedField)
      console.log('Loaded CV data from storage (returning from analysis)')
    } else if (fieldParam) {
      // New session with field parameter
      setField(fieldParam)
      if (savedCVData && savedField === fieldParam) {
        // Load existing data for same field
        setCVData(savedCVData)
        console.log('Loaded existing CV data for field:', fieldParam)
      } else {
        // Start fresh for new field
        const emptyData = getEmptyCVData()
        setCVData(emptyData)
        CVStorage.save(emptyData, fieldParam)
        console.log('Started fresh CV for field:', fieldParam)
      }
    } else {
      // No field parameter - redirect to home
      router.push('/')
    }
  }, [fieldParam, returnFromAnalysis, router])

  // Auto-save CV data when it changes
  useEffect(() => {
    if (field && cvData.personalInfo.fullName) {
      setAutoSaving(true)
      const saveTimeout = setTimeout(() => {
        CVStorage.save(cvData, field)
        setLastSaved(new Date())
        setAutoSaving(false)
      }, 1000) // Auto-save after 1 second of inactivity

      return () => clearTimeout(saveTimeout)
    }
  }, [cvData, field])

  // Manual save function
  const handleManualSave = () => {
    CVStorage.save(cvData, field)
    setLastSaved(new Date())
    console.log('CV data manually saved')
  }

  // Clear all data and start fresh
  const handleStartFresh = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data dan mulai dari awal?')) {
      CVStorage.clear()
      setCVData(getEmptyCVData())
      setLastSaved(null)
      console.log('CV data cleared, starting fresh')
    }
  }

  // Handle photo upload with better error handling and size optimization
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoError('')
    
    // Check file size (max 1MB for better performance)
    if (file.size > 1 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 1MB untuk performa optimal')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('File harus berupa gambar (JPG, PNG, GIF)')
      return
    }

    setPhotoUploading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const result = e.target?.result as string
      
      // Create image to get dimensions and optimize
      const img = new Image()
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set max dimensions
        const maxWidth = 400
        const maxHeight = 400
        
        let { width, height } = img
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        setCVData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, photo: compressedDataUrl }
        }))
        setPhotoUploading(false)
      }
      
      img.onerror = () => {
        setPhotoError('Gagal memproses gambar')
        setPhotoUploading(false)
      }
      
      img.src = result
    }
    
    reader.onerror = () => {
      setPhotoError('Gagal membaca file')
      setPhotoUploading(false)
    }
    
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: '' }
    }))
    setPhotoError('')
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setCVData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    }
    setCVData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.find(s => s.name === newSkill.trim())) {
      setCVData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: 3, category: 'Programming Languages' }]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillName: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName)
    }))
  }

  // Enhanced analyze function with data persistence
  const handleAnalyze = async () => {
    // Validate required fields
    if (!cvData.personalInfo.fullName || !cvData.targetRole) {
      alert('Mohon lengkapi nama lengkap dan target role sebelum analisis')
      return
    }

    // Save current data before navigation
    CVStorage.save(cvData, field)
    console.log('CV data saved before analysis')

    // Create optimized data for analysis (remove large photo data)
    const optimizedCVData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        // Keep photo info but reduce size for API call
        photo: cvData.personalInfo.photo ? 'photo_uploaded' : ''
      }
    }

    try {
      const queryParams = new URLSearchParams({
        field: field || '',
        cvData: JSON.stringify(optimizedCVData),
        hasPhoto: cvData.personalInfo.photo ? 'true' : 'false' // Add photo indicator
      })
      
      // Check if URL is too long (browser limit ~2000 chars)
      const url = `/ai-analysis?${queryParams.toString()}`
      if (url.length > 2000) {
        // Use sessionStorage for large data
        sessionStorage.setItem('cvAnalysisData', JSON.stringify({
          field: field || '',
          cvData: cvData, // Use original data with photo
          hasPhoto: !!cvData.personalInfo.photo
        }))
        router.push('/ai-analysis?fromStorage=true')
      } else {
        router.push(url)
      }
    } catch (error) {
      console.error('Error preparing analysis:', error)
      alert('Terjadi kesalahan saat mempersiapkan analisis. Silakan coba lagi.')
    }
  }

  const getFieldTitle = (fieldId: string) => {
    const fieldMap: { [key: string]: string } = {
      'it': 'Teknologi Informasi',
      'engineering': 'Teknik',
      'business': 'Ekonomi & Bisnis'
    }
    return fieldMap[fieldId] || 'Unknown Field'
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Baru saja'
    if (minutes < 60) return `${minutes} menit yang lalu`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} jam yang lalu`
    
    return date.toLocaleDateString('id-ID')
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
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Bidang: {getFieldTitle(field)}</span>
                  {lastSaved && (
                    <span className="flex items-center space-x-1">
                      <Save className="h-3 w-3" />
                      <span>Tersimpan {formatLastSaved(lastSaved)}</span>
                    </span>
                  )}
                  {autoSaving && (
                    <span className="flex items-center space-x-1 text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span>Menyimpan...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartFresh}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Mulai Ulang</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Simpan</span>
              </Button>
              <PDFGenerator cvData={cvData} />
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Sembunyikan' : 'Tampilkan'} Preview</span>
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!cvData.personalInfo.fullName || !cvData.targetRole}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>Analisis dengan AI</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Data Status Card */}
            {CVStorage.exists() && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Data CV tersimpan otomatis
                      </span>
                    </div>
                    {lastSaved && (
                      <span className="text-xs text-blue-700">
                        Terakhir disimpan: {formatLastSaved(lastSaved)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Target Role */}
            <Card>
              <CardHeader>
                <CardTitle>Target Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="targetRole">Posisi yang Diinginkan</Label>
                    <Input
                      id="targetRole"
                      value={cvData.targetRole}
                      onChange={(e) => setCVData(prev => ({ ...prev, targetRole: e.target.value }))}
                      placeholder="e.g., Senior Data Scientist, Full Stack Developer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Photo Upload Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <Label className="text-center">Foto Profil (Opsional)</Label>
                    
                    {cvData.personalInfo.photo ? (
                      <div className="relative">
                        <img
                          src={cvData.personalInfo.photo || "/placeholder.svg"}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                        />
                        <Button
                          onClick={removePhoto}
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Foto</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={photoUploading}
                      />
                      <Button
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        variant="outline"
                        size="sm"
                        disabled={photoUploading}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{photoUploading ? 'Uploading...' : 'Pilih Foto'}</span>
                      </Button>
                      {cvData.personalInfo.photo && (
                        <Button
                          onClick={removePhoto}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                    
                    {photoError && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{photoError}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 text-center">
                      Format: JPG, PNG, GIF. Maksimal 1MB.<br />
                      Foto akan dioptimalkan untuk performa terbaik.
                    </p>
                  </div>

                  <Separator />

                  {/* Personal Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap</Label>
                      <Input
                        id="fullName"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Lokasi</Label>
                      <Input
                        id="location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                        }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={cvData.personalInfo.github}
                        onChange={(e) => setCVData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, github: e.target.value }
                        }))}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={cvData.summary}
                  onChange={(e) => setCVData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Tulis ringkasan singkat tentang pengalaman dan keahlian Anda..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pengalaman Kerja</CardTitle>
                  <Button onClick={addExperience} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cvData.experiences.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Pengalaman {index + 1}</h4>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Perusahaan</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Posisi</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Tanggal Mulai</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Tanggal Selesai</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          />
                          <Label htmlFor={`current-${exp.id}`}>Masih bekerja di sini</Label>
                        </div>
                        <Label>Deskripsi Pekerjaan</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pendidikan</CardTitle>
                  <Button onClick={addEducation} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Pendidikan {index + 1}</h4>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institusi</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Gelar</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Jurusan</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>IPK</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="3.75"
                          />
                        </div>
                        <div>
                          <Label>Tahun Mulai</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Tahun Lulus</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <SkillsVisualization
              skills={cvData.skills}
              onSkillsChange={(skills) => setCVData(prev => ({ ...prev, skills }))}
            />

            {/* Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Proyek</CardTitle>
                  <Button onClick={addProject} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cvData.projects.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Proyek {index + 1}</h4>
                        <Button
                          onClick={() => removeProject(project.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Nama Proyek</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Deskripsi</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Link Proyek</Label>
                          <Input
                            value={project.link}
                            onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-8">
              <CVPreview cvData={cvData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat CV Builder...</p>
      </div>
    </div>
  )
}

export default function CVBuilderPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CVBuilderContent />
    </Suspense>
  )
}
