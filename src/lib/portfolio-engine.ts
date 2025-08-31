// Student Portfolio Engine - GitHub Pages Integration
// Auto-deployment system for student coding portfolios

import { createClient } from '@/lib/supabase'

export interface PortfolioProject {
  id: string
  title: string
  description: string
  code: string
  output: string
  screenshot?: string
  week: number
  assignment_id: string
  completion_date: string
  grade?: number
  tags: string[]
  github_url?: string
  live_demo_url?: string
  featured: boolean
}

export interface StudentPortfolio {
  user_id: string
  student_name: string
  github_username?: string
  portfolio_url?: string
  bio: string
  profile_image?: string
  projects: PortfolioProject[]
  skills: string[]
  badges: string[]
  total_xp: number
  last_updated: string
  public: boolean
}

export interface GitHubDeploymentConfig {
  enabled: boolean
  auto_deploy: boolean
  repository_name: string
  branch: string
  custom_domain?: string
  template: 'minimal' | 'professional' | 'showcase'
}

class PortfolioEngine {
  private supabase = createClient()

  // ==========================================
  // PORTFOLIO GENERATION
  // ==========================================

  /**
   * Generate complete portfolio for student
   */
  async generateStudentPortfolio(userId: string): Promise<StudentPortfolio> {
    try {
      // Get student profile
      const { data: user } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!user) throw new Error('Student not found')

      // Get completed assignments
      const { data: progress } = await this.supabase
        .from('student_progress')
        .select(`
          *,
          assignments!inner(
            id, title, week, assignment_type, description
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'graded')
        .gte('final_score', 70) // Only include passing grades

      // Get student badges and XP
      const { data: badges } = await this.supabase
        .from('user_badges')
        .select('badge_name')
        .eq('user_id', userId)

      const { data: xpData } = await this.supabase
        .from('user_xp')
        .select('total_xp')
        .eq('user_id', userId)
        .single()

      // Convert assignments to portfolio projects
      const projects: PortfolioProject[] = (progress || []).map((p: any) => ({
        id: p.id,
        title: p.assignments.title,
        description: p.assignments.description,
        code: p.submitted_code || '',
        output: this.generateProjectOutput(p.submitted_code),
        week: p.assignments.week,
        assignment_id: p.assignment_id,
        completion_date: p.completed_at,
        grade: p.final_score,
        tags: this.generateProjectTags(p.assignments.assignment_type, p.assignments.week),
        featured: p.final_score >= 90,
        github_url: p.github_url,
        live_demo_url: p.live_demo_url
      }))

      // Extract skills from completed projects
      const skills = this.extractSkillsFromProjects(projects)

      return {
        user_id: userId,
        student_name: user.full_name || user.email,
        github_username: user.github_username,
        portfolio_url: user.portfolio_url,
        bio: user.bio || `Coding student at CodeFly Academy. Building amazing projects and learning Python!`,
        profile_image: user.avatar_url,
        projects: projects.sort((a, b) => new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime()),
        skills,
        badges: (badges || []).map((b: any) => b.badge_name),
        total_xp: xpData?.total_xp || 0,
        last_updated: new Date().toISOString(),
        public: user.portfolio_public !== false
      }
    } catch (error) {
      console.error('Error generating portfolio:', error)
      throw new Error('Failed to generate student portfolio')
    }
  }

  /**
   * Extract skills from completed projects
   */
  private extractSkillsFromProjects(projects: PortfolioProject[]): string[] {
    const skillSet = new Set<string>()

    projects.forEach(project => {
      const code = project.code.toLowerCase()
      
      // Basic Python concepts
      if (code.includes('input(')) skillSet.add('User Input')
      if (code.includes('print(')) skillSet.add('Output Display')
      if (code.includes('for ') || code.includes('while ')) skillSet.add('Loops')
      if (code.includes('def ')) skillSet.add('Functions')
      if (code.includes('if ')) skillSet.add('Conditional Logic')
      if (code.includes('list') || code.includes('[')) skillSet.add('Lists')
      if (code.includes('dict') || code.includes('{')) skillSet.add('Dictionaries')
      if (code.includes('class ')) skillSet.add('Object-Oriented Programming')
      if (code.includes('import ')) skillSet.add('Module Usage')
      if (code.includes('random')) skillSet.add('Random Generation')
      if (code.includes('time')) skillSet.add('Time Management')
      
      // Advanced concepts
      if (code.includes('try:') || code.includes('except:')) skillSet.add('Error Handling')
      if (code.includes('with open')) skillSet.add('File Operations')
      if (code.includes('json')) skillSet.add('Data Processing')
      if (code.includes('request') || code.includes('api')) skillSet.add('API Integration')
      
      // Week-based skills
      if (project.week >= 10) skillSet.add('Advanced Programming')
      if (project.week >= 15) skillSet.add('Project Architecture')
    })

    return Array.from(skillSet)
  }

  /**
   * Generate project tags based on assignment type and week
   */
  private generateProjectTags(assignmentType: string, week: number): string[] {
    const tags = [`week-${week.toString().padStart(2, '0')}`]
    
    // Assignment type tags
    switch (assignmentType?.toLowerCase()) {
      case 'solo': tags.push('individual-project'); break
      case 'team': tags.push('collaborative'); break
      case 'quiz': tags.push('assessment'); break
      case 'homework': tags.push('practice'); break
      case 'showcase': tags.push('featured-project'); break
    }
    
    // Week-based difficulty
    if (week <= 3) tags.push('beginner')
    else if (week <= 10) tags.push('intermediate')
    else tags.push('advanced')
    
    // Topic-based tags
    if (week === 1) tags.push('variables', 'basics')
    if (week === 2) tags.push('magic-8-ball', 'user-interaction')
    if (week >= 5 && week <= 8) tags.push('loops', 'control-flow')
    if (week >= 10) tags.push('functions', 'modular-code')
    if (week >= 15) tags.push('final-project', 'capstone')
    
    return tags
  }

  /**
   * Generate realistic output for project code
   */
  private generateProjectOutput(code: string): string {
    if (!code) return ''
    
    // Simple simulation of Python output
    const lines = code.split('\n')
    const outputs: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('print(')) {
        // Extract print content
        const match = trimmed.match(/print\(([^)]+)\)/)
        if (match) {
          let content = match[1]
          // Remove quotes
          content = content.replace(/['"]/g, '')
          // Handle f-strings (simplified)
          content = content.replace(/f['"]/g, '').replace(/\{[^}]+\}/g, '[value]')
          outputs.push(content)
        }
      }
    }
    
    return outputs.length > 0 ? outputs.join('\n') : '# Code executed successfully!'
  }

  // ==========================================
  // GITHUB INTEGRATION
  // ==========================================

  /**
   * Generate GitHub Pages portfolio site
   */
  async generateGitHubPortfolio(
    portfolio: StudentPortfolio,
    config: GitHubDeploymentConfig
  ): Promise<{
    success: boolean
    repository_url?: string
    pages_url?: string
    files_generated: string[]
  }> {
    try {
      // Generate portfolio files
      const portfolioFiles = this.generatePortfolioFiles(portfolio, config.template)
      
      // In a real implementation, this would:
      // 1. Create GitHub repository via GitHub API
      // 2. Push portfolio files to repository
      // 3. Enable GitHub Pages
      // 4. Configure custom domain if provided
      
      // For MVP, we simulate the process
      const repoName = config.repository_name || `${portfolio.student_name.toLowerCase().replace(/\s+/g, '-')}-portfolio`
      const pagesUrl = config.custom_domain || `https://${portfolio.github_username}.github.io/${repoName}`
      
      // Update user record with portfolio URLs
      await this.supabase
        .from('users')
        .update({
          portfolio_url: pagesUrl,
          github_repository: `https://github.com/${portfolio.github_username}/${repoName}`,
          portfolio_config: config,
          portfolio_last_deployed: new Date().toISOString()
        })
        .eq('id', portfolio.user_id)

      return {
        success: true,
        repository_url: `https://github.com/${portfolio.github_username}/${repoName}`,
        pages_url: pagesUrl,
        files_generated: Object.keys(portfolioFiles)
      }
    } catch (error) {
      console.error('Error generating GitHub portfolio:', error)
      return {
        success: false,
        files_generated: []
      }
    }
  }

  /**
   * Generate portfolio website files
   */
  private generatePortfolioFiles(
    portfolio: StudentPortfolio,
    template: 'minimal' | 'professional' | 'showcase'
  ): Record<string, string> {
    const files: Record<string, string> = {}

    // Generate index.html
    files['index.html'] = this.generateHTMLPortfolio(portfolio, template)
    
    // Generate CSS
    files['styles.css'] = this.generatePortfolioCSS(template)
    
    // Generate JavaScript
    files['script.js'] = this.generatePortfolioJS()
    
    // Generate individual project pages
    portfolio.projects.forEach(project => {
      files[`projects/${project.id}.html`] = this.generateProjectPage(project, portfolio)
    })
    
    // Generate README
    files['README.md'] = this.generateREADME(portfolio)
    
    return files
  }

  /**
   * Generate HTML portfolio page
   */
  private generateHTMLPortfolio(portfolio: StudentPortfolio, template: string): string {
    const themeClasses = this.getTemplateClasses(template)
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.student_name} - CodeFly Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${themeClasses.body}">
    <!-- Header -->
    <header class="${themeClasses.header}">
        <div class="container">
            <div class="header-content">
                <div class="profile-section">
                    ${portfolio.profile_image ? 
                      `<img src="${portfolio.profile_image}" alt="${portfolio.student_name}" class="profile-image">` :
                      `<div class="profile-placeholder"><i class="fas fa-user"></i></div>`
                    }
                    <div>
                        <h1>${portfolio.student_name}</h1>
                        <p class="subtitle">CodeFly Academy Student</p>
                        <div class="xp-display">
                            <i class="fas fa-star"></i>
                            ${portfolio.total_xp.toLocaleString()} XP • Level ${Math.floor(portfolio.total_xp / 1000) + 1}
                        </div>
                    </div>
                </div>
                
                <div class="portfolio-stats">
                    <div class="stat">
                        <span class="stat-number">${portfolio.projects.length}</span>
                        <span class="stat-label">Projects</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${portfolio.badges.length}</span>
                        <span class="stat-label">Badges</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${portfolio.skills.length}</span>
                        <span class="stat-label">Skills</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- About Section -->
    <section class="${themeClasses.section}">
        <div class="container">
            <h2>About Me</h2>
            <p class="bio">${portfolio.bio}</p>
            
            <!-- Skills -->
            <div class="skills-section">
                <h3>Programming Skills</h3>
                <div class="skills-grid">
                    ${portfolio.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Badges -->
            <div class="badges-section">
                <h3>Achievements</h3>
                <div class="badges-grid">
                    ${portfolio.badges.map(badge => `
                        <div class="badge">
                            <i class="fas fa-trophy"></i>
                            <span>${badge}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section class="${themeClasses.section}">
        <div class="container">
            <h2>My Projects</h2>
            <div class="projects-grid">
                ${portfolio.projects.map(project => `
                    <div class="project-card ${project.featured ? 'featured' : ''}">
                        <div class="project-header">
                            <h3>${project.title}</h3>
                            ${project.featured ? '<i class="fas fa-star featured-star"></i>' : ''}
                        </div>
                        <p class="project-description">${project.description}</p>
                        
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        
                        <div class="project-stats">
                            <span class="week-badge">Week ${project.week}</span>
                            ${project.grade ? `<span class="grade-badge grade-${this.getGradeLevel(project.grade)}">${project.grade}%</span>` : ''}
                        </div>
                        
                        <div class="project-actions">
                            <button onclick="viewProject('${project.id}')" class="btn-primary">
                                <i class="fas fa-eye"></i> View Project
                            </button>
                            ${project.live_demo_url ? `
                                <a href="${project.live_demo_url}" target="_blank" class="btn-secondary">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="${themeClasses.section}">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Interested in my coding journey? Let's connect!</p>
            <div class="contact-links">
                ${portfolio.github_username ? `
                    <a href="https://github.com/${portfolio.github_username}" target="_blank" class="contact-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                ` : ''}
                <a href="mailto:contact@example.com" class="contact-link">
                    <i class="fas fa-envelope"></i> Email
                </a>
                <a href="https://codefly.academy" target="_blank" class="contact-link">
                    <i class="fas fa-graduation-cap"></i> CodeFly Academy
                </a>
            </div>
        </div>
    </section>

    <!-- Project Modals -->
    <div id="project-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="project-details"></div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`
  }

  /**
   * Generate CSS for portfolio
   */
  private generatePortfolioCSS(template: string): string {
    const baseStyles = `
/* Portfolio Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
header {
    padding: 60px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 20px;
    text-align: left;
}

.profile-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.3);
}

.profile-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.xp-display {
    margin-top: 10px;
    padding: 8px 12px;
    background: rgba(255,255,255,0.2);
    border-radius: 20px;
    font-weight: 500;
}

.portfolio-stats {
    display: flex;
    gap: 30px;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
}

/* Sections */
section {
    padding: 80px 0;
}

section:nth-child(even) {
    background: #f8f9fa;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
    color: #2d3748;
}

h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #4a5568;
}

.bio {
    font-size: 1.1rem;
    text-align: center;
    max-width: 600px;
    margin: 0 auto 40px;
    color: #666;
}

/* Skills */
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 40px;
}

.skill-tag {
    padding: 8px 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Badges */
.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 40px;
}

.badge {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background: linear-gradient(135deg, #ffecd2, #fcb69f);
    border-radius: 10px;
    font-weight: 500;
    color: #8b4513;
}

/* Projects */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.project-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.project-card.featured {
    border: 2px solid #ffd700;
    background: linear-gradient(135deg, #fff9e6, #ffffff);
}

.project-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 15px;
}

.featured-star {
    color: #ffd700;
    font-size: 1.2rem;
}

.project-description {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
}

.project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
}

.tag {
    padding: 4px 8px;
    background: #e2e8f0;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #4a5568;
}

.project-stats {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.week-badge {
    padding: 4px 12px;
    background: #667eea;
    color: white;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
}

.grade-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.grade-a { background: #48bb78; color: white; }
.grade-b { background: #4299e1; color: white; }
.grade-c { background: #ed8936; color: white; }

.project-actions {
    display: flex;
    gap: 10px;
}

.btn-primary, .btn-secondary {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
}

.btn-secondary:hover {
    background: #667eea;
    color: white;
}

/* Contact */
.contact-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.contact-link {
    padding: 15px 25px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 500;
    transition: transform 0.3s ease;
}

.contact-link:hover {
    transform: scale(1.05);
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: #000;
}

/* Responsive */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        text-align: center;
    }
    
    .profile-section {
        flex-direction: column;
        text-align: center;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
}
`

    // Add template-specific styles
    if (template === 'professional') {
      return baseStyles + `
/* Professional Template Overrides */
body { background: #f7fafc; }
header { background: linear-gradient(135deg, #2d3748, #4a5568); }
.project-card { border-left: 4px solid #667eea; }
`
    } else if (template === 'showcase') {
      return baseStyles + `
/* Showcase Template Overrides */
body { background: #0f0f23; color: white; }
header { background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); }
.project-card { background: #1a1a2e; color: white; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
section:nth-child(even) { background: #16213e; }
`
    }
    
    return baseStyles
  }

  /**
   * Generate JavaScript for portfolio interactivity
   */
  private generatePortfolioJS(): string {
    return `
// Portfolio JavaScript
const projects = ${JSON.stringify([])};

function viewProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const projectDetails = document.getElementById('project-details');
    
    projectDetails.innerHTML = \`
        <h2>\${project.title}</h2>
        <p>\${project.description}</p>
        
        <div class="project-content">
            <div class="code-section">
                <h3>Code</h3>
                <pre><code>\${project.code}</code></pre>
            </div>
            
            <div class="output-section">
                <h3>Output</h3>
                <pre class="output"><code>\${project.output}</code></pre>
            </div>
        </div>
        
        <div class="project-info">
            <p><strong>Completed:</strong> \${new Date(project.completion_date).toLocaleDateString()}</p>
            <p><strong>Week:</strong> \${project.week}</p>
            \${project.grade ? \`<p><strong>Grade:</strong> \${project.grade}%</p>\` : ''}
        </div>
    \`;
    
    modal.style.display = 'block';
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
`
  }

  /**
   * Generate project detail page
   */
  private generateProjectPage(project: PortfolioProject, portfolio: StudentPortfolio): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - ${portfolio.student_name}</title>
    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <a href="../index.html" class="back-link">← Back to Portfolio</a>
            </nav>
            <h1>${project.title}</h1>
            <p>Week ${project.week} Project by ${portfolio.student_name}</p>
        </div>
    </header>

    <main>
        <section class="project-detail">
            <div class="container">
                <div class="project-grid">
                    <div class="project-info">
                        <h2>About This Project</h2>
                        <p>${project.description}</p>
                        
                        <div class="project-meta">
                            <div class="meta-item">
                                <strong>Completed:</strong> ${new Date(project.completion_date).toLocaleDateString()}
                            </div>
                            <div class="meta-item">
                                <strong>Week:</strong> ${project.week}
                            </div>
                            ${project.grade ? `
                                <div class="meta-item">
                                    <strong>Grade:</strong> 
                                    <span class="grade-badge grade-${this.getGradeLevel(project.grade)}">${project.grade}%</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-code">
                        <h2>Source Code</h2>
                        <pre><code class="language-python">${project.code}</code></pre>
                        
                        <h2>Output</h2>
                        <pre class="output"><code>${project.output}</code></pre>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script>hljs.highlightAll();</script>
</body>
</html>`
  }

  /**
   * Generate README.md for portfolio repository
   */
  private generateREADME(portfolio: StudentPortfolio): string {
    return `# ${portfolio.student_name} - CodeFly Portfolio

Welcome to my coding portfolio! I'm a student at CodeFly Academy, learning Python programming and building amazing projects.

## About Me

${portfolio.bio}

**Current Level:** ${Math.floor(portfolio.total_xp / 1000) + 1} (${portfolio.total_xp.toLocaleString()} XP)

## Skills & Technologies

${portfolio.skills.map(skill => `- ${skill}`).join('\n')}

## Achievements

${portfolio.badges.map(badge => `🏆 ${badge}`).join('\n')}

## Projects

${portfolio.projects.map(project => `
### ${project.title} (Week ${project.week})
${project.description}

**Technologies:** ${project.tags.join(', ')}
${project.grade ? `**Grade:** ${project.grade}%` : ''}

[View Project](projects/${project.id}.html)
`).join('\n')}

## Contact

- **Portfolio:** [${portfolio.portfolio_url}](${portfolio.portfolio_url})
${portfolio.github_username ? `- **GitHub:** [@${portfolio.github_username}](https://github.com/${portfolio.github_username})` : ''}
- **School:** [CodeFly Academy](https://codefly.academy)

---

*This portfolio was automatically generated by CodeFly Academy's portfolio system.*
`
  }

  // ==========================================
  // AUTO-DEPLOYMENT SYSTEM
  // ==========================================

  /**
   * Auto-deploy portfolio when student completes assignment
   */
  async autoDeployPortfolio(
    userId: string,
    assignmentId: string
  ): Promise<{ success: boolean; deployment_url?: string }> {
    try {
      // Check if user has GitHub Pages enabled
      const { data: user } = await this.supabase
        .from('users')
        .select('github_username, portfolio_config, auto_deploy_enabled')
        .eq('id', userId)
        .single()

      if (!user || !user.auto_deploy_enabled || !user.github_username) {
        return { success: false }
      }

      // Generate updated portfolio
      const portfolio = await this.generateStudentPortfolio(userId)
      
      // Deploy to GitHub Pages
      const deploymentResult = await this.generateGitHubPortfolio(
        portfolio,
        user.portfolio_config || { 
          enabled: true, 
          auto_deploy: true, 
          repository_name: `${portfolio.student_name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
          branch: 'main',
          template: 'professional'
        }
      )

      // Record deployment
      await this.supabase
        .from('portfolio_deployments')
        .insert({
          user_id: userId,
          assignment_id: assignmentId,
          deployment_url: deploymentResult.pages_url,
          deployment_status: deploymentResult.success ? 'success' : 'failed',
          files_generated: deploymentResult.files_generated
        })

      return {
        success: deploymentResult.success,
        deployment_url: deploymentResult.pages_url
      }
    } catch (error) {
      console.error('Error auto-deploying portfolio:', error)
      return { success: false }
    }
  }

  /**
   * Manual portfolio update and deployment
   */
  async updatePortfolio(
    userId: string,
    updates: Partial<StudentPortfolio>
  ): Promise<{ success: boolean; portfolio: StudentPortfolio }> {
    try {
      // Update user profile
      await this.supabase
        .from('users')
        .update({
          bio: updates.bio,
          github_username: updates.github_username,
          portfolio_public: updates.public
        })
        .eq('id', userId)

      // Regenerate portfolio
      const portfolio = await this.generateStudentPortfolio(userId)
      
      // Auto-deploy if enabled
      if (updates.github_username) {
        await this.autoDeployPortfolio(userId, 'manual_update')
      }

      return { success: true, portfolio }
    } catch (error) {
      console.error('Error updating portfolio:', error)
      throw new Error('Failed to update portfolio')
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  private getTemplateClasses(template: string): Record<string, string> {
    const templates = {
      minimal: {
        body: 'minimal-theme',
        header: 'header-minimal',
        section: 'section-minimal'
      },
      professional: {
        body: 'professional-theme',
        header: 'header-professional',
        section: 'section-professional'
      },
      showcase: {
        body: 'showcase-theme',
        header: 'header-showcase',
        section: 'section-showcase'
      }
    }
    
    return templates[template as keyof typeof templates] || templates.professional
  }

  private getGradeLevel(grade: number): string {
    if (grade >= 90) return 'a'
    if (grade >= 80) return 'b'
    return 'c'
  }
}

// ==========================================
// PORTFOLIO SHARING SYSTEM
// ==========================================

export class PortfolioSharingEngine {
  private supabase = createClient()

  /**
   * Share portfolio project with class
   */
  async shareProject(
    userId: string,
    projectId: string,
    shareSettings: {
      allow_code_view: boolean
      allow_comments: boolean
      featured_submission: boolean
    }
  ): Promise<{ success: boolean; share_url: string }> {
    try {
      // Create sharing record
      const { data: share } = await this.supabase
        .from('portfolio_shares')
        .insert({
          user_id: userId,
          project_id: projectId,
          share_settings: shareSettings,
          share_token: this.generateShareToken(),
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (!share) throw new Error('Failed to create share')

      const shareUrl = `${window.location.origin}/portfolio/share/${share.share_token}`
      
      return { success: true, share_url: shareUrl }
    } catch (error) {
      console.error('Error sharing project:', error)
      return { success: false, share_url: '' }
    }
  }

  /**
   * Get class project showcase
   */
  async getClassShowcase(weekFilter?: number): Promise<PortfolioProject[]> {
    try {
      let query = this.supabase
        .from('portfolio_shares')
        .select(`
          *,
          student_progress!inner(
            submitted_code,
            final_score,
            completed_at,
            assignments!inner(title, description, week)
          ),
          users!inner(full_name)
        `)
        .eq('share_settings->>featured_submission', 'true')

      if (weekFilter) {
        query = query.eq('student_progress.assignments.week', weekFilter)
      }

      const { data: shares } = await query

      if (!shares) return []

      return shares.map((share: any) => ({
        id: share.project_id,
        title: share.student_progress.assignments.title,
        description: share.student_progress.assignments.description,
        code: share.student_progress.submitted_code,
        output: this.generateOutputFromCode(share.student_progress.submitted_code),
        week: share.student_progress.assignments.week,
        assignment_id: share.student_progress.assignment_id,
        completion_date: share.student_progress.completed_at,
        grade: share.student_progress.final_score,
        tags: [`week-${share.student_progress.assignments.week}`, 'featured'],
        featured: true
      }))
    } catch (error) {
      console.error('Error getting class showcase:', error)
      return []
    }
  }

  private generateShareToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private generateOutputFromCode(code: string): string {
    // Simple code output simulation
    const printStatements = code.match(/print\([^)]*\)/g) || []
    return printStatements.map(stmt => {
      const content = stmt.match(/print\(([^)]*)\)/)
      return content ? content[1].replace(/['"]/g, '') : ''
    }).join('\n')
  }
}

// ==========================================
// EXPORT ENGINES
// ==========================================

export const portfolioEngine = new PortfolioEngine()
export const portfolioSharing = new PortfolioSharingEngine()

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if student is eligible for auto-deployment
 */
export function isEligibleForPortfolio(studentProgress: any[]): boolean {
  const completedProjects = studentProgress.filter(p => 
    p.status === 'graded' && p.final_score >= 70
  )
  
  return completedProjects.length >= 3 // Minimum 3 passing projects for portfolio
}

/**
 * Generate portfolio preview URL
 */
export function generatePortfolioPreviewUrl(userId: string): string {
  return `${window.location.origin}/portfolio/preview/${userId}`
}

/**
 * Get recommended portfolio template based on student level
 */
export function getRecommendedTemplate(totalXP: number, projectCount: number): 'minimal' | 'professional' | 'showcase' {
  if (projectCount >= 10 && totalXP >= 5000) return 'showcase'
  if (projectCount >= 5 && totalXP >= 2000) return 'professional'
  return 'minimal'
}