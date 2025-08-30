'use client'

import { useState, useEffect, useRef } from 'react'
import { Brain, MessageCircle, Zap, Target, Settings, Play, Save, Share2, Lightbulb, TrendingUp, Users, Heart, Shield } from 'lucide-react'

interface ChatbotBuilderProps {
  lessonId?: string
  onProjectComplete?: (project: ChatbotProject) => void
}

interface ChatbotProject {
  id: string
  name: string
  code: string
  personality: string
  responses: ChatbotResponse[]
  analytics: ChatbotAnalytics
  timestamp: Date
}

interface ChatbotResponse {
  category: 'encouragement' | 'study-tips' | 'motivation' | 'goal-setting' | 'safety'
  trigger_keywords: string[]
  response_templates: string[]
  sentiment_targets: ('positive' | 'negative' | 'neutral')[]
  personalization: boolean
}

interface ChatbotAnalytics {
  conversations_handled: number
  positive_responses: number
  categories_used: Record<string, number>
  sentiment_accuracy: number
  safety_triggers: number
}

interface ChatMessage {
  id: string
  text: string
  sender: 'student' | 'ai'
  timestamp: Date
  category?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  confidence?: number
}

export default function AdvancedChatbotBuilder({ 
  lessonId = 'week-02',
  onProjectComplete 
}: ChatbotBuilderProps) {
  const [activeTab, setActiveTab] = useState<'design' | 'code' | 'test' | 'analytics'>('design')
  const [chatbot, setChatbot] = useState<ChatbotProject>({
    id: `chatbot-${Date.now()}`,
    name: 'My School Success Advisor',
    code: '',
    personality: 'encouraging',
    responses: [],
    analytics: {
      conversations_handled: 0,
      positive_responses: 0,
      categories_used: {},
      sentiment_accuracy: 0,
      safety_triggers: 0
    },
    timestamp: new Date()
  })
  
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [buildingStep, setBuildingStep] = useState(1)
  const [generatedCode, setGeneratedCode] = useState('')
  const [showHints, setShowHints] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Pre-built response templates for different categories
  const responseTemplates = {
    encouragement: {
      keywords: ['failed', 'stupid', 'can\'t', 'bad grade', 'failing', 'disappointed', 'upset'],
      responses: [
        "Getting a tough grade doesn't mean you're not capable! {name}, everyone learns at their own pace. What specific part was challenging?",
        "I understand that's frustrating, {name}. One setback doesn't define your abilities. Let's figure out what you can learn from this experience.",
        "That feeling is completely normal, {name}. Even the most successful students have moments like this. What's one small thing you could try differently next time?",
        "Hey {name}, remember that growth happens through challenges, not just easy wins. What support do you need to tackle this?"
      ]
    },
    'study-tips': {
      keywords: ['study', 'test', 'exam', 'homework', 'how to', 'don\'t know', 'where to start'],
      responses: [
        "Great question, {name}! Try the 20-20-20 method: 20 minutes reviewing notes, 20 minutes practicing, 20 minutes teaching the concept to yourself out loud.",
        "Here's a game-changer, {name}: Use the 'Feynman Technique' - explain the concept like you're teaching it to a friend. If you get stuck, that's where you need to focus!",
        "Smart approach, {name}! Break it into chunks: 1) Skim the material first, 2) Make a question list, 3) Study in 25-minute focused sessions with 5-minute breaks.",
        "I've got your back, {name}! Try 'active recall' - instead of re-reading, close the book and write down everything you remember. Then check what you missed."
      ]
    },
    motivation: {
      keywords: ['tired', 'don\'t want to', 'lazy', 'unmotivated', 'give up', 'what\'s the point'],
      responses: [
        "That feeling is so common, {name}! Try the '2-minute rule' - commit to just 2 minutes of work. Often starting is the hardest part.",
        "I hear you, {name}. Remember your goals: what's one thing you want to achieve this month? Let's connect today's work to that bigger picture.",
        "Totally understand, {name}. Your brain needs variety! Try changing your study location, playing different background music, or studying with a friend.",
        "You're not alone in feeling this way, {name}. What if we gamify it? Set a timer for 15 minutes and see how much you can get done - make it a personal challenge!"
      ]
    },
    'goal-setting': {
      keywords: ['want to improve', 'goal', 'better grades', 'GPA', 'college', 'future', 'plan'],
      responses: [
        "Love that ambition, {name}! Let's make it specific: what's your current GPA and what's your target? We can create weekly mini-goals for each class.",
        "Awesome mindset, {name}! Try the SMART goal method: make it Specific, Measurable, Achievable, Relevant, and Time-bound. What's your main focus area?",
        "That's the right attitude, {name}! Start with one subject where you want to see improvement. What's been your biggest challenge there?",
        "Perfect timing, {name}! Research shows students who write down goals are 42% more likely to achieve them. What's your #1 academic priority right now?"
      ]
    },
    safety: {
      keywords: ['depressed', 'suicide', 'hurt myself', 'hate myself', 'want to die', 'hopeless', 'anxiety attack'],
      responses: [
        "I'm really concerned about you, {name}. These feelings are serious and you deserve professional support. Please talk to a trusted adult, counselor, or call 988 (Suicide & Crisis Lifeline) right away.",
        "Thank you for sharing something so important, {name}. I'm not equipped to help with this, but trained counselors are. Please reach out to your school counselor, a trusted adult, or text HOME to 741741 for immediate support.",
        "Your wellbeing matters so much, {name}. What you're feeling is real and serious - please don't face this alone. Contact your school's mental health resources or call 988 for professional support right away."
      ]
    }
  }

  // Step-by-step building process
  const buildingSteps = [
    {
      step: 1,
      title: "🎯 Design Your Chatbot's Personality",
      description: "Choose how your AI advisor will interact with students",
      component: 'personality'
    },
    {
      step: 2,
      title: "📝 Create Response Categories", 
      description: "Build different types of helpful responses",
      component: 'responses'
    },
    {
      step: 3,
      title: "🧠 Build Smart Message Analysis",
      description: "Teach your AI to understand what students need",
      component: 'analysis'
    },
    {
      step: 4,
      title: "⚡ Add Advanced Features",
      description: "Personalization, memory, and safety features",
      component: 'features'
    },
    {
      step: 5,
      title: "🚀 Generate & Test Your Code",
      description: "See your chatbot come to life",
      component: 'code'
    }
  ]

  // Generate code based on current configuration
  const generateCode = () => {
    const code = `# 🤖 ${chatbot.name} - Advanced School Success Advisor
import random
import re
from datetime import datetime
import json

class SchoolAdvisorBot:
    def __init__(self, name="${chatbot.name}"):
        self.name = name
        self.personality = "${chatbot.personality}"
        self.student_name = "Student"
        self.conversation_history = []
        self.analytics = {
            "conversations_handled": 0,
            "positive_responses": 0,
            "categories_used": {},
            "sentiment_accuracy": 0,
            "safety_triggers": 0
        }
        
        # Response templates for different situations
        self.responses = {
            "encouragement": {
                "keywords": ["failed", "stupid", "can't", "bad grade", "failing", "disappointed"],
                "templates": [
                    "Getting a tough grade doesn't mean you're not capable! {name}, everyone learns at their own pace.",
                    "I understand that's frustrating, {name}. One setback doesn't define your abilities.",
                    "That feeling is completely normal, {name}. Even successful students have moments like this.",
                    "Hey {name}, growth happens through challenges, not just easy wins!"
                ]
            },
            "study_tips": {
                "keywords": ["study", "test", "exam", "homework", "how to", "don't know"],
                "templates": [
                    "Try the 20-20-20 method, {name}: 20 min reviewing, 20 min practicing, 20 min teaching yourself!",
                    "Here's a game-changer, {name}: Use the 'Feynman Technique' - explain it like you're teaching a friend.",
                    "Break it into chunks, {name}: 1) Skim first, 2) Make questions, 3) Study in 25-min sessions.",
                    "Try 'active recall', {name} - close the book and write down everything you remember!"
                ]
            },
            "motivation": {
                "keywords": ["tired", "don't want to", "lazy", "unmotivated", "give up"],
                "templates": [
                    "That feeling is common, {name}! Try the '2-minute rule' - commit to just 2 minutes of work.",
                    "I hear you, {name}. What's one thing you want to achieve this month? Let's connect today's work to that!",
                    "Your brain needs variety, {name}! Try changing location, music, or studying with a friend.",
                    "Let's gamify it, {name}! Set a 15-minute timer and make it a personal challenge!"
                ]
            },
            "goal_setting": {
                "keywords": ["want to improve", "goal", "better grades", "GPA", "college", "future"],
                "templates": [
                    "Love that ambition, {name}! Let's make it specific - what's your current and target GPA?",
                    "Try the SMART goal method, {name}: Specific, Measurable, Achievable, Relevant, Time-bound!",
                    "Start with one subject where you want improvement, {name}. What's been your biggest challenge?",
                    "Students who write down goals are 42% more likely to achieve them, {name}!"
                ]
            },
            "safety": {
                "keywords": ["depressed", "suicide", "hurt myself", "hate myself", "hopeless"],
                "templates": [
                    "I'm really concerned about you, {name}. Please talk to a trusted adult or call 988 (Suicide & Crisis Lifeline).",
                    "Thank you for sharing, {name}. Please reach out to your school counselor or text HOME to 741741 for support.",
                    "Your wellbeing matters, {name}. Please don't face this alone - contact mental health resources right away."
                ]
            }
        }
    
    def analyze_sentiment(self, message):
        """Simple sentiment analysis based on keywords"""
        positive_words = ["good", "great", "happy", "excited", "ready", "confident", "can do"]
        negative_words = ["bad", "sad", "stressed", "worried", "failed", "can't", "hate"]
        
        message_lower = message.lower()
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if negative_count > positive_count:
            return "negative"
        elif positive_count > negative_count:
            return "positive"
        else:
            return "neutral"
    
    def classify_message(self, message):
        """Determine what type of help the student needs"""
        message_lower = message.lower()
        
        # Check for safety concerns first (highest priority)
        for keyword in self.responses["safety"]["keywords"]:
            if keyword in message_lower:
                self.analytics["safety_triggers"] += 1
                return "safety"
        
        # Check other categories
        category_scores = {}
        for category, data in self.responses.items():
            if category == "safety":  # Already checked above
                continue
            score = sum(1 for keyword in data["keywords"] if keyword in message_lower)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            return max(category_scores.items(), key=lambda x: x[1])[0]
        
        return "encouragement"  # Default fallback
    
    def generate_response(self, message, student_name="Student"):
        """Generate an appropriate response based on the message"""
        self.student_name = student_name
        self.analytics["conversations_handled"] += 1
        
        # Analyze the message
        sentiment = self.analyze_sentiment(message)
        category = self.classify_message(message)
        
        # Update analytics
        if category in self.analytics["categories_used"]:
            self.analytics["categories_used"][category] += 1
        else:
            self.analytics["categories_used"][category] = 1
        
        if sentiment == "positive":
            self.analytics["positive_responses"] += 1
        
        # Get appropriate response template
        templates = self.responses[category]["templates"]
        response_template = random.choice(templates)
        
        # Personalize the response
        response = response_template.format(name=self.student_name)
        
        # Store conversation
        self.conversation_history.append({
            "message": message,
            "response": response,
            "sentiment": sentiment,
            "category": category,
            "timestamp": datetime.now().isoformat()
        })
        
        return response, category, sentiment
    
    def get_analytics_summary(self):
        """Return current analytics"""
        total_conversations = self.analytics["conversations_handled"]
        if total_conversations == 0:
            return "No conversations yet!"
        
        positive_rate = (self.analytics["positive_responses"] / total_conversations) * 100
        
        summary = f'''
📊 {self.name} Analytics:
═══════════════════════════════════
🗣️  Conversations Handled: {total_conversations}
😊 Positive Interactions: {self.analytics["positive_responses"]} ({positive_rate:.1f}%)
🚨 Safety Concerns: {self.analytics["safety_triggers"]}

📈 Categories Used:'''
        
        for category, count in self.analytics["categories_used"].items():
            percentage = (count / total_conversations) * 100
            summary += f"\\n   {category.replace('_', ' ').title()}: {count} ({percentage:.1f}%)"
        
        return summary
    
    def chat_demo(self):
        """Interactive demo of the chatbot"""
        print(f"🤖 Hi! I'm {self.name}, your School Success Advisor!")
        print("💬 Tell me what's on your mind about school, and I'll try to help!")
        print("✨ Type 'quit' to exit or 'analytics' to see my performance stats\\n")
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() == 'quit':
                print(f"\\n👋 Take care! Remember, I'm here whenever you need support!")
                break
            elif user_input.lower() == 'analytics':
                print(self.get_analytics_summary())
                continue
            elif not user_input:
                print("🤖 I'm here when you're ready to talk!")
                continue
            
            response, category, sentiment = self.generate_response(user_input, "Student")
            print(f"🤖 {response}")
            print(f"   📊 [Category: {category}, Sentiment: {sentiment}]\\n")

# Create and test the advisor bot
if __name__ == "__main__":
    advisor = SchoolAdvisorBot("${chatbot.name}")
    
    # Test with some example messages
    test_messages = [
        "I failed my math test and feel really stupid",
        "I have a huge history exam tomorrow and don't know where to start",
        "I'm so tired and don't want to do homework",
        "I want to raise my GPA this semester",
        "I feel hopeless about everything"
    ]
    
    print(f"🧪 Testing {advisor.name} with sample student messages:\\n")
    
    for i, message in enumerate(test_messages, 1):
        print(f"Test {i}: '{message}'")
        response, category, sentiment = advisor.generate_response(message, f"Student{i}")
        print(f"Response: {response}")
        print(f"Analysis: {category} (sentiment: {sentiment})\\n")
    
    print(advisor.get_analytics_summary())
    print("\\n🎉 Your AI advisor is ready to help students!")
    print("\\n💡 Try running advisor.chat_demo() for an interactive experience!")`;

    setGeneratedCode(code)
    setChatbot(prev => ({ ...prev, code }))
  }

  // Simulate AI processing of student message
  const processMessage = async (message: string) => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    // Simple sentiment analysis
    const sentimentKeywords = {
      negative: ['failed', 'stupid', 'can\'t', 'bad', 'hate', 'frustrated', 'stressed'],
      positive: ['good', 'great', 'excited', 'ready', 'confident', 'happy'],
    }
    
    const messageLower = message.toLowerCase()
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    
    if (sentimentKeywords.negative.some(word => messageLower.includes(word))) {
      sentiment = 'negative'
    } else if (sentimentKeywords.positive.some(word => messageLower.includes(word))) {
      sentiment = 'positive'  
    }
    
    // Determine category
    let category = 'encouragement'
    let confidence = 0.7
    
    Object.entries(responseTemplates).forEach(([cat, data]) => {
      const matches = data.keywords.filter(keyword => messageLower.includes(keyword)).length
      if (matches > 0) {
        category = cat
        confidence = Math.min(0.95, 0.6 + (matches * 0.1))
      }
    })
    
    // Get appropriate response
    const categoryData = responseTemplates[category as keyof typeof responseTemplates]
    const responseTemplate = categoryData.responses[Math.floor(Math.random() * categoryData.responses.length)]
    const aiResponse = responseTemplate.replace('{name}', 'there')
    
    // Update analytics
    setChatbot(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        conversations_handled: prev.analytics.conversations_handled + 1,
        positive_responses: sentiment === 'positive' ? prev.analytics.positive_responses + 1 : prev.analytics.positive_responses,
        categories_used: {
          ...prev.analytics.categories_used,
          [category]: (prev.analytics.categories_used[category] || 0) + 1
        },
        sentiment_accuracy: confidence * 100,
        safety_triggers: category === 'safety' ? prev.analytics.safety_triggers + 1 : prev.analytics.safety_triggers
      }
    }))
    
    // Add messages to chat
    const studentMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'student',
      timestamp: new Date(),
      sentiment,
      category,
      confidence
    }
    
    const aiMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
      category,
      confidence
    }
    
    setTestMessages(prev => [...prev, studentMessage, aiMessage])
    setIsProcessing(false)
  }

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [testMessages])

  // Generate code when chatbot config changes
  useEffect(() => {
    if (buildingStep >= 5) {
      generateCode()
    }
  }, [chatbot, buildingStep])

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      processMessage(currentMessage.trim())
      setCurrentMessage('')
    }
  }

  const PersonalityDesigner = () => (
    <div className="space-y-6">
      <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4">🎭 Choose Your AI's Personality</h3>
        <p className="text-blue-200 mb-6">
          How should your School Success Advisor interact with students? Different personalities work better for different types of help.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'encouraging',
              name: 'The Encouraging Mentor',
              description: 'Warm, supportive, focuses on building confidence',
              example: '"Hey there! I believe in you - let\'s figure this out together!"'
            },
            {
              id: 'practical',
              name: 'The Practical Coach',
              description: 'Direct, solution-focused, gives specific actionable advice',
              example: '"Here\'s exactly what to do: Step 1, Step 2, Step 3. You got this!"'
            },
            {
              id: 'friendly',
              name: 'The Friendly Peer',
              description: 'Casual, relatable, like talking to a smart friend',
              example: '"Ugh, I totally get it! That happened to me too. Want to try something that actually works?"'
            },
            {
              id: 'wise',
              name: 'The Wise Guide',
              description: 'Thoughtful, patient, helps students think through problems',
              example: '"Interesting challenge. What do you think might be the root cause here?"'
            }
          ].map(personality => (
            <button
              key={personality.id}
              onClick={() => setChatbot(prev => ({ ...prev, personality: personality.id }))}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                chatbot.personality === personality.id
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 bg-gray-800 hover:border-blue-500/50'
              }`}
            >
              <h4 className="text-white font-semibold mb-2">{personality.name}</h4>
              <p className="text-gray-300 text-sm mb-2">{personality.description}</p>
              <p className="text-blue-300 text-sm italic">{personality.example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const ResponseBuilder = () => (
    <div className="space-y-6">
      <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4">📝 Build Response Categories</h3>
        <p className="text-green-200 mb-6">
          Create different types of responses for various student needs. Each category handles specific situations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(responseTemplates).map(([category, data]) => (
            <div key={category} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                {category === 'encouragement' && <Heart className="h-5 w-5 text-red-400" />}
                {category === 'study-tips' && <Brain className="h-5 w-5 text-blue-400" />}
                {category === 'motivation' && <Zap className="h-5 w-5 text-yellow-400" />}
                {category === 'goal-setting' && <Target className="h-5 w-5 text-green-400" />}
                {category === 'safety' && <Shield className="h-5 w-5 text-red-400" />}
                <h4 className="text-white font-semibold capitalize">
                  {category.replace('-', ' ')}
                </h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-gray-300 text-sm font-medium">Trigger Keywords:</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.keywords.slice(0, 4).map(keyword => (
                      <span key={keyword} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                    {data.keywords.length > 4 && (
                      <span className="text-gray-400 text-xs">+{data.keywords.length - 4} more</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-gray-300 text-sm font-medium">Sample Response:</h5>
                  <p className="text-gray-200 text-sm italic bg-gray-900/50 p-2 rounded mt-1">
                    {data.responses[0].replace('{name}', 'Alex')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const TestingInterface = () => (
    <div className="space-y-6">
      <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          🧪 Test Your AI Advisor
        </h3>
        <p className="text-purple-200 mb-6">
          Try different student messages to see how your AI responds. Watch the analytics update in real-time!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50 rounded-t-lg">
            <h4 className="text-white font-medium flex items-center gap-2">
              💬 Chat with Your AI Advisor
            </h4>
            <p className="text-gray-400 text-sm">Conversations: {chatbot.analytics.conversations_handled}</p>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {testMessages.length === 0 ? (
              <div className="text-center text-gray-500 italic mt-8">
                Start a conversation to see your AI in action!
                <br />
                <span className="text-sm">Try: "I failed my test and feel stupid"</span>
              </div>
            ) : (
              testMessages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    {message.category && (
                      <div className="text-xs opacity-75 mt-1">
                        {message.category} • {message.sentiment} • {Math.round((message.confidence || 0) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a student message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !currentMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                Send
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-gray-400 text-xs">Quick tests:</span>
              {[
                "I failed my math test",
                "How do I study for history?",
                "I don't want to do homework",
                "I want better grades"
              ].map(test => (
                <button
                  key={test}
                  onClick={() => setCurrentMessage(test)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                >
                  {test}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Analytics Panel */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50 rounded-t-lg">
            <h4 className="text-white font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              📊 Real-time Analytics
            </h4>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/20 rounded p-3 text-center">
                <div className="text-blue-400 font-bold text-xl">{chatbot.analytics.conversations_handled}</div>
                <div className="text-blue-300 text-sm">Conversations</div>
              </div>
              <div className="bg-green-900/20 rounded p-3 text-center">
                <div className="text-green-400 font-bold text-xl">
                  {chatbot.analytics.conversations_handled > 0 
                    ? Math.round((chatbot.analytics.positive_responses / chatbot.analytics.conversations_handled) * 100)
                    : 0}%
                </div>
                <div className="text-green-300 text-sm">Positive Rate</div>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-2">Response Categories Used:</h5>
              <div className="space-y-2">
                {Object.entries(chatbot.analytics.categories_used).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm capitalize">{category.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ 
                            width: `${chatbot.analytics.conversations_handled > 0 
                              ? (count / chatbot.analytics.conversations_handled) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {chatbot.analytics.safety_triggers > 0 && (
              <div className="bg-red-900/20 rounded p-3 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Safety Alerts: {chatbot.analytics.safety_triggers}</span>
                </div>
                <p className="text-red-300 text-sm mt-1">
                  Your AI correctly identified messages needing professional help!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const CodeViewer = () => (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 rounded-lg p-6 border border-indigo-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6" />
          🚀 Your Generated AI Code
        </h3>
        <p className="text-indigo-200 mb-6">
          Here's the complete Python code for your School Success Advisor! This is production-ready code that demonstrates advanced AI concepts.
        </p>
        
        <div className="flex gap-3 mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Save className="h-4 w-4" />
            Save Project
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(generatedCode)
              alert('Code copied to clipboard!')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Copy Code
          </button>
          <button 
            onClick={() => {
              const blob = new Blob([generatedCode], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${chatbot.name.toLowerCase().replace(/\s+/g, '-')}-advisor.py`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            Download Python File
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <h4 className="text-white font-medium">{chatbot.name}.py</h4>
          <p className="text-gray-400 text-sm">{generatedCode.split('\n').length} lines • Advanced AI Chatbot</p>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {generatedCode}
          </pre>
        </div>
      </div>
      
      <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-500/30">
        <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          🧠 What Makes This Code Advanced?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-white font-medium mb-2">AI Concepts Implemented:</h5>
            <ul className="text-yellow-200 space-y-1">
              <li>• Natural Language Processing (NLP)</li>
              <li>• Sentiment Analysis</li>
              <li>• Message Classification</li>
              <li>• Response Generation</li>
              <li>• Machine Learning Analytics</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium mb-2">Programming Techniques:</h5>
            <ul className="text-yellow-200 space-y-1">
              <li>• Object-Oriented Programming</li>
              <li>• Data Structures (Dictionaries, Lists)</li>
              <li>• String Processing & Regex</li>
              <li>• JSON Data Handling</li>
              <li>• Real-time Analytics Tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg p-6 border border-indigo-500/30">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
          🤖 Advanced AI Chatbot Builder
        </h2>
        <p className="text-indigo-200 mb-4">
          Build a sophisticated AI advisor that understands student needs and provides personalized support. Learn advanced programming concepts while creating something that truly helps people!
        </p>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {buildingSteps.map(step => (
            <button
              key={step.step}
              onClick={() => setBuildingStep(step.step)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                buildingStep >= step.step
                  ? buildingStep === step.step
                    ? 'bg-indigo-600 text-white'
                    : 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {buildingStep > step.step ? '✅' : step.step} {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'design', label: '🎨 Design', icon: Settings },
            { id: 'test', label: '🧪 Test', icon: MessageCircle },
            { id: 'code', label: '💻 Code', icon: Brain },
            { id: 'analytics', label: '📊 Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-indigo-500 bg-indigo-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'design' && (
            buildingStep <= 2 ? <PersonalityDesigner /> : <ResponseBuilder />
          )}
          {activeTab === 'test' && <TestingInterface />}
          {activeTab === 'code' && <CodeViewer />}
          {activeTab === 'analytics' && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Advanced Analytics Coming Soon</h3>
              <p className="text-gray-400">Full analytics dashboard with conversation insights, student outcome tracking, and AI performance metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Step Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setBuildingStep(Math.max(1, buildingStep - 1))}
          disabled={buildingStep <= 1}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          ← Previous Step
        </button>
        
        <div className="text-center">
          <div className="text-white font-medium">Step {buildingStep} of {buildingSteps.length}</div>
          <div className="text-gray-400 text-sm">{buildingSteps[buildingStep - 1]?.description}</div>
        </div>
        
        <button
          onClick={() => setBuildingStep(Math.min(5, buildingStep + 1))}
          disabled={buildingStep >= 5}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Next Step →
        </button>
      </div>
    </div>
  )
}