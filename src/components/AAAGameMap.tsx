'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QuestMapDemo from './QuestMapComponent'

// Main component
export default function AAAGameMap() {
  const router = useRouter()

  const handleRouteNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="w-full h-full">
      <QuestMapDemo
        backgroundImageUrl="/black cipher map 5.png"
        routeTo={handleRouteNavigation}
        userId="demo-student"
        courseId="python-basics-2025"
      />
    </div>
  )
}