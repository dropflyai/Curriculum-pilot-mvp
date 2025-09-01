export default function TestLessons() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a2e', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 Python Lessons Test</h1>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Week 1: Welcome to CodeQuest</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '1rem' }}>
          Learn Python basics by creating your first interactive program!
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            backgroundColor: '#6366f1', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🌟 Hello World Plus+ (25 XP)
          </div>
          <div style={{ 
            backgroundColor: '#8b5cf6', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🎭 Personality Quiz (50 XP)  
          </div>
          <div style={{ 
            backgroundColor: '#ec4899', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            📝 Mad Libs Generator (75 XP)
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Week 2: Loops & Events</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '1rem' }}>
          Master loops by building an epic clicker game!
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            backgroundColor: '#10b981', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            ⏰ Countdown Timer (40 XP)
          </div>
          <div style={{ 
            backgroundColor: '#f59e0b', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🧮 Multiplication Master (50 XP)
          </div>
          <div style={{ 
            backgroundColor: '#ef4444', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🎮 Cookie Clicker Game (100 XP)
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(34, 197, 94, 0.2)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}>
        <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>✅ Test Page Working!</h3>
        <p style={{ color: '#a0a0a0' }}>
          This basic test page is working. The interactive lesson components will be added once 
          we confirm the routing and server are working properly.
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/student/dashboard"
          style={{
            display: 'inline-block',
            backgroundColor: '#6366f1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}