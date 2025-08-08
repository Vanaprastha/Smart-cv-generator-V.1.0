'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2, BarChart3, Star, TrendingUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Skill {
  name: string
  level: number
  category: string
}

interface SkillsVisualizationProps {
  skills: Skill[]
  onSkillsChange: (skills: Skill[]) => void
}

const skillCategories = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Technologies',
  'Soft Skills',
  'Languages',
  'Certifications'
]

const skillLevels = [
  { value: 1, label: 'Beginner', color: 'bg-red-500' },
  { value: 2, label: 'Basic', color: 'bg-orange-500' },
  { value: 3, label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 4, label: 'Advanced', color: 'bg-blue-500' },
  { value: 5, label: 'Expert', color: 'bg-green-500' }
]

export default function SkillsVisualization({ skills, onSkillsChange }: SkillsVisualizationProps) {
  const [newSkill, setNewSkill] = useState({ name: '', level: 3, category: 'Programming Languages' })
  const [viewMode, setViewMode] = useState<'list' | 'chart' | 'radar'>('list')

  const addSkill = () => {
    if (newSkill.name.trim() && !skills.find(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      onSkillsChange([...skills, { ...newSkill, name: newSkill.name.trim() }])
      setNewSkill({ name: '', level: 3, category: 'Programming Languages' })
    }
  }

  const removeSkill = (skillName: string) => {
    onSkillsChange(skills.filter(s => s.name !== skillName))
  }

  const updateSkillLevel = (skillName: string, level: number) => {
    onSkillsChange(skills.map(s => s.name === skillName ? { ...s, level } : s))
  }

  const getSkillsByCategory = () => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, Skill[]>)
    return grouped
  }

  const getLevelColor = (level: number) => {
    return skillLevels.find(l => l.value === level)?.color || 'bg-gray-500'
  }

  const getLevelLabel = (level: number) => {
    return skillLevels.find(l => l.value === level)?.label || 'Unknown'
  }

  const getAverageSkillLevel = () => {
    if (skills.length === 0) return 0
    return Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length * 20)
  }

  const renderListView = () => {
    const groupedSkills = getSkillsByCategory()
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{category}</span>
              <Badge variant="outline">{categorySkills.length}</Badge>
            </h4>
            <div className="grid gap-3">
              {categorySkills.map((skill) => (
                <div key={skill.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {getLevelLabel(skill.level)}
                        </Badge>
                        <Button
                          onClick={() => removeSkill(skill.name)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={skill.level * 20} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-8">{skill.level * 20}%</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => updateSkillLevel(skill.name, level)}
                          className={`w-4 h-4 rounded-full border-2 transition-colors ${
                            level <= skill.level
                              ? `${getLevelColor(level)} border-transparent`
                              : 'bg-gray-200 border-gray-300 hover:border-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderChartView = () => {
    const categoryStats = Object.entries(getSkillsByCategory()).map(([category, categorySkills]) => ({
      category,
      count: categorySkills.length,
      avgLevel: categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length
    }))

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map(({ category, count, avgLevel }) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <Badge variant="outline">{count} skills</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={(count / skills.length) * 100} className="flex-1 h-2" />
                      <span className="text-xs text-gray-600">
                        {Math.round((count / skills.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillLevels.map(({ value, label, color }) => {
                  const count = skills.filter(s => s.level === value).length
                  return (
                    <div key={value} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Badge variant="outline">{count} skills</Badge>
                      </div>
                      <Progress value={skills.length > 0 ? (count / skills.length) * 100 : 0} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
                <div className="text-sm text-blue-700">Total Skills</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getAverageSkillLevel()}%</div>
                <div className="text-sm text-green-700">Average Level</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(getSkillsByCategory()).length}
                </div>
                <div className="text-sm text-purple-700">Categories</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {skills.filter(s => s.level >= 4).length}
                </div>
                <div className="text-sm text-orange-700">Expert Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Keahlian & Visualisasi</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'chart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('chart')}
            >
              Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Skill */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Tambah Keahlian Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="skillName">Nama Keahlian</Label>
                <Input
                  id="skillName"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., React.js"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
              </div>
              <div>
                <Label htmlFor="skillCategory">Kategori</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skillLevel">Level (1-5)</Label>
                <Select
                  value={newSkill.level.toString()}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(({ value, label }) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addSkill} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </div>
            </div>
          </div>

          {/* Skills Display */}
          {skills.length > 0 ? (
            viewMode === 'list' ? renderListView() : renderChartView()
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada keahlian yang ditambahkan</p>
              <p className="text-sm">Tambahkan keahlian untuk melihat visualisasi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
