'use client'

import { useState, useEffect, use } from 'react'
import StudentPortfolio from '@/components/StudentPortfolio'
import { portfolioEngine, StudentPortfolio as StudentPortfolioType } from '@/lib/portfolio-engine'

interface PublicPortfolioPageProps {
  params: Promise<{ userId: string }>
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const { userId } = use(params)
  const [portfolio, setPortfolio] = useState<StudentPortfolioType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPublicPortfolio()
  }, [userId])

  const loadPublicPortfolio = async () => {
    try {
      setLoading(true)
      const portfolioData = await portfolioEngine.generateStudentPortfolio(userId)
      
      // Check if portfolio is public
      if (!portfolioData.public) {
        setError('This portfolio is private')
        return
      }
      
      setPortfolio(portfolioData)
    } catch (error) {
      console.error('Error loading public portfolio:', error)
      setError('Portfolio not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio... 📁</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">{error}</h2>
          <p className="text-gray-300">This student's portfolio is not publicly available.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <StudentPortfolio userId={userId} viewMode="public" />
    </div>
  )
}