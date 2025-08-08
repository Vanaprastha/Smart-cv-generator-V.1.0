'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, Loader2 } from 'lucide-react'

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

interface PDFGeneratorProps {
  cvData: CVData
}

export default function PDFGenerator({ cvData }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to download PDF')
        return
      }

      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>CV - ${cvData.personalInfo.fullName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
            }
            
            .header {
              display: flex;
              align-items: flex-start;
              margin-bottom: 30px;
              gap: 30px;
            }
            
            .photo {
              width: 120px;
              height: 120px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid #e5e7eb;
              flex-shrink: 0;
            }
            
            .photo-placeholder {
              width: 120px;
              height: 120px;
              border-radius: 8px;
              background: #f3f4f6;
              border: 2px solid #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #9ca3af;
              font-size: 14px;
              flex-shrink: 0;
            }
            
            .header-info {
              flex: 1;
            }
            
            .name {
              font-size: 32px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .title {
              font-size: 18px;
              color: #6b7280;
              margin-bottom: 20px;
              font-weight: 500;
            }
            
            .contact-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              font-size: 14px;
              color: #4b5563;
            }
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .section {
              margin-bottom: 25px;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 5px;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            
            .summary {
              text-align: justify;
              line-height: 1.7;
              color: #374151;
            }
            
            .skills-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            }
            
            .skill-category {
              margin-bottom: 15px;
            }
            
            .skill-category-title {
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
              font-size: 16px;
            }
            
            .skill-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
              padding: 4px 0;
            }
            
            .skill-name {
              font-size: 14px;
              color: #374151;
            }
            
            .skill-level {
              font-size: 12px;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 12px;
              color: #6b7280;
            }
            
            .experience-item, .education-item, .project-item {
              margin-bottom: 20px;
              padding-left: 20px;
              border-left: 2px solid #e5e7eb;
              position: relative;
            }
            
            .experience-item::before, .education-item::before, .project-item::before {
              content: '';
              position: absolute;
              left: -6px;
              top: 5px;
              width: 10px;
              height: 10px;
              background: #9ca3af;
              border-radius: 50%;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            
            .item-title {
              font-weight: bold;
              color: #1f2937;
              font-size: 16px;
            }
            
            .item-subtitle {
              color: #6b7280;
              font-weight: 500;
              margin-bottom: 4px;
            }
            
            .item-date {
              font-size: 12px;
              color: #9ca3af;
              white-space: nowrap;
            }
            
            .item-description {
              color: #4b5563;
              text-align: justify;
              line-height: 1.6;
              font-size: 14px;
            }
            
            .gpa {
              font-size: 12px;
              color: #6b7280;
            }
            
            .project-link {
              font-size: 12px;
              color: #3b82f6;
              text-decoration: none;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 15mm;
              }
              
              .section {
                page-break-inside: avoid;
              }
              
              .experience-item, .education-item, .project-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            ${cvData.personalInfo.photo ? 
              `<img src="${cvData.personalInfo.photo}" alt="Profile Photo" class="photo">` :
              `<div class="photo-placeholder">No Photo</div>`
            }
            <div class="header-info">
              <h1 class="name">${cvData.personalInfo.fullName || 'Nama Lengkap'}</h1>
              ${cvData.targetRole ? `<div class="title">${cvData.targetRole}</div>` : ''}
              <div class="contact-info">
                ${cvData.personalInfo.email ? `<div class="contact-item">📧 ${cvData.personalInfo.email}</div>` : ''}
                ${cvData.personalInfo.phone ? `<div class="contact-item">📱 ${cvData.personalInfo.phone}</div>` : ''}
                ${cvData.personalInfo.location ? `<div class="contact-item">📍 ${cvData.personalInfo.location}</div>` : ''}
                ${cvData.personalInfo.linkedin ? `<div class="contact-item">💼 ${cvData.personalInfo.linkedin}</div>` : ''}
                ${cvData.personalInfo.github ? `<div class="contact-item">🔗 ${cvData.personalInfo.github}</div>` : ''}
                ${cvData.personalInfo.portfolio ? `<div class="contact-item">🌐 ${cvData.personalInfo.portfolio}</div>` : ''}
              </div>
            </div>
          </div>

          <!-- Summary -->
          ${cvData.summary ? `
            <div class="section">
              <h2 class="section-title">Ringkasan Profesional</h2>
              <div class="summary">${cvData.summary}</div>
            </div>
          ` : ''}

          <!-- Skills -->
          ${cvData.skills.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Keahlian</h2>
              <div class="skills-grid">
                ${Object.entries(cvData.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, any[]>)).map(([category, skills]) => `
                  <div class="skill-category">
                    <div class="skill-category-title">${category}</div>
                    ${skills.map(skill => `
                      <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][skill.level]}</span>
                      </div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Experience -->
          ${cvData.experiences.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Pengalaman Kerja</h2>
              ${cvData.experiences.map(exp => `
                <div class="experience-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${exp.position}</div>
                      <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-date">
                      ${formatDate(exp.startDate)} - ${exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${cvData.education.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Pendidikan</h2>
              ${cvData.education.map(edu => `
                <div class="education-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${edu.degree} - ${edu.field}</div>
                      <div class="item-subtitle">${edu.institution}</div>
                      ${edu.gpa ? `<div class="gpa">IPK: ${edu.gpa}</div>` : ''}
                    </div>
                    <div class="item-date">
                      ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Projects -->
          ${cvData.projects.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Proyek</h2>
              ${cvData.projects.map(project => `
                <div class="project-item">
                  <div class="item-header">
                    <div class="item-title">${project.name}</div>
                    ${project.link ? `<a href="${project.link}" class="project-link">🔗 Link</a>` : ''}
                  </div>
                  ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="footer">
            CV ini dibuat menggunakan Smart CV Generator - AI-Powered Resume Builder
          </div>
        </body>
        </html>
      `

      // Write content to new window
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          setIsGenerating(false)
        }, 500)
      }

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.')
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating || !cvData.personalInfo.fullName}
      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center space-x-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </>
      )}
    </Button>
  )
}
