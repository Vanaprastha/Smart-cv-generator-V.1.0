// CV Data Storage Utility
export interface CVData {
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

const CV_STORAGE_KEY = 'smart-cv-data'
const CV_FIELD_KEY = 'smart-cv-field'

export const CVStorage = {
  // Save CV data to localStorage
  save: (cvData: CVData, field?: string) => {
    try {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData))
      if (field) {
        localStorage.setItem(CV_FIELD_KEY, field)
      }
      console.log('CV data saved to localStorage')
    } catch (error) {
      console.error('Failed to save CV data:', error)
    }
  },

  // Load CV data from localStorage
  load: (): { cvData: CVData | null, field: string | null } => {
    try {
      const savedData = localStorage.getItem(CV_STORAGE_KEY)
      const savedField = localStorage.getItem(CV_FIELD_KEY)
      
      if (savedData) {
        const cvData = JSON.parse(savedData) as CVData
        console.log('CV data loaded from localStorage')
        return { cvData, field: savedField }
      }
    } catch (error) {
      console.error('Failed to load CV data:', error)
    }
    
    return { cvData: null, field: null }
  },

  // Clear CV data from localStorage
  clear: () => {
    try {
      localStorage.removeItem(CV_STORAGE_KEY)
      localStorage.removeItem(CV_FIELD_KEY)
      console.log('CV data cleared from localStorage')
    } catch (error) {
      console.error('Failed to clear CV data:', error)
    }
  },

  // Check if CV data exists
  exists: (): boolean => {
    try {
      return localStorage.getItem(CV_STORAGE_KEY) !== null
    } catch (error) {
      return false
    }
  }
}

// Default empty CV data
export const getEmptyCVData = (): CVData => ({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: ''
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  targetRole: ''
})
