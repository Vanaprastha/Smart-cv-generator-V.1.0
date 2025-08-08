import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, User } from 'lucide-react'

interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    portfolio: string
    photo: string
  }
  summary: string
  experiences: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
  }>
  skills: Array<{
    name: string
    level: number
    category: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    link: string
  }>
  targetRole: string
}

interface CVPreviewProps {
  cvData: CVData
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Preview CV</span>
          <Badge variant="outline">ATS-Friendly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-8 shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Header with Photo */}
          <div className="flex items-start space-x-6 mb-6">
            {/* Photo Section */}
            <div className="flex-shrink-0">
              {cvData.personalInfo.photo ? (
                <img
                  src={cvData.personalInfo.photo || "/placeholder.svg"}
                  alt={cvData.personalInfo.fullName || 'Profile Photo'}
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cvData.personalInfo.fullName || 'Nama Lengkap'}
              </h1>
              {cvData.targetRole && (
                <p className="text-lg text-gray-600 mb-4 font-medium">{cvData.targetRole}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                {cvData.personalInfo.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{cvData.personalInfo.email}</span>
                  </div>
                )}
                {cvData.personalInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{cvData.personalInfo.phone}</span>
                  </div>
                )}
                {cvData.personalInfo.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{cvData.personalInfo.location}</span>
                  </div>
                )}
                {cvData.personalInfo.linkedin && (
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{cvData.personalInfo.linkedin}</span>
                  </div>
                )}
                {cvData.personalInfo.github && (
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{cvData.personalInfo.github}</span>
                  </div>
                )}
                {cvData.personalInfo.portfolio && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{cvData.personalInfo.portfolio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Professional Summary */}
          {cvData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-gray-200 pb-1">
                RINGKASAN PROFESIONAL
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">{cvData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-gray-200 pb-1">
                KEAHLIAN
              </h2>
              <div className="space-y-4">
                {Object.entries(cvData.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, any[]>)).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-gray-800 text-sm">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill.name} variant="secondary" className="text-sm px-3 py-1">
                          {skill.name}
                          <span className="ml-1 text-xs opacity-75">
                            ({['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][skill.level]})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {cvData.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-1">
                PENGALAMAN KERJA
              </h2>
              <div className="space-y-5">
                {cvData.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-2 top-1"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1 md:mt-0">
                        <Calendar className="h-4 w-4" />
                        <span className="whitespace-nowrap">
                          {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                        </span>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed text-justify">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-1">
                PENDIDIKAN
              </h2>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-2 top-1"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree} - {edu.field}</h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">IPK: {edu.gpa}</p>}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1 md:mt-0">
                        <Calendar className="h-4 w-4" />
                        <span className="whitespace-nowrap">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cvData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-1">
                PROYEK
              </h2>
              <div className="space-y-5">
                {cvData.projects.map((project) => (
                  <div key={project.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-gray-400 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <div className="flex items-center space-x-1 text-sm text-blue-600">
                          <Globe className="h-4 w-4" />
                          <span>Link</span>
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mb-2 text-justify">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              CV ini dibuat menggunakan Smart CV Generator - AI-Powered Resume Builder
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
