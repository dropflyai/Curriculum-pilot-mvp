# CodeFly Project Documentation

## CRITICAL NAMING CONVENTIONS - READ FIRST

### Platform Name: CodeFly ✈️
- **CodeFly** is the educational platform/software we are building
- This is the product name that appears in all UI, headers, and branding
- CodeFly will eventually host multiple educational games

### Current Game: Agent Academy 🎮
- **Agent Academy** is the GAME NAME
- Agent Academy is the first game within the CodeFly platform
- The game teaches coding through a spy/agent themed adventure

### Agent Academy 8-Mission Structure:
1. **Binary Shores Academy** (Weeks 1-2) - Introduction & Setup
2. **Variable Village** (Weeks 3-4) - Data Types & Variables
3. **Logic Lake Outpost** (Weeks 5-7) - Conditionals & Boolean Logic
4. **Loop Canyon Base** (Weeks 8-10) - For/While Loops & Iteration
5. **Function Forest Station** (Weeks 11-13) - Functions & Parameters
6. **Array Mountains Facility** (Weeks 14-15) - Lists & Data Structures
7. **Object Oasis Complex** (Weeks 16-17) - Classes & OOP
8. **Database Depths** (Week 18) - Final Project & Data Management

### Hierarchy Summary:
```
CodeFly (Platform)
  └── Agent Academy (Game)
      ├── Binary Shores Academy (Operation 1)
      ├── Variable Village (Operation 2)
      ├── Logic Lake Outpost (Operation 3)
      ├── Loop Canyon Base (Operation 4)
      ├── Function Forest Station (Operation 5)
      ├── Array Mountains Facility (Operation 6)
      ├── Object Oasis Complex (Operation 7)
      └── Database Depths (Operation 8)
```

## Project Structure

### Repository Name
- Current: `Curriculum-pilot-mvp`
- Should rename to: `codefly-platform`

### Package.json Name
- Current: `coding-pilot-mvp`
- Should be: `codefly`

## UI Text Guidelines

### Correct Usage Examples:
- ✅ "Welcome to CodeFly - Learn To Code On The Fly"
- ✅ "Agent Academy: Mission 1 - Binary Shores Academy"
- ✅ "Begin your Agent Academy training at Binary Shores Academy"
- ✅ "CodeFly presents: Agent Academy"

### Incorrect Usage (AVOID):
- ❌ "Welcome to Binary Shores Academy" (Binary Shores is just one operation)
- ❌ "Binary Shores Academy Curriculum" (It's Agent Academy curriculum)
- ❌ "Binary Shores Academy Game" (The game is Agent Academy)

## Teacher Dashboard Requirements

The teacher dashboard should reflect:
1. **Platform branding**: CodeFly logo and colors
2. **Game context**: Agent Academy theming (spy/agent theme)
3. **Mission tracking**: Show student progress through all 8 Agent Academy operations
4. **Proper naming**: Use "Agent Academy" when referring to the game

## Student Experience

Students are:
- Playing the **Agent Academy** game
- On the **CodeFly** platform
- Progressing through **8 operations** across 18 weeks

## Future Expansion

CodeFly will eventually include:
- Agent Academy (Current - Beginner Python)
- [Future Game 2] (Intermediate Web Development)
- [Future Game 3] (Advanced Full-Stack)
- [Future Game 4] (AI/ML Concepts)

## Quick Reference

| Context | Correct Term | NOT |
|---------|-------------|-----|
| Platform/Software | CodeFly | Agent Academy, Binary Shores |
| Current Game | Agent Academy | Binary Shores, CodeFly Game |
| Week 1-2 Operation | Binary Shores Academy | Agent Academy Mission 1 |
| Curriculum Name | Agent Academy Curriculum | Binary Shores Curriculum |
| Dashboard Title | CodeFly Teacher Dashboard | Agent Academy Dashboard |

## Remember
- **CodeFly** = The platform (like Steam or Epic Games)
- **Agent Academy** = The game (like Fortnite or Minecraft)
- **Binary Shores Academy** = Operation 1 within the game (like Level 1 or Chapter 1)

## CRITICAL DEVELOPMENT RULES - NEVER VIOLATE

### 🚨 STRICT MODIFICATION POLICY
**ONLY modify what the user EXPLICITLY asks you to modify. NEVER change anything else.**

#### When user says:
- "Update the dashboard styling" → ONLY update styling, keep all existing functionality and content
- "Fix this component" → ONLY fix the specific issue, don't rewrite the entire component
- "Add a feature to X" → ONLY add to X, don't modify other components
- "Make it look like Y" → ONLY apply visual styling from Y, preserve all existing functionality

#### FORBIDDEN Actions:
- ❌ Replacing entire components when only styling was requested
- ❌ Removing existing functionality (tabs, maps, features) unless explicitly told
- ❌ Changing file structure or imports unless required for the specific task
- ❌ "Improving" code that wasn't mentioned in the request
- ❌ Rewriting working code just because you think it could be better

#### REQUIRED Actions:
- ✅ Ask for clarification if the request is ambiguous
- ✅ Preserve ALL existing functionality when making styling changes
- ✅ Use Edit/MultiEdit for targeted changes, not complete rewrites
- ✅ Test that existing features still work after changes

#### If you can't make the requested change without affecting other parts:
**STOP and explain the limitation. Ask for permission before making broader changes.**

## AGENT ACADEMY CURRICULUM - ENHANCED AI AGENT TRAINING

### 🎯 MISSION: LEARN AI AGENT DEVELOPMENT THROUGH SPY OPERATIONS

**Background**: Students are recruited as elite agents learning to deploy AI operatives (agents) to complete missions. The spy narrative teaches real AI workflow development through covert operations.

**Student Role**: Students are **AGENTS** progressing through specialized training facilities:
- Master Python for AI agent development
- Deploy and manage AI agents through APIs
- Build complete agentic workflows
- Develop ethical AI systems with real-world applications

### 🏗️ ENHANCED AGENT ACADEMY TRAINING FACILITIES

#### Operation 1: Binary Shores Academy (Weeks 1-2)
- **Focus**: Python basics for AI + Ethics introduction
- **Skills**: API integration (Claude/OpenAI), vibe coding, prompt engineering, bias awareness
- **Theme**: Recruitment and establishing secure AI channels
- **NEW**: Ethical AI guidelines, prerequisite assessment, cost management

#### Operation 2: Variable Village (Weeks 3-4)
- **Focus**: Data processing + Error recovery
- **Skills**: JSON manipulation, structured prompts, hallucination detection, data validation
- **Theme**: Decode scrambled intelligence with operational security
- **NEW**: Failure scenarios, debugging challenges, quality metrics

#### Operation 3: Logic Lake Outpost (Weeks 5-7)
- **Focus**: AI decision systems + Ethical frameworks
- **Skills**: Decision trees, multi-step chains, explainable AI, fairness metrics
- **Theme**: Navigate complex scenarios with ethical decision-making
- **NEW**: Algorithmic fairness, transparency, industry guest expert

#### Operation 4: Loop Canyon Base (Weeks 8-10)
- **Focus**: Batch processing + Environmental responsibility
- **Skills**: Parallel processing, rate limiting, resource optimization, carbon tracking
- **Theme**: Process massive data responsibly and efficiently
- **NEW**: Green AI practices, privacy preservation, sustainability

#### Operation 5: Function Forest Station (Weeks 11-13)
- **Focus**: AI tool creation + Safety constraints
- **Skills**: Function calling, tool creation, agent composition, abuse prevention
- **Theme**: Build modular AI tools with ethical guardrails
- **NEW**: Real company partnership, safety testing, industry challenge

#### Operation 6: Array Mountains Facility (Weeks 14-15)
- **Focus**: Knowledge systems + Privacy by design
- **Skills**: Vector embeddings, RAG systems, semantic search, data sovereignty
- **Theme**: Build knowledge systems with privacy and accuracy controls
- **NEW**: Data ethics mastery, consent frameworks, parent resources

#### Operation 7: Object Oasis Complex (Weeks 16-17)
- **Focus**: Multi-agent orchestration + Governance
- **Skills**: Multi-agent systems, state management, coordination ethics, oversight
- **Theme**: Orchestrate agent teams with governance frameworks
- **NEW**: AI governance, internship pathways, mentorship program

#### Operation 8: Database Depths (Week 18)
- **Focus**: Complete AI systems + Impact assessment
- **Skills**: Full-stack AI apps, monitoring, stakeholder communication, responsibility
- **Theme**: Deploy complete ethical AI transformation system
- **NEW**: Portfolio defense, industry presentation, comprehensive ethics exam

### 🕵️ AGENT TERMINOLOGY (Use These Terms)

**NEVER USE**:
- Quest Map → Use "Mission Map"  
- Guild Hall → Use "Agent Command" or "Field Ops Center"
- Players → Use "Agents"
- Quests → Use "Missions" or "Operations"
- Game → Use "Operation" or "Training Program"

**ALWAYS USE**:
- **Mission Map** - Tactical overview of training facilities
- **Agent Command** - Where agents coordinate and view team status  
- **Field Ops Center** - Mission briefings and team leaderboards
- **Agents** - The students in training
- **Operations** - Individual coding challenges/lessons
- **Training Facilities** - The 8 different learning environments
- **Tactical HUD** - The interface styling
- **Intel** - Information/hints
- **Clearance Level** - Student progress level
- **Mission Status** - Completion progress

### 🎨 VISUAL THEME
- Dark military/tactical interface (blacks, greens, amber)
- HUD overlays with scanning lines and tactical elements
- Monospace fonts for computer terminal feel
- Corner brackets and status indicators
- "CLASSIFIED" and "TOP SECRET" styling elements

## AGENT ACADEMY CHARACTER SYSTEM

### 🎭 AGENT AVATARS (Student Characters)
Students choose from specialized agent archetypes:

**🕵️‍♂️ CIPHER OPERATIVE** - The Classic Spy
- Starting bonus: +10% XP on logic challenges
- Special ability: Code Insight (bypass one error per lesson)
- Avatar: 🕵️‍♂️

**🤖 TECH SPECIALIST** - The Hacker
- Starting bonus: +15% faster debugging
- Special ability: System Override (skip one challenge per operation)  
- Avatar: 👨‍💻

**⚡ CYBER NINJA** - The Speed Runner
- Starting bonus: +20% completion speed bonus
- Special ability: Lightning Code (double XP for 5 minutes)
- Avatar: 🥷

**🔬 DATA ANALYST** - The Strategic Mind
- Starting bonus: +25% XP on logic puzzles
- Special ability: Pattern Recognition (get hints on complex problems)
- Avatar: 👩‍🔬

**🛡️ SECURITY EXPERT** - The Defender
- Starting bonus: Extra attempt on failed missions
- Special ability: Error Shield (prevent XP loss on mistakes)
- Avatar: 👨‍✈️

**🌟 ROOKIE AGENT** - The Beginner
- Starting bonus: +50% tutorial XP
- Special ability: Extended Time (longer time limits)
- Avatar: 🧑‍🎓

### 👑 COMMAND STRUCTURE (Instructors)

**🎖️ COMMANDER ATLAS** - Training Director
- Provides operation briefings and strategic guidance
- Unlocks advanced challenges at higher levels
- "Agent, let's master these coding fundamentals."

**📡 OPERATOR ECHO** - Intel Coordinator  
- Real-time hints and tactical support during operations
- Manages progress tracking and communications
- "Copy that, Agent. Guidance incoming."

**🔧 TECH CHIEF BINARY** - Systems Specialist
- Provides debugging tools and coding assistance
- Unlocks advanced IDE features and help systems
- "I've enhanced your development environment, Agent."

**🧠 DR. MAYA QUANTUM** - Research Lead
- Explains complex concepts and provides learning resources
- Final instructor who guides the capstone project
- "Understanding code patterns is the key to mastery."

### ⚡ PROGRESSION SYSTEM

#### 🎯 TACTICAL BOOSTERS (Temporary - 15-30 mins)
**Code Accelerator** - 2x coding speed and efficiency
**Debug Vision** - Highlights potential errors before running code  
**XP Amplifier** - 1.5x experience points for completed challenges
**Time Extension** - Extended time limits on timed challenges
**Hint Radar** - Extra hints available during current session
**Syntax Shield** - First syntax error auto-corrected per operation

#### 🛡️ PERMANENT UNLOCKS (XP Milestones)
**Level 5**: Advanced Code Editor (syntax highlighting, autocomplete)
**Level 10**: AI Assistant Integration (coding suggestions)
**Level 15**: Operation Replay Access (redo completed operations for XP)
**Level 20**: Speed Mode (optional time challenges for bonus XP)
**Level 25**: Master Debugger (advanced error analysis tools)
**Level 30**: Code Arsenal (pre-built code snippets library)

#### 🏆 SPECIALIST EQUIPMENT (Earned through operations)
**Enhanced Keyboard** - Reduces typos, faster code input
**Neural Interface** - Better problem-solving hints and AI assistance
**Advanced Compiler** - Run code with enhanced feedback
**Data Analyzer** - Navigate complex data structure challenges
**Logic Shield** - Protection against losing XP on failed attempts
**Pattern Scanner** - Identify code patterns and solutions
**Visual Display** - Enhanced coding environment
**Memory Bank** - Remember syntax and functions better
**Processing Core** - Faster computational thinking

### 📈 PROGRESSION MECHANICS

#### What Gets Enhanced:
1. **Coding Speed** - Faster lesson completion through practice
2. **XP Multipliers** - More points per correct solution
3. **Error Tolerance** - Extra attempts and better feedback
4. **Hint Access** - More guidance and learning resources
5. **Time Management** - Better pacing and extended time when needed
6. **Advanced Tools** - Enhanced IDE features and debugging
7. **Replay Access** - Review and repeat operations for mastery
8. **Team Features** - Collaboration tools with other agents

## LEARNING MECHANICS (Educational Focus)

### 🔬 PROGRESSIVE COLLABORATION FRAMEWORK
**Phase 1: Solo Foundation (Weeks 1-4)**
- **Individual Mastery**: Personal AI agent development
- **Self-Assessment**: Track your own progress and skills
- **Code Portfolio**: Build personal project library
- **Skills Tracking**: Coding, problem-solving, communication metrics

**Phase 2: Pair Programming (Weeks 5-8)**  
- **Partner Missions**: Work with one teammate on shared goals
- **Code Sharing**: Learn Git collaboration and code reviews
- **Debugging Together**: Help each other solve problems
- **Communication Skills**: Practice explaining code and concepts

**Phase 3: Small Squads (Weeks 9-12)**
- **3-Person Teams**: Role specialization and project management
- **Team Projects**: Multi-agent systems and business workflows  
- **Leadership Rotation**: Everyone takes turns leading
- **Conflict Resolution**: Learn to work through disagreements

**Phase 4: Mission Teams (Weeks 13-16)**
- **4-Person Balanced Teams**: Smart algorithm balances skills
- **Complex Projects**: Complete AI solutions for real problems
- **Quality Assurance**: Team code reviews and testing
- **Client Simulation**: Present to stakeholders

**Phase 5: Elite Squadrons (Weeks 17-18)**
- **5-6 Person Capstone Teams**: Industry partnership projects
- **Cross-Team Communication**: Coordinate with other squads
- **Professional Presentation**: Present to real companies
- **Portfolio Defense**: Team and individual achievements

### 🤖 SMART TEAM BALANCING ALGORITHM
Our AI system automatically creates balanced teams based on:
- **Skill Levels**: Coding, problem-solving, communication, leadership
- **Personality Types**: Leaders, supporters, creative, analytical  
- **Preferred Roles**: Architect, implementer, tester, presenter
- **Previous Teammates**: Ensures variety and prevents cliques
- **Learning Goals**: Matches complementary strengths and growth areas

## 🚨 TROUBLESHOOTING PROTOCOL - MANDATORY

### When Issues Occur, ALWAYS:

1. **FIRST CHECK**: `KNOWN-SOLUTIONS.md` - We've solved this before? Use that solution!
2. **FOLLOW PROTOCOL**: Use `TROUBLESHOOTING-PROTOCOL.md` systematically
3. **LOG EVERYTHING**: Document each attempt in the protocol
4. **UPDATE KNOWLEDGE**: Add new solutions to `KNOWN-SOLUTIONS.md` after fixing
5. **TRACK AGENTS**: Log all deployed agents in `AGENT-REGISTRY.md`

### Quick Access Files:
- `KNOWN-SOLUTIONS.md` - Database of working fixes
- `TROUBLESHOOTING-PROTOCOL.md` - Systematic debugging approach
- `AGENT-REGISTRY.md` - Specialized agent tracking and efficiency metrics

### Efficiency Rules:
1. **NO REPEATED FAILURES** - Check logs before attempting same solution
2. **SPEED IS KEY** - Known issues should be fixed in < 2 minutes
3. **DOCUMENT SUCCESS** - Every new solution goes in KNOWN-SOLUTIONS.md
4. **IMPROVE AGENTS** - Update templates when agents aren't fast enough
5. **MEASURE EVERYTHING** - Track resolution times in AGENT-REGISTRY.md