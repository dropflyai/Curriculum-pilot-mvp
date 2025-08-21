'use client'

import { useState } from 'react'
import { Book, Clock, Users, AlertCircle, CheckCircle, Star } from 'lucide-react'

interface TeacherPlaybookProps {
  lessonId: string
  title: string
}

export default function TeacherPlaybook({ lessonId, title }: TeacherPlaybookProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Week 1 Teacher Playbook content
  const getPlaybookContent = () => {
    if (lessonId === 'week-01') {
      return {
        title: 'Week 1: AI Classifier — School Supplies (Main) + Recycle Ethics (Bonus)',
        standards: [
          'SC.912.ET.2.2: Describe major branches of AI',
          'SC.912.ET.2.3: Evaluate the application of algorithms to AI', 
          'SC.912.ET.2.5: Describe major applications of AI & ML across fields'
        ],
        story: 'You are the school\'s AI quality engineer. Make a fair, reliable model.',
        openingActivities: [
          {
            title: 'Hook (2 min)',
            description: 'Hold up a pencil, eraser, marker. Ask: "Which is easiest for a computer to tell apart—and why?"'
          },
          {
            title: 'Big idea (2 min)',
            description: 'AI learns from examples (training) and makes predictions (inference).'
          },
          {
            title: 'Plan (1 min)',
            description: 'Train fast → read metrics → improve the dataset → retrain.'
          },
          {
            title: 'Ethics checkpoint (2 min)',
            description: '"Fairness = representative data. What could be missing?"'
          },
          {
            title: 'Expectations (3 min)',
            description: 'Pair roles—Data Curator (chooses removals) / Model Tester (reads metrics). Respect images; stay on task.'
          }
        ],
        coachingPrompts: [
          '"Which class is hardest in your confusion matrix? Why might that be?"',
          '"If you had 10 more images to add, which under-represented cases would you pick?"',
          '"Show me your before/after metrics—what improved besides overall accuracy?"'
        ],
        whenStuck: [
          'Remind pairs to remove ≥5 low-quality/duplicate images.',
          'Have them explain "training" vs "inference" in 1 sentence each.'
        ],
        commonMisconceptions: [
          {
            misconception: '"Accuracy went up so we\'re done."',
            response: '"Check per-class accuracy—who is being mis-served?"'
          },
          {
            misconception: '"The model is biased on purpose."',
            response: '"Bias often comes from unbalanced / low-variety data."'
          },
          {
            misconception: '"Add more of the easiest class."',
            response: '"That can inflate accuracy but hurt fairness."'
          }
        ],
        closingActivities: [
          '2 volunteer teams show their before/after metrics.',
          'Exit ticket: One metric insight + one mitigation you used (or would use next).'
        ],
        homeworkGuidance: [
          'Main (≈45 min): Complete mini-project (choose rebalance, quality cleanup, or add a small 4th label), make pre/post screenshot(s), and record a 90-sec reflection.',
          'Bonus (≈10–15 min, optional): Ethics & Impact memo tied to Bonus metrics.',
          'Portfolio (≈5 min): Upload screenshot(s) + 2–3 sentence reflection.'
        ],
        successCriteria: [
          'Student portfolio shows 1–2 screenshots (metrics before/after)',
          '90-sec audio/video note',
          '(Bonus) ethics memo',
          'badge(s) earned',
          'Teacher dashboard: roster view lists % tabs complete, quiz score, submission received, and badge awarded'
        ]
      }
    }
    
    // Default playbook for other lessons
    return {
      title: `Teacher Playbook: ${title}`,
      standards: [],
      story: 'Standard lesson implementation guide.',
      openingActivities: [],
      coachingPrompts: [],
      whenStuck: [],
      commonMisconceptions: [],
      closingActivities: [],
      homeworkGuidance: [],
      successCriteria: []
    }
  }
  
  const playbook = getPlaybookContent()
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Book className="h-4 w-4" />
        Teacher Playbook
      </button>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{playbook.title}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Standards */}
        {playbook.standards.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Standards Alignment
            </h3>
            <div className="space-y-2">
              {playbook.standards.map((standard, index) => (
                <div key={index} className="bg-gray-700 rounded px-3 py-2 text-gray-300 text-sm">
                  {standard}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Story */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Today's Story</h3>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 italic">"{playbook.story}"</p>
          </div>
        </div>
        
        {/* Opening Activities */}
        {playbook.openingActivities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              10-minute Opening (Live)
            </h3>
            <div className="space-y-3">
              {playbook.openingActivities.map((activity, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{activity.title}</h4>
                  <p className="text-gray-300 text-sm">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Coaching Prompts */}
        {playbook.coachingPrompts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              During 60-min Platform Block (Coach, Don't Lecture)
            </h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Use short prompts while circulating:</h4>
              <ul className="space-y-2">
                {playbook.coachingPrompts.map((prompt, index) => (
                  <li key={index} className="text-gray-300 text-sm">
                    • {prompt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* When Stuck */}
        {playbook.whenStuck.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              When Stuck:
            </h4>
            <ul className="space-y-2">
              {playbook.whenStuck.map((solution, index) => (
                <li key={index} className="text-gray-300 text-sm bg-gray-700 rounded px-3 py-2">
                  • {solution}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Common Misconceptions */}
        {playbook.commonMisconceptions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Common Misconceptions (and Responses)
            </h3>
            <div className="space-y-3">
              {playbook.commonMisconceptions.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-red-300 font-medium mb-2">❌ {item.misconception}</div>
                  <div className="text-green-300">✅ {item.response}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Closing Activities */}
        {playbook.closingActivities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">5-minute Close</h3>
            <ul className="space-y-2">
              {playbook.closingActivities.map((activity, index) => (
                <li key={index} className="text-gray-300 text-sm bg-gray-700 rounded px-3 py-2">
                  • {activity}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Homework Guidance */}
        {playbook.homeworkGuidance.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Student Homework (~60 min)</h3>
            <div className="space-y-2">
              {playbook.homeworkGuidance.map((guidance, index) => (
                <div key={index} className="bg-gray-700 rounded px-3 py-2 text-gray-300 text-sm">
                  • {guidance}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Success Criteria */}
        {playbook.successCriteria.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              What "Done" Looks Like
            </h3>
            <div className="space-y-2">
              {playbook.successCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-3 bg-green-900/20 border border-green-500/30 rounded px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-green-200 text-sm">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}